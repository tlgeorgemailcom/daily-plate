<script lang="ts">
  import { playerStore } from '$lib/stores/playerStore';
  
  interface Props {
    onStart: () => void;
    onLogin: () => void;
  }
  
  let { onStart, onLogin }: Props = $props();
  
  function handlePlayAnonymous() {
    playerStore.playAsAnonymous();
    onStart();
  }
  
  function handleLogin() {
    onLogin();
  }
</script>

<div class="start-screen">
  <div class="start-content">
    <!-- Logo and Title -->
    <div class="header">
      <div class="logo">🧺</div>
      <h1 class="title">Farmer's Basket</h1>
      <p class="tagline">Collect ingredients, create recipes, outsmart hungry critters!</p>
    </div>
    
    <!-- Features Preview -->
    <div class="features">
      <div class="feature">
        <span class="feature-icon">🥕</span>
        <span class="feature-text">Collect fresh ingredients</span>
      </div>
      <div class="feature">
        <span class="feature-icon">🐰</span>
        <span class="feature-text">Protect from animals</span>
      </div>
      <div class="feature">
        <span class="feature-icon">📖</span>
        <span class="feature-text">Unlock real recipes</span>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="actions">
      <button class="btn btn-primary" onclick={handleLogin}>
        <span class="btn-icon">👤</span>
        <span class="btn-text">
          <span class="btn-label">Login</span>
          <span class="btn-sub">Sync progress & unlock premium</span>
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
      <div class="tier free">
        <span class="tier-badge">Free</span>
        <span class="tier-desc">10 levels • Daily recipes</span>
      </div>
      <div class="tier premium">
        <span class="tier-badge">Premium</span>
        <span class="tier-desc">Unlimited levels • Create recipes</span>
      </div>
    </div>
  </div>
  
  <!-- Decorative Elements -->
  <div class="decoration decoration-left">🥬</div>
  <div class="decoration decoration-right">🍅</div>
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
  }
  
  .start-content {
    background: white;
    border-radius: 24px;
    padding: 32px 28px;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    text-align: center;
    position: relative;
    z-index: 1;
  }
  
  .header {
    margin-bottom: 24px;
  }
  
  .logo {
    font-size: 64px;
    margin-bottom: 8px;
    animation: bounce 2s ease-in-out infinite;
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .title {
    font-size: 2rem;
    font-weight: 800;
    color: #2E7D32;
    margin: 0 0 8px;
    text-shadow: 2px 2px 0 #C8E6C9;
  }
  
  .tagline {
    color: #666;
    font-size: 0.95rem;
    margin: 0;
  }
  
  .features {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }
  
  .feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  
  .feature-icon {
    font-size: 1.8rem;
  }
  
  .feature-text {
    font-size: 0.75rem;
    color: #666;
    max-width: 80px;
    line-height: 1.2;
  }
  
  .actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
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
    justify-content: center;
    gap: 16px;
  }
  
  .tier {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 14px;
    border-radius: 10px;
    background: #FAFAFA;
  }
  
  .tier-badge {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 6px;
  }
  
  .tier.free .tier-badge {
    background: #E3F2FD;
    color: #1565C0;
  }
  
  .tier.premium .tier-badge {
    background: linear-gradient(135deg, #FFD700 0%, #FFA000 100%);
    color: #5D4037;
  }
  
  .tier-desc {
    font-size: 0.7rem;
    color: #888;
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
      font-size: 48px;
    }
    
    .title {
      font-size: 1.6rem;
    }
    
    .tagline {
      font-size: 0.85rem;
    }
    
    .features {
      gap: 12px;
    }
    
    .feature-icon {
      font-size: 1.5rem;
    }
    
    .decoration {
      font-size: 2.5rem;
      opacity: 0.3;
    }
  }
</style>
