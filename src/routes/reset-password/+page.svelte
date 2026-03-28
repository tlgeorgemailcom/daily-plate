<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  const token = $derived($page.url.searchParams.get('token') ?? '');

  let newPassword = $state('');
  let confirmPassword = $state('');
  let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
  let errorMsg = $state('');

  async function handleSubmit() {
    errorMsg = '';
    if (!token) {
      errorMsg = 'No reset token found. Please use the link from your email.';
      return;
    }
    if (newPassword.length < 6) {
      errorMsg = 'Password must be at least 6 characters.';
      return;
    }
    if (newPassword !== confirmPassword) {
      errorMsg = 'Passwords do not match.';
      return;
    }

    status = 'loading';
    try {
      const res = await fetch('/api/auth/confirm-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        errorMsg = data.error ?? 'Reset failed. Please try again.';
        status = 'error';
        return;
      }
      status = 'success';
      setTimeout(() => goto('/'), 2000);
    } catch {
      errorMsg = 'Network error. Please try again.';
      status = 'error';
    }
  }
</script>

<svelte:head>
  <title>Reset Password | TodayPage</title>
</svelte:head>

<div class="page">
  <div class="card">
    <div class="logo">🥗</div>
    <h1>Reset your password</h1>

    {#if !token}
      <p class="error-box">This link is invalid. Please request a new reset link from the login page.</p>
      <a class="back-link" href="/">Back to TodayPage</a>

    {:else if status === 'success'}
      <div class="success-box">
        <span class="checkmark">✓</span>
        <p>Your password has been updated. Redirecting to TodayPage…</p>
      </div>

    {:else}
      <p class="subtitle">Enter a new password for your account.</p>

      <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <label class="field-label" for="new-pw">New password</label>
        <input
          id="new-pw"
          type="password"
          class="field-input"
          placeholder="At least 6 characters"
          bind:value={newPassword}
          disabled={status === 'loading'}
          autocomplete="new-password"
          minlength="6"
        />

        <label class="field-label" for="confirm-pw">Confirm password</label>
        <input
          id="confirm-pw"
          type="password"
          class="field-input"
          placeholder="Repeat your new password"
          bind:value={confirmPassword}
          disabled={status === 'loading'}
          autocomplete="new-password"
        />

        {#if errorMsg}
          <p class="error-box">{errorMsg}</p>
        {/if}

        <button
          type="submit"
          class="submit-btn"
          disabled={status === 'loading' || !newPassword || !confirmPassword}
        >
          {status === 'loading' ? 'Saving…' : 'Set new password'}
        </button>
      </form>

      <a class="back-link" href="/">Cancel — back to TodayPage</a>
    {/if}
  </div>
</div>

<style>
  .page {
    min-height: 100vh;
    background: #f1f8e9;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    font-family: system-ui, sans-serif;
  }
  .card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    text-align: center;
  }
  .logo { font-size: 40px; margin-bottom: 0.5rem; }
  h1 { font-size: 22px; color: #1b5e20; margin: 0 0 0.5rem; }
  .subtitle { color: #666; font-size: 14px; margin-bottom: 1.5rem; }

  .field-label {
    display: block;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: #444;
    margin: 1rem 0 4px;
  }
  .field-input {
    width: 100%;
    padding: 10px 12px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 15px;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.15s;
  }
  .field-input:focus { border-color: #2e7d32; }
  .field-input:disabled { background: #f5f5f5; color: #999; }

  .submit-btn {
    width: 100%;
    margin-top: 1.5rem;
    padding: 12px;
    background: #2e7d32;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }
  .submit-btn:hover:not(:disabled) { background: #1b5e20; }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .error-box {
    background: #ffebee;
    color: #c62828;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    margin-top: 1rem;
    text-align: left;
  }
  .success-box {
    background: #e8f5e9;
    color: #2e7d32;
    border-radius: 10px;
    padding: 1.5rem;
    margin: 1rem 0;
  }
  .checkmark { font-size: 32px; display: block; margin-bottom: 8px; }
  .success-box p { margin: 0; font-size: 14px; }

  .back-link {
    display: inline-block;
    margin-top: 1rem;
    font-size: 13px;
    color: #888;
    text-decoration: none;
  }
  .back-link:hover { color: #2e7d32; }
</style>
