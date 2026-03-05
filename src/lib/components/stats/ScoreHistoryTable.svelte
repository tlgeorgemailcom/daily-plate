<script lang="ts">
  interface GameScore {
    id: number;
    game: string;
    score: number;
    played_at: string;
    details: Record<string, unknown> | null;
  }

  interface Props {
    scores: GameScore[];
    onLoadMore?: () => void;
    hasMore?: boolean;
    loading?: boolean;
  }

  let { scores, onLoadMore, hasMore = false, loading = false }: Props = $props();

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
    'matching': 'Matching',
    'tower': 'Tower',
    'scrambled': 'Scrambled',
    'slider': 'Slider',
    'farmers-basket': "Farmer's",
    'balanced-diet': 'Diet'
  };

  function formatScore(score: GameScore): string {
    const details = score.details || {};
    
    switch (score.game) {
      case 'chain':
      case 'plate':
        return `${score.score} pts`;
      case 'matching':
        return `${score.score} matches`;
      case 'tower':
        return `${score.score} guesses`;
      case 'scrambled':
        return `${score.score}%`;
      case 'slider':
        return `${score.score} moves`;
      case 'farmers-basket':
        return score.score === 1 ? '✅ Won' : '❌ Lost';
      case 'balanced-diet':
        return `${score.score}/7`;
      default:
        return `${score.score}`;
    }
  }

  function formatDetails(score: GameScore): string {
    const details = score.details || {};
    const parts: string[] = [];
    
    if (details.difficulty) parts.push(String(details.difficulty));
    if (details.level) parts.push(`Level ${details.level}`);
    if (details.levelNum) parts.push(`Level ${details.levelNum}`);
    if (details.recipeName) parts.push(String(details.recipeName));
    if (details.wordsUsed) parts.push(`${details.wordsUsed} words`);
    
    return parts.join(', ') || '';
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  }
</script>

<div class="history-table">
  {#if scores.length === 0}
    <div class="empty-state">
      <div class="empty-icon">📊</div>
      <p>No game history yet</p>
      <p class="hint">Play some games to see your scores here!</p>
    </div>
  {:else}
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Game</th>
            <th>Score</th>
            <th class="details-col">Details</th>
          </tr>
        </thead>
        <tbody>
          {#each scores as score (score.id)}
            <tr>
              <td class="date-cell">
                <span class="date">{formatDate(score.played_at)}</span>
                <span class="time">{formatTime(score.played_at)}</span>
              </td>
              <td class="game-cell">
                <span class="emoji">{gameEmojis[score.game] || '🎮'}</span>
                <span class="name">{gameNames[score.game] || score.game}</span>
              </td>
              <td class="score-cell">{formatScore(score)}</td>
              <td class="details-cell">{formatDetails(score)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    
    {#if hasMore}
      <button class="load-more" onclick={onLoadMore} disabled={loading}>
        {loading ? 'Loading...' : 'Load More'}
      </button>
    {/if}
  {/if}
</div>

<style>
  .history-table {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  .table-wrapper {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    background: #f8f8f8;
    padding: 12px 16px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #eee;
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover {
    background: #fafafa;
  }

  .date-cell {
    white-space: nowrap;
  }

  .date {
    display: block;
    font-weight: 500;
    color: #333;
  }

  .time {
    display: block;
    font-size: 12px;
    color: #999;
  }

  .game-cell {
    white-space: nowrap;
  }

  .emoji {
    margin-right: 6px;
  }

  .name {
    color: #333;
  }

  .score-cell {
    font-weight: 600;
    color: #2196f3;
    white-space: nowrap;
  }

  .details-cell {
    color: #888;
    font-size: 13px;
  }

  .details-col {
    display: none;
  }

  .details-cell {
    display: none;
  }

  @media (min-width: 640px) {
    .details-col, .details-cell {
      display: table-cell;
    }
  }

  .empty-state {
    padding: 48px 24px;
    text-align: center;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .empty-state p {
    color: #666;
    margin: 0;
  }

  .hint {
    font-size: 14px;
    color: #999 !important;
    margin-top: 8px !important;
  }

  .load-more {
    width: 100%;
    padding: 14px;
    background: #f8f8f8;
    border: none;
    border-top: 1px solid #eee;
    font-size: 14px;
    font-weight: 500;
    color: #2196f3;
    cursor: pointer;
    transition: background 0.2s;
  }

  .load-more:hover:not(:disabled) {
    background: #f0f0f0;
  }

  .load-more:disabled {
    color: #999;
    cursor: not-allowed;
  }
</style>
