<script lang="ts">
  import { playerStore } from '$lib/stores/playerStore';
  
  interface Props {
    onClose: () => void;
    onSuccess: () => void;
  }
  
  let { onClose, onSuccess }: Props = $props();
  
  // Form state
  let mode = $state<'login' | 'register'>('login');
  let email = $state('');
  let password = $state('');
  let displayName = $state('');
  let error = $state<string | null>(null);
  let loading = $state(false);
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      error = 'Please fill in all fields';
      return;
    }
    
    if (mode === 'register' && password.length < 6) {
      error = 'Password must be at least 6 characters';
      return;
    }
    
    loading = true;
    error = null;
    
    try {
      let result;
      if (mode === 'login') {
        result = await playerStore.login(email, password);
      } else {
        result = await playerStore.register(email, password, displayName || undefined);
      }
      
      if (result.success) {
        onSuccess();
      } else {
        error = result.error || 'Something went wrong';
      }
    } catch (e) {
      error = 'Connection failed. Please try again.';
    } finally {
      loading = false;
    }
  }
  
  function switchMode() {
    mode = mode === 'login' ? 'register' : 'login';
    error = null;
  }
</script>

<div class="modal-overlay" onclick={onClose}>
  <div class="modal" onclick={(e) => e.stopPropagation()}>
    <button class="close-btn" onclick={onClose}>✕</button>
    
    <div class="modal-header">
      <div class="modal-icon">
        {mode === 'login' ? '👤' : '✨'}
      </div>
      <h2 class="modal-title">
        {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
      </h2>
      <p class="modal-subtitle">
        {mode === 'login' 
          ? 'Login to sync your progress' 
          : 'Join to save progress & unlock features'}
      </p>
    </div>
    
    <form class="login-form" onsubmit={handleSubmit}>
      {#if error}
        <div class="error-msg">{error}</div>
      {/if}
      
      {#if mode === 'register'}
        <label class="form-label">
          Display Name
          <input 
            type="text"
            bind:value={displayName}
            placeholder="Your nickname"
            class="form-input"
          />
        </label>
      {/if}
      
      <label class="form-label">
        Email
        <input 
          type="email"
          bind:value={email}
          placeholder="you@example.com"
          class="form-input"
          required
        />
      </label>
      
      <label class="form-label">
        Password
        <input 
          type="password"
          bind:value={password}
          placeholder={mode === 'login' ? '••••••••' : 'At least 6 characters'}
          class="form-input"
          required
        />
      </label>
      
      <button type="submit" class="submit-btn" disabled={loading}>
        {#if loading}
          <span class="spinner"></span>
        {:else}
          {mode === 'login' ? 'Login' : 'Create Account'}
        {/if}
      </button>
    </form>
    
    <div class="switch-mode">
      {#if mode === 'login'}
        <span>Don't have an account?</span>
        <button type="button" class="link-btn" onclick={switchMode}>
          Sign up
        </button>
      {:else}
        <span>Already have an account?</span>
        <button type="button" class="link-btn" onclick={switchMode}>
          Login
        </button>
      {/if}
    </div>
    
    <!-- Tier benefits reminder -->
    <div class="tier-benefits">
      <div class="benefit">
        <span class="benefit-icon">☁️</span>
        <span class="benefit-text">Cloud sync progress</span>
      </div>
      <div class="benefit">
        <span class="benefit-icon">🏆</span>
        <span class="benefit-text">Leaderboard access</span>
      </div>
      <div class="benefit premium-hint">
        <span class="benefit-icon">⭐</span>
        <span class="benefit-text">Premium available</span>
      </div>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
    backdrop-filter: blur(4px);
  }
  
  .modal {
    background: white;
    border-radius: 20px;
    padding: 28px 24px;
    max-width: 380px;
    width: 100%;
    position: relative;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    animation: slideUp 0.3s ease;
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #F5F5F5;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    font-size: 1.1rem;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .close-btn:hover {
    background: #EEE;
    color: #333;
  }
  
  .modal-header {
    text-align: center;
    margin-bottom: 24px;
  }
  
  .modal-icon {
    font-size: 3rem;
    margin-bottom: 8px;
  }
  
  .modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2E7D32;
    margin: 0 0 6px;
  }
  
  .modal-subtitle {
    color: #666;
    font-size: 0.9rem;
    margin: 0;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .error-msg {
    background: #FFEBEE;
    color: #C62828;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 0.9rem;
    text-align: center;
  }
  
  .form-label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #555;
  }
  
  .form-input {
    padding: 12px 14px;
    border: 2px solid #E0E0E0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.2s;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }
  
  .form-input::placeholder {
    color: #AAA;
  }
  
  .submit-btn {
    background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
    color: white;
    border: none;
    padding: 14px;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 4px;
  }
  
  .submit-btn:hover:not(:disabled) {
    box-shadow: 0 4px 15px rgba(46, 125, 50, 0.3);
    transform: translateY(-1px);
  }
  
  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .switch-mode {
    text-align: center;
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px solid #EEE;
    font-size: 0.9rem;
    color: #666;
  }
  
  .link-btn {
    background: none;
    border: none;
    color: #4CAF50;
    font-weight: 600;
    cursor: pointer;
    padding: 2px 4px;
  }
  
  .link-btn:hover {
    text-decoration: underline;
  }
  
  .tier-benefits {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #EEE;
  }
  
  .benefit {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  
  .benefit-icon {
    font-size: 1.4rem;
  }
  
  .benefit-text {
    font-size: 0.65rem;
    color: #888;
    text-align: center;
    max-width: 70px;
  }
  
  .premium-hint {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 183, 0, 0.1));
    border-radius: 8px;
    padding: 6px 10px;
  }
  
  .premium-hint .benefit-text {
    color: #b8860b;
  }
  
  /* Mobile adjustments */
  @media (max-width: 400px) {
    .modal {
      padding: 24px 20px;
    }
    
    .modal-icon {
      font-size: 2.5rem;
    }
    
    .modal-title {
      font-size: 1.3rem;
    }
    
    .tier-benefits {
      gap: 10px;
    }
    
    .benefit-icon {
      font-size: 1.2rem;
    }
  }
</style>
