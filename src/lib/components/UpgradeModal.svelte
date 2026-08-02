<script lang="ts">
  import { playerStore } from '$lib/stores/playerStore';
  
  interface Props {
    onClose: () => void;
    onSuccess: () => void;
  }
  
  let { onClose, onSuccess }: Props = $props();
  
  const currentTierInit = playerStore.get().tier;
  let selectedTier = $state<'plus' | 'allin'>(currentTierInit === 'plus' ? 'allin' : 'plus');
  let error = $state<string | null>(null);
  let loading = $state(false);
  let success = $state(false);
  
  async function handleSubscribe() {
    loading = true;
    error = null;
    
    try {
      const player = playerStore.get();
      
      if (!player.id || player.status !== 'logged-in') {
        error = 'Please log in first to subscribe';
        loading = false;
        return;
      }
      
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: player.id,
          tier: selectedTier
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        error = data.error || 'Failed to start checkout';
        return;
      }
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        error = 'No checkout URL returned';
      }
      
    } catch (e) {
      error = 'Connection failed. Please try again.';
    } finally {
      loading = false;
    }
  }
  
  async function openBillingPortal() {
    loading = true;
    error = null;
    try {
      const player = playerStore.get();
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: player.id })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        error = data.error || 'Could not open billing portal';
      }
    } catch (e) {
      error = 'Connection failed';
    } finally {
      loading = false;
    }
  }
  
  const currentTier = $derived(playerStore.get().tier);
  const isAllin = $derived(['allin', 'moderator'].includes(currentTier));
  const isPlus = $derived(currentTier === 'plus');
</script>

<div
  class="modal-overlay"
  role="presentation"
  onclick={onClose}
  onkeydown={(e) => e.key === 'Escape' && onClose()}
>
  <div
    class="modal"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.key !== 'Escape' && e.stopPropagation()}
  >
    <button class="close-btn" onclick={onClose}>✕</button>
    
    {#if isAllin}
      <div class="success-state">
        <div class="success-icon">✅</div>
        <h2>You're on ALL·IN!</h2>
        <p>You have access to everything.</p>
        <button class="manage-btn" onclick={openBillingPortal} disabled={loading}>
          {loading ? 'Opening...' : 'Manage Subscription'}
        </button>
      </div>
    {:else if isPlus}
      <div class="modal-header">
        <div class="modal-icon">🚀</div>
        <h2 class="modal-title">Upgrade to ALL·IN</h2>
        <p class="modal-subtitle">You're on Plus — unlock everything</p>
      </div>
      
      <div class="tier-cards">
        <div class="tier-card current-tier">
          <div class="tier-badge plus-badge">Plus <span class="current-label">current</span></div>
          <div class="tier-price">$4.95<span class="period">/mo</span></div>
          <ul class="tier-features">
            <li>☁️ Cloud sync across devices</li>
            <li>📊 Stats & history</li>
            <li>📖 Unlimited recipes</li>
            <li>💚 Support development</li>
          </ul>
        </div>
        
        <button 
          class="tier-card selected"
          onclick={() => selectedTier = 'allin'}
        >
          <div class="tier-badge allin-badge">ALL·IN</div>
          <div class="tier-price">$14.95<span class="period">/mo</span></div>
          <ul class="tier-features">
            <li>✨ Everything in Plus</li>
            <li>🍽️ Custom meal categories</li>
            <li>📋 Detailed reports</li>
            <li>🏆 Priority support</li>
          </ul>
        </button>
      </div>
      
      {#if error}
        <div class="error-msg">{error}</div>
      {/if}
      
      <button class="submit-btn" onclick={handleSubscribe} disabled={loading}>
        {#if loading}
          Redirecting to checkout...
        {:else}
          Upgrade to ALL·IN · $14.95/mo
        {/if}
      </button>
      
      <div class="manage-link">
        <button class="text-btn" onclick={openBillingPortal} disabled={loading}>Manage current subscription</button>
      </div>
      
      <p class="secure-hint">
        🔒 Secure checkout powered by Stripe
      </p>
    {:else}
      <div class="modal-header">
        <div class="modal-icon">⭐</div>
        <h2 class="modal-title">Choose Your Plan</h2>
        <p class="modal-subtitle">Unlock sync, stats & more</p>
      </div>
      
      <div class="tier-cards">
        <button 
          class="tier-card" 
          class:selected={selectedTier === 'plus'}
          onclick={() => selectedTier = 'plus'}
        >
          <div class="tier-badge plus-badge">Plus</div>
          <div class="tier-price">$4.95<span class="period">/mo</span></div>
          <ul class="tier-features">
            <li>☁️ Cloud sync across devices</li>
            <li>📊 Stats & history</li>
            <li>📖 Unlimited recipes</li>
            <li>💚 Support development</li>
          </ul>
        </button>
        
        <button 
          class="tier-card" 
          class:selected={selectedTier === 'allin'}
          onclick={() => selectedTier = 'allin'}
        >
          <div class="tier-badge allin-badge">ALL·IN</div>
          <div class="tier-price">$14.95<span class="period">/mo</span></div>
          <ul class="tier-features">
            <li>✨ Everything in Plus</li>
            <li>🍽️ Custom meal categories</li>
            <li>📋 Detailed reports</li>
            <li>🏆 Priority support</li>
          </ul>
        </button>
      </div>
      
      {#if error}
        <div class="error-msg">{error}</div>
      {/if}
      
      <button class="submit-btn" onclick={handleSubscribe} disabled={loading}>
        {#if loading}
          Redirecting to checkout...
        {:else}
          Subscribe to {selectedTier === 'allin' ? 'ALL·IN' : 'Plus'} · ${selectedTier === 'allin' ? '14.95' : '4.95'}/mo
        {/if}
      </button>
      
      <p class="secure-hint">
        🔒 Secure checkout powered by Stripe
      </p>
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
    max-width: 480px;
    width: 100%;
    position: relative;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 215, 0, 0.3);
    max-height: 90vh;
    overflow-y: auto;
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
  
  .tier-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .tier-card {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.15);
    border-radius: 1rem;
    padding: 1.25rem 1rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    color: white;
    font-family: inherit;
  }
  
  .tier-card:hover {
    border-color: rgba(255, 215, 0, 0.4);
    background: rgba(255, 255, 255, 0.08);
  }
  
  .tier-card.selected {
    border-color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.15);
  }
  
  .tier-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 2rem;
    font-weight: 700;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
    letter-spacing: 0.03em;
  }
  
  .plus-badge {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
  }
  
  .allin-badge {
    background: linear-gradient(135deg, #ffd700, #f59e0b);
    color: #1a1a2e;
  }
  
  .tier-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin: 0.5rem 0;
  }
  
  .period {
    font-size: 0.85rem;
    font-weight: 400;
    color: #aaa;
  }
  
  .tier-features {
    list-style: none;
    padding: 0;
    margin: 0.75rem 0 0 0;
    text-align: left;
    font-size: 0.8rem;
    color: #ccc;
  }
  
  .tier-features li {
    padding: 0.25rem 0;
  }
  
  .submit-btn {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 0.75rem;
    background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
    color: #1a1a2e;
    font-size: 1.05rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
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
    margin-bottom: 1rem;
  }
  
  .secure-hint {
    color: #666;
    font-size: 0.8rem;
    text-align: center;
    margin: 0.75rem 0 0 0;
  }
  
  .success-state {
    text-align: center;
    padding: 2rem 0;
  }
  
  .success-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .success-state h2 {
    color: #ffd700;
    margin: 0 0 0.5rem 0;
  }
  
  .success-state p {
    color: #88c999;
    margin: 0 0 1.5rem 0;
  }
  
  .manage-btn {
    padding: 0.75rem 1.5rem;
    border: 1px solid rgba(255, 215, 0, 0.4);
    border-radius: 0.75rem;
    background: rgba(255, 215, 0, 0.1);
    color: #ffd700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .manage-btn:hover:not(:disabled) {
    background: rgba(255, 215, 0, 0.2);
  }
  
  .manage-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .current-tier {
    opacity: 0.6;
    cursor: default;
    pointer-events: none;
  }

  .current-label {
    font-size: 0.7rem;
    font-weight: 400;
    opacity: 0.8;
  }

  .manage-link {
    text-align: center;
    margin-top: 0.5rem;
  }

  .text-btn {
    background: none;
    border: none;
    color: #88c999;
    font-size: 0.85rem;
    cursor: pointer;
    text-decoration: underline;
    font-family: inherit;
  }

  .text-btn:hover {
    color: #a8e9b9;
  }

  @media (max-width: 480px) {
    .modal {
      padding: 1.5rem;
    }
    
    .tier-cards {
      grid-template-columns: 1fr;
    }
    
    .modal-title {
      font-size: 1.3rem;
    }
  }
</style>
