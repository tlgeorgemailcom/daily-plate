<script lang="ts">
  import { goto } from '$app/navigation';

  let { data } = $props();

  type Player = (typeof data.players)[number];
  type Status = 'idle' | 'saving' | 'saved' | 'error';

  const TIERS = ['free', 'plus', 'allin', 'moderator'] as const;
  const TIER_LABELS: Record<string, string> = {
    free:      'Free',
    plus:      'Plus ($4.95)',
    allin:     'ALL·IN ($14.95)',
    moderator: 'Moderator',
  };

  // Local reactive copy so tier counts update immediately on change
  let players = $state<Player[]>(data.players.map((p: Player) => ({ ...p })));
  let statuses = $state<Record<string, Status>>({});
  let confirmDelete = $state<string | null>(null); // player id awaiting confirmation
  let resetStatuses = $state<Record<string, 'idle' | 'sending' | 'sent' | 'error'>>({});

  async function setTier(playerId: string, tier: string) {
    statuses[playerId] = 'saving';
    // Optimistically update local state so counts refresh immediately
    const p = players.find(x => x.id === playerId);
    if (p) p.subscription_tier = tier;
    try {
      const res = await fetch('/api/admin/set-tier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id: playerId, tier }),
      });
      if (!res.ok) throw new Error('failed');
      statuses[playerId] = 'saved';
      setTimeout(() => { statuses[playerId] = 'idle'; }, 2500);
    } catch {
      statuses[playerId] = 'error';
      // Revert optimistic update on failure
      const orig = data.players.find((x: Player) => x.id === playerId);
      if (p && orig) p.subscription_tier = orig.subscription_tier;
    }
  }

  async function deletePlayer(playerId: string) {
    statuses[playerId] = 'saving';
    try {
      const res = await fetch('/api/admin/delete-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id: playerId }),
      });
      if (!res.ok) throw new Error('failed');
      players = players.filter(p => p.id !== playerId);
    } catch {
      statuses[playerId] = 'error';
    } finally {
      confirmDelete = null;
    }
  }

  async function sendResetLink(email: string, playerId: string) {
    resetStatuses[playerId] = 'sending';
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('failed');
      resetStatuses[playerId] = 'sent';
      setTimeout(() => { resetStatuses[playerId] = 'idle'; }, 4000);
    } catch {
      resetStatuses[playerId] = 'error';
    }
  }

  function logout() {
    document.cookie = 'admin_auth=; Max-Age=0; path=/';
    goto('/admin/login');
  }

  function formatDate(dt: string | null) {
    if (!dt) return '—';
    try {
      return new Date(dt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        timeZone: 'America/Chicago',
      });
    } catch { return dt; }
  }

  const tierCounts = $derived(
    TIERS.reduce((acc, t) => {
      acc[t] = players.filter(p => p.subscription_tier === t).length;
      return acc;
    }, {} as Record<string, number>)
  );
</script>

<div class="page">
  <header class="top-bar">
    <span class="site-name">TodayPage</span>
    <h1>Subscribers</h1>
    <span class="player-count">{players.length} users</span>
    <button class="logout-btn" onclick={logout}>Logout</button>
  </header>

  <section class="summary">
    {#each TIERS as t}
      <div class="tier-card tier-{t}">
        <span class="tier-count">{tierCounts[t] ?? 0}</span>
        <span class="tier-label">{TIER_LABELS[t]}</span>
      </div>
    {/each}
  </section>

  <section class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Tier</th>
          <th>Joined</th>
          <th>Last Login</th>
          <th>Reset</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each players as player (player.id)}
          <tr class:deleting={confirmDelete === player.id}>
            <td class="email">{player.email}</td>
            <td class="name">{player.display_name ?? '—'}</td>
            <td class="tier-cell">
              <select
                value={player.subscription_tier}
                onchange={(e) => setTier(player.id, e.currentTarget.value)}
                disabled={statuses[player.id] === 'saving'}
                class="tier-select tier-{player.subscription_tier}"
              >
                {#each TIERS as t}
                  <option value={t}>{TIER_LABELS[t]}</option>
                {/each}
              </select>
            </td>
            <td class="date">{formatDate(player.created_at)}</td>
            <td class="date">{formatDate(player.last_login_at)}</td>
            <td class="reset-cell">
              {#if resetStatuses[player.id] === 'sending'}
                <span class="badge saving">Sending…</span>
              {:else if resetStatuses[player.id] === 'sent'}
                <span class="badge saved">Sent ✓</span>
              {:else if resetStatuses[player.id] === 'error'}
                <span class="badge error">Error</span>
              {:else}
                <button
                  class="reset-btn"
                  onclick={() => sendResetLink(player.email, player.id)}
                  title="Send password reset link to {player.email}"
                >Send reset link</button>
              {/if}
            </td>
            <td class="status-cell">
              {#if statuses[player.id] === 'saving'}
                <span class="badge saving">Saving…</span>
              {:else if statuses[player.id] === 'saved'}
                <span class="badge saved">Saved ✓</span>
              {:else if statuses[player.id] === 'error'}
                <span class="badge error">Error</span>
              {/if}
            </td>
            <td class="delete-cell">
              {#if confirmDelete === player.id}
                <span class="confirm-ask">Delete?</span>
                <button class="confirm-yes" onclick={() => deletePlayer(player.id)}>Yes</button>
                <button class="confirm-no" onclick={() => confirmDelete = null}>No</button>
              {:else}
                <button
                  class="delete-btn"
                  onclick={() => confirmDelete = player.id}
                  title="Delete subscriber"
                >✕</button>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
</div>

<style>
  .page { min-height: 100vh; background: #f5f5f5; font-family: system-ui, sans-serif; }

  .top-bar {
    background: #1b5e20;
    color: white;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1.5rem;
  }
  .site-name { font-weight: 700; font-size: 18px; color: #a5d6a7; }
  .top-bar h1 { font-size: 20px; margin: 0; flex: 1; }
  .player-count { font-size: 13px; color: #a5d6a7; }
  .logout-btn {
    background: rgba(255,255,255,0.15);
    border: none;
    color: white;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
  }
  .logout-btn:hover { background: rgba(255,255,255,0.25); }

  .summary {
    display: flex;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    flex-wrap: wrap;
  }
  .tier-card {
    background: white;
    border-radius: 10px;
    padding: 0.75rem 1.5rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 110px;
    border-top: 4px solid #ccc;
  }
  .tier-card.tier-free      { border-top-color: #9e9e9e; }
  .tier-card.tier-plus      { border-top-color: #1565c0; }
  .tier-card.tier-allin     { border-top-color: #6a1b9a; }
  .tier-card.tier-moderator { border-top-color: #1b5e20; }
  .tier-count { font-size: 32px; font-weight: 700; color: #212121; line-height: 1; }
  .tier-label { font-size: 11px; color: #666; font-weight: 600; text-transform: uppercase; margin-top: 4px; }

  .table-wrap {
    padding: 0 1.5rem 2rem;
    overflow-x: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }
  thead tr { background: #e8f5e9; }
  th {
    text-align: left;
    padding: 12px 16px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #1b5e20;
    letter-spacing: 0.5px;
  }
  tbody tr:nth-child(even) { background: #fafafa; }
  tbody tr:hover { background: #f1f8e9; }
  td {
    padding: 10px 16px;
    font-size: 14px;
    color: #333;
    border-top: 1px solid #f0f0f0;
  }
  .email { font-family: monospace; font-size: 13px; color: #444; }
  .name  { font-size: 13px; }
  .date  { color: #888; font-size: 13px; white-space: nowrap; }

  .tier-select {
    padding: 5px 8px;
    border-radius: 6px;
    border: 2px solid #ccc;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    background: white;
    outline: none;
    transition: border-color 0.15s;
  }
  .tier-select:focus  { border-color: #1b5e20; }
  .tier-select:disabled { opacity: 0.6; cursor: not-allowed; }
  .tier-select.tier-free      { border-color: #bdbdbd; color: #757575; }
  .tier-select.tier-plus      { border-color: #1565c0; color: #1565c0; }
  .tier-select.tier-allin     { border-color: #6a1b9a; color: #6a1b9a; }
  .tier-select.tier-moderator { border-color: #2e7d32; color: #2e7d32; }

  .status-cell { width: 80px; }
  .badge {
    display: inline-block;
    padding: 3px 9px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }
  .badge.saving { background: #fff9c4; color: #f59f00; }
  .badge.saved  { background: #e8f5e9; color: #2e7d32; }
  .badge.error  { background: #ffebee; color: #c62828; }

  .delete-cell { width: 130px; text-align: right; white-space: nowrap; }
  .delete-btn {
    background: none;
    border: 1px solid #e0e0e0;
    color: #bdbdbd;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    line-height: 1;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
  }
  .delete-btn:hover { border-color: #ef5350; color: #ef5350; background: #fff5f5; }

  .confirm-ask { font-size: 12px; color: #c62828; font-weight: 600; margin-right: 6px; }
  .confirm-yes {
    background: #c62828; color: white; border: none;
    padding: 3px 10px; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600;
    margin-right: 4px;
  }
  .confirm-yes:hover { background: #b71c1c; }
  .confirm-no {
    background: #eee; color: #333; border: none;
    padding: 3px 10px; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600;
  }
  .confirm-no:hover { background: #e0e0e0; }

  tr.deleting { background: #fff8f8 !important; }

  .reset-cell { white-space: nowrap; }
  .reset-btn {
    background: none;
    border: 1px solid #90caf9;
    color: #1565c0;
    padding: 4px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: background 0.15s, border-color 0.15s;
  }
  .reset-btn:hover { background: #e3f2fd; border-color: #1565c0; }
</style>
