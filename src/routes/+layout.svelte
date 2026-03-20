<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  type UmamiWindow = Window & { umami?: { track: (name: string, data?: Record<string, unknown>) => void } };
  const eventQueue: Array<{ name: string; props?: Record<string, unknown> }> = [];

  function track(eventName: string, props?: Record<string, unknown>) {
    if (typeof window === 'undefined') return;
    const umami = (window as UmamiWindow).umami;
    if (umami) {
      umami.track(eventName, props);
    } else {
      eventQueue.push({ name: eventName, props });
    }
    // Include browser-local date so reports group by the user's calendar day, not UTC
    const local_date = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
    // Also log to our own Turso-backed endpoint (fire-and-forget)
    fetch('/api/log-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: eventName, data: { local_date, ...(props ?? {}) } }),
    }).catch(() => {/* ignore */});
  }

  function flushEventQueue() {
    const umami = (window as UmamiWindow).umami;
    if (!umami) return;
    eventQueue.splice(0).forEach(e => umami.track(e.name, e.props));
  }
  import { playerStore, type Player } from '$lib/stores/playerStore';
  import { get } from 'svelte/store';
  import { syncCustomFoodsFromCloud } from '$lib/stores/customFoodsStore';
  import { syncSettingsFromCloud } from '$lib/stores/settingsStore';
  import { syncGameStateFromCloud } from '$lib/stores/gameStateStore';
  import { syncAllGameDataFromCloud, enableAutoSync } from '$lib/stores/gameDataSync';
  import StartScreen from '$lib/components/StartScreen.svelte';
  import LoginModal from '$lib/farmers-basket/LoginModal.svelte';
  import UpgradeModal from '$lib/components/UpgradeModal.svelte';
  
  let { children } = $props();
  
  // Player authentication state
  let showLoginModal = $state(false);
  let showUpgradeModal = $state(false);
  let showUpgradePasswordModal = $state(false);
  let upgradePasswordInput = $state('');
  let upgradePasswordError = $state(false);
  const UPGRADE_PASSWORD = '4444';
  
  // Session-only state for guest players (resets on refresh)
  let guestSessionStarted = $state(false);
  
  // Subscribe to player store reactively — initialized synchronously to avoid StartScreen flash
  let player = $state<Player | null>(get(playerStore));
  $effect(() => {
    const unsub = playerStore.subscribe(p => player = p);
    return unsub;
  });
  
  // Validate session on app load to ensure tier accuracy
  onMount(async () => {
    await playerStore.validateSession();

    // --- Visitor tracking ---
    const visitCount = parseInt(localStorage.getItem('va_visit_count') || '0') + 1;
    localStorage.setItem('va_visit_count', String(visitCount));
    const firstSeen = localStorage.getItem('va_first_seen') || new Date().toISOString().split('T')[0];
    if (visitCount === 1) localStorage.setItem('va_first_seen', firstSeen);
    const lastSeen = localStorage.getItem('va_last_seen') || '';
    localStorage.setItem('va_last_seen', new Date().toISOString().split('T')[0]);

    const nav = navigator as Navigator & { connection?: { effectiveType?: string } };

    // --- Device fingerprint (stable cross-session estimate) ---
    async function getDeviceFingerprint(): Promise<string> {
      const raw = [
        window.screen.width, window.screen.height, window.screen.colorDepth,
        navigator.hardwareConcurrency ?? '',
        (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? '',
        navigator.language,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        navigator.platform ?? '',
      ].join('|');
      const msgBuffer = new TextEncoder().encode(raw);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      return Array.from(new Uint8Array(hashBuffer)).slice(0, 6).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    const fingerprint = await getDeviceFingerprint();
    deviceFp = fingerprint;

    track('session_start', {
      visit_count:    visitCount,
      returning:      visitCount > 1,
      first_seen:     firstSeen,
      last_seen:      lastSeen || null,
      referrer:       document.referrer ? new URL(document.referrer).hostname : 'direct',
      screen:         `${window.screen.width}x${window.screen.height}`,
      viewport:       `${window.innerWidth}x${window.innerHeight}`,
      device_type:    window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
      language:       navigator.language,
      timezone:       Intl.DateTimeFormat().resolvedOptions().timeZone,
      connection:     nav.connection?.effectiveType ?? null,
      player_status:  player?.status ?? 'anonymous',
      player_tier:    player?.tier ?? 'free',
      device_fp:      fingerprint,
    });

    // Flush any events queued before Umami script finished loading
    flushEventQueue();

    // Capture duration on tab close/switch (visibilitychange is reliable for analytics)
    function handleVisibilityHidden() {
      if (document.visibilityState === 'hidden' && currentGame && gameStartTime !== null) {
        const duration = Math.round((Date.now() - gameStartTime) / 1000);
        const bucket = duration < 30 ? '<30s' : duration < 120 ? '30s-2min' : duration < 300 ? '2-5min' : '5min+';
        track(`exit:${currentGame}:${bucket}`, {
          duration_seconds: duration,
          player_tier:    player?.tier ?? 'free',
          player_status:  player?.status ?? 'anonymous',
          device_fp:      deviceFp,
        });
        gameStartTime = null;
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityHidden);
    return () => document.removeEventListener('visibilitychange', handleVisibilityHidden);
  });
  
  // Enable auto-sync for returning premium users
  $effect(() => {
    if (player?.status === 'logged-in' && player?.tier === 'premium') {
      enableAutoSync();
    }
  });

  // --- Game time tracking ---
  const GAME_ROUTES: Record<string, string> = {
    '/chain':         'chain',
    '/compare':       'compare',
    '/plate':         'plate',
    '/balanced-diet': 'balanced-diet',
    '/matching':      'matching',
    '/slider':        'slider',
    '/scrambled':     'scrambled',
    '/tower':         'tower',
    '/farmers-basket':'farmers-basket',
    '/archive':       'archive',
  };

  let currentGame = $state<string | null>(null);
  let gameStartTime = $state<number | null>(null);
  let deviceFp = $state<string>('');

  $effect(() => {
    const path = $page.url.pathname;
    const gameKey = Object.keys(GAME_ROUTES).find(r => path === r || path.startsWith(r + '/'));
    const gameName = gameKey ? GAME_ROUTES[gameKey] : null;

    if (gameName !== currentGame) {
      // Leaving a game — fire exit event
      if (currentGame && gameStartTime !== null) {
        const duration = Math.round((Date.now() - gameStartTime) / 1000);
        const bucket = duration < 30 ? '<30s' : duration < 120 ? '30s-2min' : duration < 300 ? '2-5min' : '5min+';
        track(`exit:${currentGame}:${bucket}`, {
          duration_seconds: duration,
          player_tier:    player?.tier ?? 'free',
          player_status:  player?.status ?? 'anonymous',
          device_fp:      deviceFp,
        });
      }
      // Entering a game — fire enter event
      if (gameName) {
        track(`enter:${gameName}`, {
          player_tier:    player?.tier ?? 'free',
          player_status:  player?.status ?? 'anonymous',
          visit_count:    parseInt(localStorage.getItem('va_visit_count') || '1'),
          device_fp:      deviceFp,
        });
      }
      currentGame = gameName;
      gameStartTime = gameName ? Date.now() : null;
    }
  });
  
  // Check if player has started (logged in persists, guest is session-only)
  let hasStarted = $derived((player?.status === 'logged-in' && player?.id !== null) || guestSessionStarted);
  
  // Check if user can upgrade (logged in but not premium)
  let canUpgrade = $derived(player?.status === 'logged-in' && player?.tier !== 'premium');

  function handleGameStart() {
    // Guest mode - mark session as started and go to game list
    guestSessionStarted = true;
    track('guest_start', {
      visit_count: parseInt(localStorage.getItem('va_visit_count') || '1'),
      returning: parseInt(localStorage.getItem('va_visit_count') || '1') > 1,
    });
    goto('/');
  }
  
  function handleShowLogin() {
    showLoginModal = true;
  }
  
  async function handleLoginSuccess() {
    console.log('[Layout] handleLoginSuccess called');
    showLoginModal = false;
    
    // Small delay to ensure player store has updated
    await new Promise(r => setTimeout(r, 100));
    
    // Log current player state before sync
    const currentPlayer = player;
    console.log('[Layout] Current player before sync:', {
      id: currentPlayer?.id,
      status: currentPlayer?.status,
      tier: currentPlayer?.tier
    });

    track('player_login', {
      tier: currentPlayer?.tier ?? 'free',
      visit_count: parseInt(localStorage.getItem('va_visit_count') || '1'),
      returning: parseInt(localStorage.getItem('va_visit_count') || '1') > 1,
    });
    
    // Sync data from cloud if user is premium
    await Promise.all([
      syncCustomFoodsFromCloud(),
      syncSettingsFromCloud(),
      syncGameStateFromCloud(),
      syncAllGameDataFromCloud()
    ]);
    
    // Enable auto-sync for future localStorage changes
    enableAutoSync();
    
    console.log('[Layout] cloud sync completed');
  }
  
  function handleLoginClose() {
    showLoginModal = false;
  }
  
  function handleShowUpgrade() {
    upgradePasswordInput = '';
    upgradePasswordError = false;
    showUpgradePasswordModal = true;
  }

  function handleUpgradePasswordSubmit() {
    if (upgradePasswordInput === UPGRADE_PASSWORD) {
      showUpgradePasswordModal = false;
      showUpgradeModal = true;
    } else {
      upgradePasswordError = true;
      upgradePasswordInput = '';
    }
  }
  
  async function handleUpgradeSuccess() {
    showUpgradeModal = false;
    // Sync data to/from cloud now that user is premium
    await Promise.all([
      syncCustomFoodsFromCloud(),
      syncSettingsFromCloud(),
      syncGameStateFromCloud(),
      syncAllGameDataFromCloud()
    ]);
    
    // Enable auto-sync for future localStorage changes
    enableAutoSync();
  }
  
  function handleUpgradeClose() {
    showUpgradeModal = false;
  }
</script>

{#if hasStarted}
  <!-- Use full-width layout for games that need more space -->
  {@const isFullWidthGame = $page.url.pathname.startsWith('/farmers-basket') || $page.url.pathname === '/tower'}
  <div class="app" class:full-width={isFullWidthGame}>
    <div class="nav-wrapper">
    <nav>
      {#if player?.status === 'anonymous'}
        <button class="login-btn" onclick={handleShowLogin}>
          🔑 Login
        </button>
      {:else if canUpgrade}
        <button class="upgrade-btn" onclick={handleShowUpgrade}>
          ⭐ Upgrade
        </button>
      {/if}
      <a href="/chain" class:active={$page.url.pathname === '/chain'}>
        🔗 Chain
      </a>
      <a href="/plate" class:active={$page.url.pathname === '/plate'}>
        🍽️ Plate
      </a>
      <a href="/balanced-diet" class:active={$page.url.pathname === '/balanced-diet'}>
        🥗 Balance
      </a>
      <a href="/matching" class:active={$page.url.pathname === '/matching'}>
        🎯 Match
      </a>
      <a href="/slider" class:active={$page.url.pathname === '/slider'}>
        🧩 Slider
      </a>
      <a href="/compare" class:active={$page.url.pathname === '/compare'}>
        👆 Compare
      </a>
      <a href="/farmers-basket" class:active={$page.url.pathname === '/farmers-basket'}>
        🧺 Basket
      </a>
      <a href="/scrambled" class:active={$page.url.pathname === '/scrambled'}>
        🐝 Bees
      </a>
      <a href="/tower" class:active={$page.url.pathname === '/tower'}>
        🗼 Tower
      </a>
      <a href="/archive" class:active={$page.url.pathname === '/archive'}>
        📅 Archive
      </a>
      {#if player?.tier === 'premium'}
        <a href="/stats" class:active={$page.url.pathname.startsWith('/stats')}>
          📊 Share/Stats
        </a>
      {/if}
    </nav>
    <div class="scroll-indicator">→</div>
  </div>
    
    <main>
      {@render children()}
    </main>
    
    <footer>
      <p>A new puzzle every day!</p>
    </footer>
  </div>
{:else if browser}
  <StartScreen 
    mode="auth"
    onStart={handleGameStart}
    onLogin={handleShowLogin}
  />
{/if}

{#if showLoginModal}
  <LoginModal 
    onSuccess={handleLoginSuccess}
    onClose={handleLoginClose}
  />
{/if}

{#if showUpgradeModal}
  <UpgradeModal 
    onSuccess={handleUpgradeSuccess}
    onClose={handleUpgradeClose}
  />
{/if}

{#if showUpgradePasswordModal}
  <div class="password-overlay" role="dialog" aria-modal="true">
    <div class="password-box">
      <h2>Beta Access</h2>
      <p style="margin:0; font-size:0.9rem; color:#555;">During Beta, paid subscriptions require pre-approval. Please enter your access code.</p>
      <input
        type="password"
        bind:value={upgradePasswordInput}
        placeholder="••••"
        class="password-input"
        class:error={upgradePasswordError}
        onkeydown={(e) => e.key === 'Enter' && handleUpgradePasswordSubmit()}
      />
      {#if upgradePasswordError}
        <p class="error-text">Incorrect code</p>
      {/if}
      <div class="password-actions">
        <button onclick={handleUpgradePasswordSubmit}>Continue</button>
        <button onclick={() => showUpgradePasswordModal = false}>Cancel</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 600px;
    margin: 0 auto;
    padding: var(--spacing-md);
  }
  
  .app.full-width {
    max-width: none;
    padding: 0;
    overflow-y: auto;
  }
  
  .app.full-width main {
    padding: 0;
  }

  .nav-wrapper {
    position: relative;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 1rem;
  }

  .scroll-indicator {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1) 50%);
    color: #6b7280;
    font-size: 1.25rem;
    font-weight: bold;
    pointer-events: none;
    z-index: 10;
  }
  
  nav {
    display: flex;
    justify-content: flex-start;
    gap: 0.75rem;
    padding: 0.75rem 0;
    padding-right: 32px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 #f1f1f1;
  }

  nav::-webkit-scrollbar {
    height: 4px;
  }

  nav::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
  }

  nav::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
  }

  nav::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
  
  nav a {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    text-decoration: none;
    font-weight: 600;
    color: #6b7280;
    background: #f3f4f6;
    transition: all 0.2s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  nav a:hover {
    background: #e5e7eb;
  }
  
  nav a.active {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
  }
  
  .upgrade-btn {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;
    border: none;
    cursor: pointer;
    background: linear-gradient(135deg, #ffd700, #ffb700);
    color: #1a1a2e;
    transition: all 0.2s;
  }
  
  .upgrade-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  }

  .login-btn {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;
    border: none;
    cursor: pointer;
    background: linear-gradient(135deg, #FF9800, #e68900);
    color: #fff;
    transition: all 0.2s;
  }

  .login-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
  }

  .password-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .password-box {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 280px;
    text-align: center;
  }

  .password-box h2 {
    margin: 0;
    font-size: 1.2rem;
  }

  .password-input {
    padding: 0.6rem 1rem;
    border: 2px solid #ccc;
    border-radius: 8px;
    font-size: 1.2rem;
    text-align: center;
    letter-spacing: 0.3em;
    width: 100%;
    box-sizing: border-box;
  }

  .password-input.error {
    border-color: #e53935;
  }

  .error-text {
    color: #e53935;
    margin: 0;
    font-size: 0.9rem;
  }

  .password-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .password-actions button {
    padding: 0.5rem 1.2rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
  }

  .password-actions button:first-child {
    background: #FF9800;
    color: white;
  }

  .password-actions button:last-child {
    background: #eee;
    color: #333;
  }
  
  main {
    flex: 1;
    width: 100%;
  }
  
  footer {
    text-align: center;
    padding: var(--spacing-lg) 0;
    color: #888;
    font-size: 0.875rem;
  }
  
  @media (min-width: 768px) {
    header h1 {
      font-size: 2.5rem;
    }
  }
  
  /* Login styles */
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 1rem;
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  }
  
  .login-box {
    background: white;
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 400px;
    width: 100%;
  }
  
  .login-box h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
  }
  
  .login-box p {
    color: #6b7280;
    margin-bottom: 1.5rem;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .password-input {
    padding: 0.875rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }
  
  .password-input:focus {
    outline: none;
    border-color: #22c55e;
  }
  
  .login-button {
    padding: 0.875rem 1rem;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.2s;
  }
  
  .login-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  }
  
  .login-button:active {
    transform: translateY(0);
  }
  
  .error {
    color: #ef4444;
    margin-top: 1rem;
    font-size: 0.875rem;
  }
</style>
