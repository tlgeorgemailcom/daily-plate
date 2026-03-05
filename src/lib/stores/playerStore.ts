// Player authentication and subscription state management
import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'dailyfoodchain_player';

export type PlayerTier = 'free' | 'premium';
export type PlayerStatus = 'anonymous' | 'logged-in';

export interface Player {
  id: string | null;
  email: string | null;
  displayName: string | null;
  status: PlayerStatus;
  tier: PlayerTier;
  createdAt: string | null;
  lastLoginAt: string | null;
}

const DEFAULT_PLAYER: Player = {
  id: null,
  email: null,
  displayName: null,
  status: 'anonymous',
  tier: 'free',
  createdAt: null,
  lastLoginAt: null
};

function loadStoredPlayer(): Player {
  if (!browser) return DEFAULT_PLAYER;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_PLAYER, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Failed to load player data:', e);
  }
  return DEFAULT_PLAYER;
}

function savePlayer(player: Player) {
  if (!browser) return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  } catch (e) {
    console.warn('Failed to save player data:', e);
  }
}

function createPlayerStore() {
  const initial = loadStoredPlayer();
  const { subscribe, set, update } = writable<Player>(initial);

  return {
    subscribe,
    
    // Play as anonymous (guest mode) - NO localStorage, session only
    playAsAnonymous: () => {
      const player: Player = {
        ...DEFAULT_PLAYER,
        id: `anon-${Date.now()}`,
        status: 'anonymous',
        tier: 'free',
        createdAt: new Date().toISOString()
      };
      set(player);
      // Don't save to localStorage - guest progress clears on refresh
    },
    
    // Login with email - returns tier based on server response
    login: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          return { success: false, error: data.error || 'Login failed' };
        }
        
        const player: Player = {
          id: data.id,
          email: data.email,
          displayName: data.displayName || email.split('@')[0],
          status: 'logged-in',
          tier: data.tier || 'free',
          createdAt: data.createdAt || new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        
        set(player);
        savePlayer(player);
        
        return { success: true };
      } catch (e) {
        console.error('Login error:', e);
        return { success: false, error: 'Connection failed' };
      }
    },
    
    // Register new account
    register: async (email: string, password: string, displayName?: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, displayName })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          return { success: false, error: data.error || 'Registration failed' };
        }
        
        const player: Player = {
          id: data.id,
          email: email,
          displayName: displayName || email.split('@')[0],
          status: 'logged-in',
          tier: 'free', // New accounts start free
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        
        set(player);
        savePlayer(player);
        
        return { success: true };
      } catch (e) {
        console.error('Registration error:', e);
        return { success: false, error: 'Connection failed' };
      }
    },
    
    // Logout - back to default state
    logout: () => {
      set(DEFAULT_PLAYER);
      if (browser) {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
    
    // Update tier (after payment, etc.)
    setTier: (tier: PlayerTier) => {
      update(p => {
        const updated = { ...p, tier };
        savePlayer(updated);
        return updated;
      });
    },
    
    // Check if player is logged in with stored credentials
    // Anonymous players should always see start screen on refresh
    hasStarted: (): boolean => {
      const player = get({ subscribe });
      return player.status === 'logged-in' && player.id !== null;
    },
    
    // Check if localStorage should be used for game data
    // Only logged-in users (Free tier) get persistent storage
    canUseStorage: (): boolean => {
      const player = get({ subscribe });
      return player.status === 'logged-in';
    },
    
    // Validate session with server and update tier if changed
    // Call this on app init to ensure tier accuracy
    validateSession: async (): Promise<boolean> => {
      const player = get({ subscribe });
      
      // Only validate logged-in users with a real ID
      if (player.status !== 'logged-in' || !player.id || player.id.startsWith('anon-')) {
        return false;
      }
      
      try {
        const res = await fetch(`/api/auth/validate?id=${encodeURIComponent(player.id)}`);
        const data = await res.json();
        
        if (data.valid) {
          // Update tier in case it changed on the server
          if (data.tier !== player.tier) {
            update(p => {
              const updated = { ...p, tier: data.tier };
              savePlayer(updated);
              return updated;
            });
          }
          return true;
        } else {
          // Session invalid - log out
          set(DEFAULT_PLAYER);
          if (browser) {
            localStorage.removeItem(STORAGE_KEY);
          }
          return false;
        }
      } catch (e) {
        console.warn('Session validation failed:', e);
        // On network error, trust localStorage (offline support)
        return true;
      }
    },
    
    // Get current player
    get: (): Player => get({ subscribe })
  };
}

export const playerStore = createPlayerStore();

// Derived stores for convenient access
export const isLoggedIn = derived(playerStore, $p => $p.status === 'logged-in');
export const isAnonymous = derived(playerStore, $p => $p.status === 'anonymous');
export const isPremium = derived(playerStore, $p => $p.tier === 'premium');
export const playerTier = derived(playerStore, $p => $p.tier);
export const playerName = derived(playerStore, $p => $p.displayName || 'Guest');

// Helper to check if storage is allowed (for use outside Svelte components)
export const canUseStorage = () => playerStore.canUseStorage();
