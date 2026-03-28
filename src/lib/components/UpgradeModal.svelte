<script lang="ts">
  import { playerStore } from '$lib/stores/playerStore';
  
  interface Props {
    onClose: () => void;
    onSuccess: () => void;
  }
  
  let { onClose, onSuccess }: Props = $props();
  
  // Form state
  let cardNumber = $state('');
  let expiry = $state('');
  let cvc = $state('');
  let error = $state<string | null>(null);
  let loading = $state(false);
  let success = $state(false);
  
  // Format card number with spaces
  function formatCardNumber(value: string): string {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  }
  
  // Format expiry as MM/YY
  function formatExpiry(value: string): string {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    return cleaned;
  }
  
  function handleCardInput(e: Event) {
    const target = e.target as HTMLInputElement;
    cardNumber = formatCardNumber(target.value);
  }
  
  function handleExpiryInput(e: Event) {
    const target = e.target as HTMLInputElement;
    expiry = formatExpiry(target.value);
  }
  
  function handleCvcInput(e: Event) {
    const target = e.target as HTMLInputElement;
    cvc = target.value.replace(/\D/g, '').slice(0, 3);
  }
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    const cleanCard = cardNumber.replace(/\s/g, '');
    
    if (cleanCard.length !== 16) {
      error = 'Please enter a valid 16-digit card number';
      return;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      error = 'Please enter a valid expiry (MM/YY)';
      return;
    }
    
    if (cvc.length !== 3) {
      error = 'Please enter a valid 3-digit CVC';
      return;
    }
    
    loading = true;
    error = null;
    
    try {
      const player = playerStore.get();
      
      if (!player.id || player.status !== 'logged-in') {
        error = 'Please login first to upgrade to Premium';
        loading = false;
        return;
      }
      
      const res = await fetch('/api/auth/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: player.id,
          cardNumber: cleanCard,
          expiry,
          cvc
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        error = data.error || 'Payment failed';
        return;
      }
      
      // Update local store
      playerStore.setTier('plus');
      
      // Show success state
      success = true;
      
      // Close after delay
      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (e) {
      error = 'Connection failed. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="modal-overlay" onclick={onClose}>
  <div class="modal" onclick={(e) => e.stopPropagation()}>
    <button class="close-btn" onclick={onClose}>✕</button>
    
    {#if success}
      <div class="success-state">
        <div class="success-icon">🎉</div>
        <h2>Welcome to Premium!</h2>
        <p>Your progress will now sync across all devices.</p>
      </div>
    {:else}
      <div class="modal-header">
        <div class="modal-icon">⭐</div>
        <h2 class="modal-title">Upgrade to Premium</h2>
        <p class="modal-subtitle">$4.99/year • Sync across devices</p>
      </div>
      
      <div class="benefits">
        <div class="benefit">
          <span class="benefit-icon">☁️</span>
          <span>Progress syncs across all devices</span>
        </div>
        <div class="benefit">
          <span class="benefit-icon">📖</span>
          <span>Unlimited recipe creation</span>
        </div>
        <div class="benefit">
          <span class="benefit-icon">🏆</span>
          <span>Leaderboard access</span>
        </div>
        <div class="benefit">
          <span class="benefit-icon">💚</span>
          <span>Support development</span>
        </div>
      </div>
      
      <form class="payment-form" onsubmit={handleSubmit}>
        {#if error}
          <div class="error-msg">{error}</div>
        {/if}
        
        <label class="form-label">
          Card Number
          <input 
            type="text"
            value={cardNumber}
            oninput={handleCardInput}
            placeholder="4242 4242 4242 4242"
            class="form-input"
            autocomplete="cc-number"
          />
        </label>
        
        <div class="row">
          <label class="form-label">
            Expiry
            <input 
              type="text"
              value={expiry}
              oninput={handleExpiryInput}
              placeholder="MM/YY"
              class="form-input"
              autocomplete="cc-exp"
            />
          </label>
          
          <label class="form-label">
            CVC
            <input 
              type="text"
              value={cvc}
              oninput={handleCvcInput}
              placeholder="123"
              class="form-input"
              autocomplete="cc-csc"
            />
          </label>
        </div>
        
        <button type="submit" class="submit-btn" disabled={loading}>
          {#if loading}
            Processing...
          {:else}
            Subscribe • $4.99/year
          {/if}
        </button>
        
        <p class="test-hint">
          💡 Test card: 4242 4242 4242 4242, any future expiry, any 3-digit CVC
        </p>
      </form>
    {/if}
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
    backdrop-filter: blur(4px);
  }
  
  .modal {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 1.5rem;
    padding: 2rem;
    max-width: 400px;
    width: 100%;
    position: relative;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 215, 0, 0.3);
  }
  
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255,255,255,0.1);
    border: none;
    color: #aaa;
    font-size: 1.2rem;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .close-btn:hover {
    background: rgba(255,255,255,0.2);
    color: white;
  }
  
  .modal-header {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .modal-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
  
  .modal-title {
    color: #ffd700;
    font-size: 1.5rem;
    margin: 0 0 0.25rem 0;
  }
  
  .modal-subtitle {
    color: #88c999;
    margin: 0;
    font-size: 1.1rem;
  }
  
  .benefits {
    background: rgba(255, 215, 0, 0.1);
    border-radius: 1rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(255, 215, 0, 0.2);
  }
  
  .benefit {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0;
    color: #fff;
    font-size: 0.95rem;
  }
  
  .benefit-icon {
    font-size: 1.2rem;
  }
  
  .payment-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: #aaa;
    font-size: 0.9rem;
  }
  
  .form-input {
    padding: 0.875rem 1rem;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 0.75rem;
    background: rgba(255,255,255,0.05);
    color: white;
    font-size: 1rem;
    transition: all 0.2s;
    font-family: 'Courier New', monospace;
    letter-spacing: 0.1em;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #ffd700;
    background: rgba(255,255,255,0.1);
  }
  
  .form-input::placeholder {
    color: #666;
    letter-spacing: 0.1em;
  }
  
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .submit-btn {
    padding: 1rem;
    border: none;
    border-radius: 0.75rem;
    background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
    color: #1a1a2e;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 0.5rem;
  }
  
  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 215, 0, 0.4);
  }
  
  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .error-msg {
    background: rgba(220, 53, 69, 0.2);
    border: 1px solid rgba(220, 53, 69, 0.5);
    color: #ff6b6b;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    text-align: center;
  }
  
  .test-hint {
    color: #666;
    font-size: 0.8rem;
    text-align: center;
    margin: 0.5rem 0 0 0;
  }
  
  .success-state {
    text-align: center;
    padding: 2rem 0;
  }
  
  .success-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: bounce 0.5s ease;
  }
  
  .success-state h2 {
    color: #ffd700;
    margin: 0 0 0.5rem 0;
  }
  
  .success-state p {
    color: #88c999;
    margin: 0;
  }
  
  @keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
  
  @media (max-width: 480px) {
    .modal {
      padding: 1.5rem;
    }
    
    .modal-title {
      font-size: 1.3rem;
    }
    
    .benefit {
      font-size: 0.9rem;
    }
  }
</style>
