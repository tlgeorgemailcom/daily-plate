<script lang="ts">
  import { enhance } from '$app/forms';
  let { form, data } = $props();

  $effect(() => {
    if (form?.success) {
      window.location.href = '/admin/analytics';
    }
  });
</script>

<div class="login-wrap">
  <form method="POST" use:enhance class="login-form">
    <div class="logo">🥗</div>
    <h2>TodayPage Admin</h2>
    {#if form?.error}
      <p class="err-msg">{form.error}</p>
    {/if}
    {#if !data.hasPw}
      <p class="err-msg">⚠️ ADMIN_PASSWORD not set on server</p>
    {/if}
    <input
      type="password"
      name="password"
      placeholder="Password"
      autocomplete="current-password"
      autofocus
    />
    <button type="submit">Enter</button>
  </form>
</div>

<style>
  .login-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 2rem 1rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.85rem;
    background: white;
    border-radius: 16px;
    padding: 2.5rem 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,.1);
    width: 100%;
    max-width: 320px;
  }

  .logo { font-size: 2.5rem; }

  h2 {
    font-family: var(--font-display, 'Fredoka One', sans-serif);
    font-size: 1.4rem;
    color: #2e7d32;
    margin: 0;
  }

  input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #c8e6c9;
    border-radius: 8px;
    font-size: 15px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus { border-color: #4caf50; }

  button {
    width: 100%;
    padding: 10px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;
  }
  button:hover { background: #388e3c; }

  .err-msg {
    color: #c62828;
    font-size: 13px;
    margin: 0;
    background: #ffebee;
    border: 1px solid #ef9a9a;
    border-radius: 6px;
    padding: 6px 12px;
    width: 100%;
    text-align: center;
  }
</style>
