<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let code = $state('');
  let error = $state<string | null>(null);
  let loading = $state(false);
  // If a code is in the URL, suppress the UI immediately — we redirect on mount
  let autoRedirecting = $state($page.url.searchParams.has('code'));

  onMount(async () => {
    const urlCode = $page.url.searchParams.get('code');
    if (urlCode) {
      goto(`/farmers-basket?joinCode=${encodeURIComponent(urlCode.toUpperCase().trim())}`);
      return;
    }
  });

  async function handleJoin() {
    if (!code.trim()) {
      error = 'Please enter an edit code.';
      return;
    }
    loading = true;
    error = null;
    try {
      const res = await fetch(`/api/recipes/by-edit-code?code=${encodeURIComponent(code.trim())}`);
      if (!res.ok) {
        const data = await res.json();
        error = data.error || 'Code not found — check the code and try again.';
        return;
      }
      // Valid code — redirect into the farmers-basket share screen with the code
      goto(`/farmers-basket?joinCode=${encodeURIComponent(code.trim())}`);
    } catch {
      error = 'Network error — please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Join a Recipe Draft — Daily Food Chain</title>
</svelte:head>

<div class="join-page">
  {#if !autoRedirecting}
  <div class="join-card">
    <h1 class="join-title">🍽️ Join a Recipe Draft</h1>
    <p class="join-desc">
      Someone has invited you to collaborate on a recipe. Enter the edit code below to get started.
    </p>

    <div class="join-form">
      <input
        class="code-input"
        type="text"
        placeholder="e.g. ABC123"
        maxlength="8"
        bind:value={code}
        onkeydown={(e) => e.key === 'Enter' && handleJoin()}
      />
      <button class="join-btn" onclick={handleJoin} disabled={loading}>
        {loading ? 'Loading...' : 'Open Recipe'}
      </button>
    </div>

    {#if error}
      <p class="join-error">{error}</p>
    {/if}

    <p class="join-note">
      You'll need an account to save changes. <a href="/">Sign in or create one here.</a>
    </p>
  </div>
  {/if}
</div>

<style>
  .join-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fdf6ee;
    padding: 24px;
  }

  .join-card {
    background: white;
    border-radius: 16px;
    border: 1.5px solid #c8a96e;
    padding: 40px 32px;
    max-width: 420px;
    width: 100%;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }

  .join-title {
    font-size: 1.6rem;
    font-weight: 700;
    color: #5a3e28;
    margin: 0 0 12px;
  }

  .join-desc {
    color: #7a5c3e;
    font-size: 0.95rem;
    margin: 0 0 28px;
    line-height: 1.5;
  }

  .join-form {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 12px;
  }

  .code-input {
    font-family: 'Courier New', monospace;
    font-size: 1.2rem;
    font-weight: bold;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 10px 14px;
    border: 1.5px solid #c8a96e;
    border-radius: 8px;
    width: 140px;
    color: #5a3e28;
    text-align: center;
  }

  .code-input:focus {
    outline: none;
    border-color: #8B4513;
    box-shadow: 0 0 0 2px rgba(139,69,19,0.15);
  }

  .join-btn {
    padding: 10px 20px;
    background: #4a7c59;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
  }

  .join-btn:hover:not(:disabled) {
    background: #3d6b4a;
  }

  .join-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .join-error {
    color: #c62828;
    font-size: 0.85rem;
    margin: 8px 0 0;
  }

  .join-note {
    font-size: 0.82rem;
    color: #9e7d5a;
    margin: 20px 0 0;
  }

  .join-note a {
    color: #8B4513;
  }
</style>
