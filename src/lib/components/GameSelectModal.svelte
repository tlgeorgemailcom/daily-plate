<script lang="ts">
  import { goto } from '$app/navigation';
  
  interface Props {
    onSelectGame: (game: string) => void;
    onClose: () => void;
  }
  
  let { onSelectGame, onClose }: Props = $props();

  const BASKET_PASSWORD = '4444';
  let showBasketPasswordModal = $state(false);
  let basketPasswordInput = $state('');
  let basketPasswordError = $state(false);

  function handleBasketPasswordSubmit() {
    if (basketPasswordInput === BASKET_PASSWORD) {
      showBasketPasswordModal = false;
      onSelectGame('farmers-basket');
    } else {
      basketPasswordError = true;
      basketPasswordInput = '';
    }
  }

  const games = [
    { id: 'farmers-basket', name: "Farmer's Basket", icon: '🧺', description: 'Collect ingredients for recipes', available: true },
    { id: 'balanced-diet', name: 'Balanced Diet', icon: '🍽️', description: 'Build nutritious meals', available: true },
    { id: 'food-scramble', name: 'Food Scramble', icon: '🔤', description: 'Unscramble food words', available: false },
    { id: 'food-tower', name: 'Food Tower', icon: '🏗️', description: 'Stack foods by nutrients', available: false }
  ];
  
  function handleSelectGame(gameId: string) {
    if (gameId === 'farmers-basket') {
      basketPasswordInput = '';
      basketPasswordError = false;
      showBasketPasswordModal = true;
    } else if (gameId === 'balanced-diet') {
      goto('/balanced-diet');
    } else {
      // Coming soon games
      onSelectGame(gameId);
    }
  }
</script>

<div class="modal-overlay" onclick={onClose}>
  <div class="modal" onclick={(e) => e.stopPropagation()}>
    <button class="close-btn" onclick={onClose}>×</button>
    
    <h2 class="title">🎮 Daily Food Games</h2>
    <p class="subtitle">Choose your daily puzzle!</p>
    
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
  </div>
</div>

{#if showBasketPasswordModal}
  <div class="password-overlay" role="dialog" aria-modal="true">
    <div class="password-box">
      <h2>Beta Access</h2>
      <p style="margin:0 0 14px; font-size:0.9rem; color:#555;">During Beta, the Basket game requires pre-approval. Please enter your access code.</p>
      <input
        type="password"
        bind:value={basketPasswordInput}
        placeholder="Access code"
        onkeydown={(e) => e.key === 'Enter' && handleBasketPasswordSubmit()}
        style="width:100%; padding:10px 12px; border:2px solid {basketPasswordError ? '#e53935' : '#ddd'}; border-radius:10px; font-size:1rem; margin-bottom:8px; box-sizing:border-box;"
      />
      {#if basketPasswordError}
        <p style="color:#e53935; font-size:0.85rem; margin:0 0 10px;">Incorrect code. Please try again.</p>
      {/if}
      <div style="display:flex; gap:10px; margin-top:6px;">
        <button onclick={handleBasketPasswordSubmit} style="flex:1; padding:10px; background:linear-gradient(135deg,#FF9800,#e68900); color:white; border:none; border-radius:10px; font-weight:700; font-size:1rem; cursor:pointer;">
          Submit
        </button>
        <button onclick={() => showBasketPasswordModal = false} style="flex:1; padding:10px; background:#f0f0f0; color:#555; border:none; border-radius:10px; font-weight:600; font-size:1rem; cursor:pointer;">
          Cancel
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 20px;
  }
  
  .modal {
    background: white;
    border-radius: 20px;
    padding: 28px 24px;
    max-width: 400px;
    width: 100%;
    position: relative;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }
  
  .close-btn {
    position: absolute;
    top: 12px;
    right: 16px;
    background: none;
    border: none;
    font-size: 1.8rem;
    color: #999;
    cursor: pointer;
    line-height: 1;
  }
  
  .close-btn:hover {
    color: #333;
  }
  
  .title {
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    margin: 0 0 4px;
    color: #333;
  }
  
  .subtitle {
    text-align: center;
    color: #666;
    font-size: 0.9rem;
    margin: 0 0 20px;
  }
  
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
  
  .game-icon {
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

  .password-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 300;
    padding: 20px;
  }

  .password-box {
    background: white;
    border-radius: 18px;
    padding: 28px 24px;
    max-width: 360px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.35);
  }

  .password-box h2 {
    margin: 0 0 10px;
    font-size: 1.3rem;
    color: #333;
  }
</style>
