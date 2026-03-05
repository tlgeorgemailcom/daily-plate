<script lang="ts">
  interface GameScore {
    id: number;
    game: string;
    score: number;
    played_at: string;
    details: Record<string, unknown> | null;
  }

  interface Props {
    selectedGames: GameScore[];
    disabled?: boolean;
  }

  let { selectedGames, disabled = false }: Props = $props();

  let showCopied = $state(false);
  let shareError = $state<string | null>(null);

  const gameEmojis: Record<string, string> = {
    'chain': '🔗',
    'plate': '🍽️',
    'matching': '🃏',
    'tower': '🏗️',
    'scrambled': '🐝',
    'slider': '🧩',
    'farmers-basket': '🧺',
    'balanced-diet': '🥗'
  };

  const gameNames: Record<string, string> = {
    'chain': 'Food Chain',
    'plate': 'Daily Plate',
    'matching': 'Matching Meals',
    'tower': 'Tower of Nutrition',
    'scrambled': 'Scrambled Bees',
    'slider': 'Food Slider',
    'farmers-basket': "Farmer's Basket",
    'balanced-diet': 'Balanced Diet'
  };

  function formatScoreForShare(score: GameScore): string {
    const details = score.details || {};
    const name = gameNames[score.game] || score.game;
    
    switch (score.game) {
      case 'chain':
      case 'plate':
        return `${score.score} pts` + (details.difficulty ? ` (${details.difficulty})` : '');
      case 'matching':
        return `${score.score} matches`;
      case 'tower':
        return `${score.score} guesses`;
      case 'scrambled':
        return `${score.score}%`;
      case 'slider':
        return `${score.score} moves`;
      case 'farmers-basket':
        const won = details.won ?? score.score === 1;
        return won ? 'Won!' : 'Lost';
      case 'balanced-diet':
        return `${score.score}/7 nutrients`;
      default:
        return `${score.score}`;
    }
  }

  function formatStatsForShare(): string {
    const date = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    let text = `🎮 My Daily Food Chain Stats - ${date}\n\n`;
    
    for (const game of selectedGames) {
      const emoji = gameEmojis[game.game] || '🎮';
      const name = gameNames[game.game] || game.game;
      text += `${emoji} ${name}: ${formatScoreForShare(game)}\n`;
    }
    
    text += `\nPlay at todaypage.com`;
    return text;
  }

  async function handleShare() {
    if (disabled || selectedGames.length === 0) return;
    
    shareError = null;
    const text = formatStatsForShare();
    
    // Try native share first
    if (navigator.share) {
      try {
        // Share TEXT only - no url parameter!
        // Including url creates a link preview that hides the stats
        await navigator.share({
          title: 'My Daily Food Chain Stats',
          text: text
        });
        return;
      } catch (e) {
        // User cancelled or share failed
        if ((e as Error).name !== 'AbortError') {
          console.log('Native share failed, falling back to clipboard');
        } else {
          return; // User cancelled, don't show clipboard toast
        }
      }
    }
    
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      showCopied = true;
      setTimeout(() => showCopied = false, 2000);
    } catch (e) {
      shareError = 'Could not copy to clipboard';
      setTimeout(() => shareError = null, 3000);
    }
  }
</script>

<div class="share-container">
  <button 
    class="share-btn" 
    onclick={handleShare}
    disabled={disabled || selectedGames.length === 0}
  >
    📤 Share Stats
  </button>
  
  {#if showCopied}
    <div class="toast success">✓ Copied to clipboard!</div>
  {/if}
  
  {#if shareError}
    <div class="toast error">{shareError}</div>
  {/if}
</div>

<style>
  .share-container {
    position: relative;
    text-align: center;
    margin-top: 16px;
  }

  .share-btn {
    background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }

  .share-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
  }

  .share-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .share-btn:disabled {
    background: #ccc;
    box-shadow: none;
    cursor: not-allowed;
  }

  .toast {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 12px;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    animation: slideUp 0.2s ease;
  }

  .toast.success {
    background: #e8f5e9;
    color: #2e7d32;
  }

  .toast.error {
    background: #ffebee;
    color: #c62828;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
</style>
