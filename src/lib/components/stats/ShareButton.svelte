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
    'tower': '🗼',
    'scrambled': '🐝',
    'slider': '🧩',
    'farmers-basket': '🧺',
    'balanced-diet': '🥗'
  };

  const gameNames: Record<string, string> = {
    'chain': 'Food Chain',
    'plate': 'Daily Plate',
    'matching': 'Matching Containers',
    'tower': 'Tower of Food',
    'scrambled': 'Scrambled Bees',
    'slider': 'Food Slider',
    'farmers-basket': "Farmer's Basket",
    'balanced-diet': 'Balanced Diet'
  };

  // Multi-level games that need grouping by difficulty
  const multiLevelGames = ['chain', 'plate', 'scrambled', 'tower'];

  function formatSingleGameLine(score: GameScore): string {
    const details = score.details || {};
    
    switch (score.game) {
      case 'matching':
        const level = details.level ?? score.score;
        return `Level ${level}`;
      case 'slider':
        return `${score.score} moves`;
      case 'farmers-basket': {
        const won = details.won ?? score.score === 1;
        const levelNum = details.level ?? 1;
        let line = `Level ${levelNum} ${won ? 'Won!' : 'Lost'}`;
        if (details.recipe) {
          line += ` Recipe: ${details.recipe}`;
        }
        return line;
      }
      case 'balanced-diet':
        return `${score.score}/7 nutrients within 80% ✓`;
      default:
        return `${score.score}`;
    }
  }

  function formatMultiLevelGame(gameName: string, scores: GameScore[]): string {
    const emoji = gameEmojis[gameName] || '🎮';
    const name = gameNames[gameName] || gameName;
    
    if (scores.length === 1) {
      // Only one difficulty played - show on single line
      const score = scores[0];
      const details = score.details || {};
      // Tower/Scrambled use 'level' field for mode (USDA, FOODIE, etc)
      let difficulty = (details.difficulty || details.tier || '') as string;
      if (!difficulty && (gameName === 'tower' || gameName === 'scrambled') && typeof details.level === 'string') {
        difficulty = details.level.toUpperCase();
      }
      
      switch (gameName) {
        case 'chain':
        case 'plate': {
          let line = `${emoji} ${name}: ${score.score} pts`;
          if (difficulty) line += ` (${difficulty})`;
          if (gameName === 'plate' && details.crossings) {
            line += ` + ${details.crossings} crossings`;
          }
          return line;
        }
        case 'scrambled': {
          const words = details.wordsFound ?? score.score;
          const total = details.totalWords ?? words;
          const matched = details.matched ?? 0;
          const matchTotal = details.matchTotal ?? 16;
          return `${emoji} Scrambled Bees: ${words}/${total} words, ${matched}/${matchTotal} matched` + 
                 (difficulty ? ` (${difficulty})` : '');
        }
        case 'tower':
          return `${emoji} Tower: ${score.score} guesses` + (difficulty ? ` (${difficulty})` : '');
        default:
          return `${emoji} ${name}: ${score.score}`;
      }
    }
    
    // Multiple difficulties - group by difficulty and show best per tier
    // First, deduplicate: group by difficulty, keep best score per difficulty
    const byDifficulty = new Map<string, GameScore>();
    
    for (const score of scores) {
      const details = score.details || {};
      // Tower/Scrambled use 'level' field for mode (USDA, FOODIE, etc)
      let difficulty = (details.difficulty || details.tier || '') as string;
      if (!difficulty && (gameName === 'tower' || gameName === 'scrambled') && typeof details.level === 'string') {
        difficulty = details.level.toUpperCase();
      }
      if (!difficulty) {
        difficulty = 'Default';
      }
      
      const existing = byDifficulty.get(difficulty);
      if (!existing) {
        byDifficulty.set(difficulty, score);
      } else {
        // Keep best: for tower, lower is better; for others, higher is better
        if (gameName === 'tower') {
          if (score.score < existing.score) {
            byDifficulty.set(difficulty, score);
          }
        } else {
          if (score.score > existing.score) {
            byDifficulty.set(difficulty, score);
          }
        }
      }
    }
    
    // If only one difficulty after deduplication, show on single line
    if (byDifficulty.size === 1) {
      const [difficulty, score] = [...byDifficulty.entries()][0];
      const details = score.details || {};
      
      switch (gameName) {
        case 'chain':
        case 'plate': {
          let line = `${emoji} ${name}: ${score.score} pts`;
          if (difficulty !== 'Default') line += ` (${difficulty})`;
          if (gameName === 'plate' && details.crossings) {
            line += ` + ${details.crossings} crossings`;
          }
          return line;
        }
        case 'scrambled': {
          const words = details.wordsFound ?? score.score;
          const total = details.totalWords ?? words;
          const matched = details.matched ?? 0;
          const matchTotal = details.matchTotal ?? 16;
          let line = `${emoji} Scrambled Bees: ${words}/${total} words, ${matched}/${matchTotal} matched`;
          if (difficulty !== 'Default') line += ` (${difficulty})`;
          return line;
        }
        case 'tower': {
          let line = `${emoji} Tower: ${score.score} guesses`;
          if (difficulty !== 'Default') line += ` (${difficulty})`;
          return line;
        }
        default:
          return `${emoji} ${name}: ${score.score}`;
      }
    }
    
    // Multiple difficulties - use multi-line format
    let text = `${emoji} ${name}\n`;
    
    for (const [difficulty, score] of byDifficulty) {
      const details = score.details || {};
      
      switch (gameName) {
        case 'chain':
          text += `   ${difficulty}: ${score.score} pts\n`;
          break;
        case 'plate': {
          let line = `   ${difficulty}: ${score.score} pts`;
          if (details.crossings) line += ` + ${details.crossings} crossings`;
          text += line + '\n';
          break;
        }
        case 'scrambled': {
          const words = details.wordsFound ?? score.score;
          const total = details.totalWords ?? words;
          const matched = details.matched ?? 0;
          const matchTotal = details.matchTotal ?? 16;
          text += `   ${difficulty}: ${words}/${total} words, ${matched}/${matchTotal} matched\n`;
          break;
        }
        case 'tower':
          text += `   ${difficulty}: ${score.score} guesses\n`;
          break;
      }
    }
    
    return text.trimEnd();
  }

  function formatStatsForShare(): string {
    const date = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    let text = `🎮 Daily Food Chain - ${date}\n\n`;
    
    // Group scores by game type
    const gameGroups = new Map<string, GameScore[]>();
    for (const score of selectedGames) {
      const existing = gameGroups.get(score.game) || [];
      existing.push(score);
      gameGroups.set(score.game, existing);
    }
    
    // Format each game group
    for (const [gameName, scores] of gameGroups) {
      if (multiLevelGames.includes(gameName)) {
        // Check if any scores have difficulty info
        // Tower/Scrambled use 'level' field (USDA, FOODIE, etc)
        // Chain/Plate use 'difficulty' field (Easy, Medium, Hard)
        const hasDifficultyInfo = scores.some(s => {
          const d = s.details;
          if (!d) return false;
          if (d.difficulty || d.tier) return true;
          // Tower/Scrambled store mode in 'level' field as string like "USDA", "FOODIE"
          if ((gameName === 'tower' || gameName === 'scrambled') && 
              typeof d.level === 'string' && 
              ['usda', 'foodie', 'foodie21', 'foodie12'].includes(d.level.toLowerCase())) {
            return true;
          }
          return false;
        });
        
        if (!hasDifficultyInfo) {
          // No difficulty info - just show best score on single line
          const emoji = gameEmojis[gameName] || '🎮';
          const name = gameNames[gameName] || gameName;
          if (gameName === 'tower') {
            const bestScore = Math.min(...scores.map(s => s.score));
            text += `${emoji} Tower: ${bestScore} guesses\n`;
          } else {
            const bestScore = Math.max(...scores.map(s => s.score));
            text += `${emoji} ${name}: ${bestScore} pts\n`;
          }
        } else {
          text += formatMultiLevelGame(gameName, scores) + '\n';
        }
      } else {
        // Single-tier games: show best result only
        const emoji = gameEmojis[gameName] || '🎮';
        const name = gameNames[gameName] || gameName;
        
        if (gameName === 'matching') {
          // Show best level reached
          const bestLevel = Math.max(...scores.map(s => {
            const details = s.details || {};
            return (details.level as number) ?? s.score;
          }));
          text += `${emoji} ${name}: Level ${bestLevel}\n`;
        } else if (gameName === 'farmers-basket') {
          // Show highest level won
          const wonScores = scores.filter(s => s.details?.won ?? s.score === 1);
          if (wonScores.length > 0) {
            const bestLevel = Math.max(...wonScores.map(s => (s.details?.level as number) ?? 1));
            const bestScore = wonScores.find(s => (s.details?.level as number) ?? 1 === bestLevel);
            let line = `${emoji} ${name}: Level ${bestLevel} Won!`;
            if (bestScore?.details?.recipe) {
              line += ` Recipe: ${bestScore.details.recipe}`;
            }
            text += line + '\n';
          } else {
            // No wins - show highest attempted
            const bestLevel = Math.max(...scores.map(s => (s.details?.level as number) ?? 1));
            text += `${emoji} ${name}: Level ${bestLevel} Lost\n`;
          }
        } else {
          // Other single-tier games: show best score
          const bestScore = scores.reduce((best, s) => s.score > best.score ? s : best, scores[0]);
          text += `${emoji} ${name}: ${formatSingleGameLine(bestScore)}\n`;
        }
      }
    }
    
    text += `\nPlay at todaypage.com`;
    return text;
  }

  // Generate preview text reactively
  const previewText = $derived(selectedGames.length > 0 ? formatStatsForShare() : '');

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
  {#if previewText}
    <div class="preview-card">
      <div class="preview-label">Message Preview</div>
      <pre class="preview-text">{previewText}</pre>
    </div>
  {/if}

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

  .preview-card {
    background: #f0f4f8;
    border: 1px solid #d0d7de;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    text-align: left;
  }

  .preview-label {
    font-size: 12px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .preview-text {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #333;
    white-space: pre-wrap;
    word-wrap: break-word;
    margin: 0;
    background: white;
    padding: 12px;
    border-radius: 8px;
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
