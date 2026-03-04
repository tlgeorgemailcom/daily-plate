<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { playerStore, type Player } from '$lib/stores/playerStore';
  import StartScreen from '$lib/components/StartScreen.svelte';
  import LoginModal from '$lib/farmers-basket/LoginModal.svelte';
  
  let { children } = $props();
  
  // Player authentication state
  let showLoginModal = $state(false);
  
  // Session-only state for guest players (resets on refresh)
  let guestSessionStarted = $state(false);
  
  // Subscribe to player store reactively
  let player = $state<Player | null>(null);
  $effect(() => {
    const unsub = playerStore.subscribe(p => player = p);
    return unsub;
  });
  
  // Check if player has started (logged in persists, guest is session-only)
  let hasStarted = $derived((player?.status === 'logged-in' && player?.id !== null) || guestSessionStarted);
  
  function handleGameStart() {
    // Guest mode - mark session as started and go to game list
    guestSessionStarted = true;
    goto('/');
  }
  
  function handleShowLogin() {
    showLoginModal = true;
  }
  
  function handleLoginSuccess() {
    showLoginModal = false;
  }
  
  function handleLoginClose() {
    showLoginModal = false;
  }
</script>

{#if hasStarted}
  <!-- Use full-width layout for games that need more space -->
  {@const isFullWidthGame = $page.url.pathname === '/farmers-basket' || $page.url.pathname === '/tower'}
  <div class="app" class:full-width={isFullWidthGame}>
    <div class="nav-wrapper">
    <nav>
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
{:else}
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
