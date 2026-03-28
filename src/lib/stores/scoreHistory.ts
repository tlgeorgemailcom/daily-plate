// Score History Utility - Save game scores to cloud for premium users
import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { playerStore } from './playerStore';

export type GameType = 'chain' | 'plate' | 'matching' | 'tower' | 'scrambled' | 'slider' | 'farmers-basket' | 'balanced-diet';

export interface GameScoreDetails {
  difficulty?: string;
  level?: string;
  levelNum?: number;
  wordsUsed?: number;
  groupsHit?: number;
  timeSeconds?: number;
  streak?: number;
  puzzleNumber?: number;
  // Farmer's Basket specific
  recipeId?: string;
  recipeName?: string;
  won?: boolean;
  // Balanced Diet specific
  date?: string;
  caloriesTarget?: number;
  caloriesActual?: number;
  caloriesMet?: boolean;
  proteinMet?: boolean;
  fatsMet?: boolean;
  carbsMet?: boolean;
  fiberMet?: boolean;
  waterMet?: boolean;
  sugarMet?: boolean;
  targetsMetCount?: number;
  [key: string]: unknown; // Allow additional game-specific fields
}

// Get current player
function getPlayer() {
  return get(playerStore);
}

// Check if current user is paid (only paid users get score history)
function isPremiumUser(): boolean {
  const player = getPlayer();
  return player?.status === 'logged-in' && ['plus', 'allin', 'moderator'].includes(player?.tier);
}

// Get player ID
function getPlayerId(): string | null {
  const player = getPlayer();
  return player?.id ?? null;
}

/**
 * Save a game score to the cloud
 * Only saves for premium users
 * 
 * @param game - The game type (chain, plate, matching, etc.)
 * @param score - The final score
 * @param details - Optional JSON details about the game
 */
export async function saveGameScore(
  game: GameType,
  score: number,
  details?: GameScoreDetails
): Promise<boolean> {
  if (!browser) return false;
  
  // Only premium users get score history
  if (!isPremiumUser()) {
    console.log('[scoreHistory] Not premium user, skipping score save');
    return false;
  }
  
  const playerId = getPlayerId();
  if (!playerId) {
    console.log('[scoreHistory] No player ID, skipping score save');
    return false;
  }
  
  try {
    const response = await fetch('/api/game-scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_id: playerId,
        game,
        score,
        details
      })
    });
    
    if (!response.ok) {
      console.error('[scoreHistory] Failed to save score:', response.status);
      return false;
    }
    
    console.log('[scoreHistory] Score saved:', game, score);
    return true;
  } catch (e) {
    console.error('[scoreHistory] Error saving score:', e);
    return false;
  }
}

/**
 * Get score history for the current player
 * 
 * @param game - Optional: filter by game type
 * @param limit - Max number of scores to return (default 50)
 */
export async function getScoreHistory(
  game?: GameType,
  limit: number = 50
): Promise<Array<{
  id: number;
  game: string;
  score: number;
  played_at: string;
  details: GameScoreDetails | null;
}>> {
  if (!browser) return [];
  
  if (!isPremiumUser()) {
    return [];
  }
  
  const playerId = getPlayerId();
  if (!playerId) return [];
  
  try {
    let url = `/api/game-scores?player_id=${encodeURIComponent(playerId)}&limit=${limit}`;
    if (game) {
      url += `&game=${encodeURIComponent(game)}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      console.error('[scoreHistory] Failed to fetch scores:', response.status);
      return [];
    }
    
    const data = await response.json();
    return data.scores || [];
  } catch (e) {
    console.error('[scoreHistory] Error fetching scores:', e);
    return [];
  }
}

/**
 * Get aggregate stats for the current player
 * 
 * @param game - Optional: filter by game type
 */
export async function getPlayerStats(game?: GameType): Promise<Array<{
  game: string;
  games_played: number;
  high_score: number;
  avg_score: number;
  first_played: string;
  last_played: string;
}>> {
  if (!browser) return [];
  
  if (!isPremiumUser()) {
    return [];
  }
  
  const playerId = getPlayerId();
  if (!playerId) return [];
  
  try {
    let url = `/api/game-scores/stats?player_id=${encodeURIComponent(playerId)}`;
    if (game) {
      url += `&game=${encodeURIComponent(game)}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      console.error('[scoreHistory] Failed to fetch stats:', response.status);
      return [];
    }
    
    const data = await response.json();
    return data.stats || [];
  } catch (e) {
    console.error('[scoreHistory] Error fetching stats:', e);
    return [];
  }
}
