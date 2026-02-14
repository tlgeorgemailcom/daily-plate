// Simple client-side password protection for beta testing
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'dailyfoodchain_auth';
const PASSWORD = 'playfoodbeta1';

function createAuthStore() {
    // Check localStorage for existing auth
    const storedAuth = browser ? localStorage.getItem(STORAGE_KEY) : null;
    const { subscribe, set } = writable(storedAuth === 'true');

    return {
        subscribe,
        login: (password: string): boolean => {
            if (password === PASSWORD) {
                set(true);
                if (browser) {
                    localStorage.setItem(STORAGE_KEY, 'true');
                }
                return true;
            }
            return false;
        },
        logout: () => {
            set(false);
            if (browser) {
                localStorage.removeItem(STORAGE_KEY);
            }
        },
        checkAuth: (): boolean => {
            if (browser) {
                return localStorage.getItem(STORAGE_KEY) === 'true';
            }
            return false;
        }
    };
}

export const isAuthenticated = createAuthStore();

