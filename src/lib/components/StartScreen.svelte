<script lang="ts">
  import { goto } from '$app/navigation';
  import { playerStore } from '$lib/stores/playerStore';
  
  interface Props {
    mode?: 'auth' | 'games';
    onStart: () => void;
    onLogin: () => void;
    onSelectGame?: (gameId: string) => void;
  }
  
  let { mode = 'auth', onStart, onLogin, onSelectGame }: Props = $props();
  
  const games = [
    { id: 'farmers-basket', name: "Farmer's Basket", icon: '🧺', description: 'Collect ingredients for recipes', available: true },
    { id: 'balanced-diet', name: 'Balanced Diet', icon: '🍽️', description: 'Build nutritious meals', available: true },
    { id: 'food-scramble', name: 'Food Scramble', icon: '🔤', description: 'Unscramble food words', available: false },
    { id: 'food-tower', name: 'Food Tower', icon: '🏗️', description: 'Stack foods by nutrients', available: false }
  ];
  
  function handlePlayAnonymous() {
    playerStore.playAsAnonymous();
    onStart();
  }
  
  function handleLogin() {
    onLogin();
  }
  
  function handleSelectGame(gameId: string) {
    if (gameId === 'farmers-basket') {
      onSelectGame?.(gameId);
    } else if (gameId === 'balanced-diet') {
      goto('/balanced-diet');
    }
  }
</script>

<div class="start-screen">
  <div class="start-content">
    <!-- Logo and Title -->
    <div class="header">
      <div class="logo">🎮</div>
      <h1 class="title">Daily Food Games</h1>
      <p class="tagline">{mode === 'auth' ? 'Learn nutrition through fun daily puzzles!' : 'Choose your daily puzzle!'}</p>
    </div>
    
    {#if mode === 'auth'}
      <!-- Auth Mode: Login/Guest buttons -->
      <div class="actions">
        <button class="btn btn-primary" onclick={handleLogin}>
          <span class="btn-icon">👤</span>
          <span class="btn-text">
            <span class="btn-label">Login</span>
            <span class="btn-sub">Sync progress & unlock features</span>
          </span>
        </button>
        
        <button class="btn btn-secondary" onclick={handlePlayAnonymous}>
          <span class="btn-icon">🎮</span>
          <span class="btn-text">
            <span class="btn-label">Play as Guest</span>
            <span class="btn-sub">Start playing instantly</span>
          </span>
        </button>
      </div>
      
      <!-- Tier Info -->
      <div class="tier-info">
        <div class="tier guest">
          <span class="tier-badge">Guest</span>
          <span class="tier-desc">Progress clears after each game</span>
        </div>
        <div class="tier free">
          <span class="tier-badge">Free</span>
          <span class="tier-desc">Progress saved on this device</span>
        </div>
        <div class="tier paid">
          <span class="tier-badge">Paid</span>
          <span class="tier-desc">Progress synced across all devices</span>
        </div>
      </div>
    {:else}
      <!-- Games Mode: Game selection list -->
      <div class="games-list">
        {#each games as game}
          <button 
            class="game-btn" 
            class:unavailable={!game.available}
            onclick={() => game.available && handleSelectGame(game.id)}
            disabled={!game.available}
          >
            <span class="game-icon">{game.icon}</span>
            <div class="game-info">
              <span class="game-name">{game.name}</span>
              <span class="game-desc">{game.description}</span>
            </div>
            {#if !game.available}
              <span class="coming-soon">Coming Soon</span>
            {:else}
              <span class="play-arrow">▶</span>
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  </div>
  
  <!-- Decorative Elements -->
  <div class="decoration decoration-left">🥬</div>
  <div class="decoration decoration-right">🍎</div>
  <div class="decoration decoration-bottom-left">🧀</div>
  <div class="decoration decoration-bottom-right">🥚</div>
</div>

<style>
  .start-screen {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #87CEEB 0%, #98FB98 50%, #DEB887 100%);
    padding: 20px;
    overflow: hidden;
    z-index: 100;
  }
  
  .start-content {
    background: white;
    border-radius: 24px;
    padding: 32px 28px;
    max-width: 420px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    text-align: center;
    position: relative;
    z-index: 1;
  }
  
  .header {
    margin-bottom: 20px;
  }
  
  .logo {
    font-size: 56px;
    margin-bottom: 8px;
    animation: bounce 2s ease-in-out infinite;
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .title {
    font-size: 1.8rem;
    font-weight: 800;
    color: #2E7D32;
    margin: 0 0 6px;
    text-shadow: 2px 2px 0 #C8E6C9;
  }
  
  .tagline {
    color: #666;
    font-size: 0.9rem;
    margin: 0;
  }
  
  .actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }
  
  .btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 20px;
    border: none;
    border-radius: 14px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    width: 100%;
  }
  
  .btn:hover {
    transform: translateY(-2px);
  }
  
  .btn:active {
    transform: translateY(0);
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(46, 125, 50, 0.3);
  }
  
  .btn-primary:hover {
    box-shadow: 0 6px 20px rgba(46, 125, 50, 0.4);
  }
  
  .btn-secondary {
    background: #F5F5F5;
    color: #333;
    border: 2px solid #E0E0E0;
  }
  
  .btn-secondary:hover {
    background: #EEEEEE;
    border-color: #BDBDBD;
  }
  
  .btn-icon {
    font-size: 1.5rem;
  }
  
  .btn-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .btn-label {
    font-weight: 700;
    font-size: 1.1rem;
  }
  
  .btn-sub {
    font-size: 0.75rem;
    opacity: 0.8;
  }
  
  .tier-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .tier {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: 8px;
    background: #FAFAFA;
    text-align: left;
  }
  
  .tier-badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
    white-space: nowrap;
    min-width: 110px;
    text-align: left;
  }
  
  .tier.guest .tier-badge {
    background: #F5F5F5;
    color: #666;
  }
  
  .tier.free .tier-badge {
    background: #E3F2FD;
    color: #1565C0;
  }
  
  .tier.paid .tier-badge {
    background: linear-gradient(135deg, #FFD700 0%, #FFA000 100%);
    color: #5D4037;
  }
  
  .tier-desc {
    font-size: 0.65rem;
    color: #666;
    line-height: 1.3;
  }
  
  /* Games List */
  .games-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .game-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border: 2px solid #E0E0E0;
    border-radius: 14px;
    background: #FAFAFA;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    width: 100%;
  }
  
  .game-btn:not(.unavailable):hover {
    border-color: #4CAF50;
    background: #F1F8E9;
    transform: translateX(4px);
  }
  
  .game-btn.unavailable {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .game-btn .game-icon {
    font-size: 2rem;
  }
  
  .game-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .game-name {
    font-weight: 600;
    font-size: 1rem;
    color: #333;
  }
  
  .game-desc {
    font-size: 0.75rem;
    color: #777;
  }
  
  .play-arrow {
    font-size: 1.2rem;
    color: #4CAF50;
  }
  
  .coming-soon {
    font-size: 0.65rem;
    background: #FFE0B2;
    color: #E65100;
    padding: 3px 8px;
    border-radius: 10px;
    font-weight: 600;
  }

  /* Decorative elements */
  .decoration {
    position: fixed;
    font-size: 4rem;
    opacity: 0.5;
    animation: float 4s ease-in-out infinite;
    pointer-events: none;
  }
  
  .decoration-left {
    top: 15%;
    left: 5%;
    animation-delay: 0s;
  }
  
  .decoration-right {
    top: 20%;
    right: 5%;
    animation-delay: 1s;
  }
  
  .decoration-bottom-left {
    bottom: 15%;
    left: 8%;
    animation-delay: 2s;
  }
  
  .decoration-bottom-right {
    bottom: 20%;
    right: 8%;
    animation-delay: 3s;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(5deg); }
  }
  
  /* Mobile adjustments */
  @media (max-width: 500px) {
    .start-content {
      padding: 24px 20px;
      border-radius: 20px;
    }
    
    .logo {
      font-size: 44px;
    }
    
    .title {
      font-size: 1.5rem;
    }
    
    .tagline {
      font-size: 0.85rem;
    }
    
    .decoration {
      font-size: 2.5rem;
      opacity: 0.3;
    }
  }
</style>
