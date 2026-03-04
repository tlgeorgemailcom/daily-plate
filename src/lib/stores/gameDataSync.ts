// Game Data Sync Utility - Syncs all game localStorage to cloud for premium users
// This handles ALL game data from ALL games in a unified way
import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { playerStore } from './playerStore';

// All localStorage keys used by games that should be synced to cloud
// Add new game keys here as games are developed
const GAME_DATA_KEYS = [
  // Chain game
  'dailyChainStreak',
  'dailyChainDifficulty',
  'dailyChainLastPlayed',
  
  // Plate game  
  'dailyPlateStreak',
  'dailyPlateDifficulty',
  'dailyPlateLastPlayed',
  
  // Tower game
  'tower-level',
  'tower-game-state-usda',
  'tower-game-state-foodie',
  'tower-game-state-foodie21',
  
  // Scrambled game
  'scrambled-level',
  'scrambled-game-state-usda',
  'scrambled-game-state-foodie',
  'scrambled-game-state-foodie21',
  
  // Matching game
  'matching-highscore',
  'matching-history',
  
  // Farmers Basket
  'farmers-basket-levels',
  'farmers-basket-current-level',
  'farmers-basket-dietary',
  'my-recipes',
  
  // Balanced Diet (handled by gameStateStore, but include for completeness)
  'balanced-diet-state',
];

// Get current player
function getPlayer() {
  return get(playerStore);
}

// Check if current user is premium
function isPremiumUser(): boolean {
  const player = getPlayer();
  return player?.status === 'logged-in' && player?.tier === 'premium';
}

// Get player ID
function getPlayerId(): string | null {
  const player = getPlayer();
  return player?.id ?? null;
}

// Fetch all game data from cloud
async function fetchFromCloud(playerId: string): Promise<Record<string, string>> {
  try {
    const response = await fetch(`/api/game-data?player_id=${encodeURIComponent(playerId)}`);
    if (!response.ok) {
      console.error('[gameDataSync] Failed to fetch from cloud:', response.status);
      return {};
    }
    const result = await response.json();
    console.log('[gameDataSync] Fetched from cloud:', Object.keys(result.data || {}).length, 'keys');
    return result.data || {};
  } catch (e) {
    console.error('[gameDataSync] Fetch error:', e);
    return {};
  }
}

// Save game data to cloud
async function saveToCloud(playerId: string, data: Record<string, string>): Promise<boolean> {
  try {
    const response = await fetch('/api/game-data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: playerId, data })
    });
    if (!response.ok) {
      console.error('[gameDataSync] Failed to save to cloud:', response.status);
      return false;
    }
    console.log('[gameDataSync] Saved to cloud:', Object.keys(data).length, 'keys');
    return true;
  } catch (e) {
    console.error('[gameDataSync] Save error:', e);
    return false;
  }
}

// Collect all game data from localStorage
function collectLocalStorageData(): Record<string, string> {
  if (!browser) return {};
  
  const data: Record<string, string> = {};
  
  for (const key of GAME_DATA_KEYS) {
    const value = localStorage.getItem(key);
    if (value !== null) {
      data[key] = value;
    }
  }
  
  // Also look for dynamic keys (tower/scrambled levels with different names)
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    
    // Include any key that starts with common game prefixes
    if (
      key.startsWith('tower-') ||
      key.startsWith('scrambled-') ||
      key.startsWith('matching-') ||
      key.startsWith('farmers-basket-') ||
      key.startsWith('dailyChain') ||
      key.startsWith('dailyPlate')
    ) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        data[key] = value;
      }
    }
  }
  
  return data;
}

// Apply cloud data to localStorage
function applyToLocalStorage(data: Record<string, string>): void {
  if (!browser) return;
  
  for (const [key, value] of Object.entries(data)) {
    localStorage.setItem(key, value);
  }
  
  console.log('[gameDataSync] Applied', Object.keys(data).length, 'keys to localStorage');
}

// Sync all game data from cloud (called after login/upgrade)
// Downloads cloud data and merges with local data (cloud wins for conflicts)
export async function syncAllGameDataFromCloud(): Promise<void> {
  if (!browser) return;
  
  const player = getPlayer();
  console.log('[gameDataSync] syncAllGameDataFromCloud called, player:', {
    id: player?.id,
    status: player?.status,
    tier: player?.tier
  });
  
  if (!isPremiumUser()) {
    console.log('[gameDataSync] Not premium user, skipping cloud sync');
    return;
  }
  
  const playerId = getPlayerId();
  if (!playerId) {
    console.log('[gameDataSync] No player ID, skipping cloud sync');
    return;
  }
  
  // Fetch cloud data
  const cloudData = await fetchFromCloud(playerId);
  
  // Collect local data
  const localData = collectLocalStorageData();
  
  // Merge: cloud data takes precedence, but keep local keys not in cloud
  const mergedData = { ...localData, ...cloudData };
  
  // Apply to localStorage
  applyToLocalStorage(mergedData);
  
  // If local had data not in cloud, save the merged data back to cloud
  const localOnlyKeys = Object.keys(localData).filter(k => !(k in cloudData));
  if (localOnlyKeys.length > 0) {
    console.log('[gameDataSync] Uploading', localOnlyKeys.length, 'local-only keys to cloud');
    await saveToCloud(playerId, mergedData);
  }
}

// Upload all current localStorage game data to cloud (called periodically or on game events)
export async function uploadAllGameDataToCloud(): Promise<void> {
  if (!browser) return;
  
  if (!isPremiumUser()) {
    return;
  }
  
  const playerId = getPlayerId();
  if (!playerId) return;
  
  const data = collectLocalStorageData();
  if (Object.keys(data).length === 0) {
    console.log('[gameDataSync] No game data to upload');
    return;
  }
  
  await saveToCloud(playerId, data);
}

// Debounced upload (for use after game state changes)
let uploadTimeout: ReturnType<typeof setTimeout> | null = null;

export function scheduleGameDataUpload(): void {
  if (!browser || !isPremiumUser()) return;
  
  if (uploadTimeout) {
    clearTimeout(uploadTimeout);
  }
  
  uploadTimeout = setTimeout(() => {
    uploadTimeout = null;
    uploadAllGameDataToCloud();
  }, 3000); // 3 second debounce
}

// Hook into localStorage.setItem for automatic sync
// This patches localStorage to auto-upload changes for premium users
let isPatched = false;

export function enableAutoSync(): void {
  if (!browser || isPatched) return;
  
  const originalSetItem = localStorage.setItem.bind(localStorage);
  
  localStorage.setItem = (key: string, value: string) => {
    originalSetItem(key, value);
    
    // Check if this is a game data key
    const isGameKey = GAME_DATA_KEYS.includes(key) ||
      key.startsWith('tower-') ||
      key.startsWith('scrambled-') ||
      key.startsWith('matching-') ||
      key.startsWith('farmers-basket-') ||
      key.startsWith('dailyChain') ||
      key.startsWith('dailyPlate');
    
    if (isGameKey) {
      scheduleGameDataUpload();
    }
  };
  
  isPatched = true;
  console.log('[gameDataSync] Auto-sync enabled for localStorage');
}
