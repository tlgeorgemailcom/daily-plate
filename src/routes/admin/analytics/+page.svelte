<script lang="ts">
  import { goto } from '$app/navigation';

  let { data } = $props();

  const BUCKET_ORDER = ['<30s', '30s-2min', '2-5min', '5min+'];

  function shiftDate(delta: number) {
    const d = new Date(data.date + 'T12:00:00Z');
    d.setUTCDate(d.getUTCDate() + delta);
    goto(`?date=${d.toISOString().slice(0, 10)}`);
  }

  function toggleFp(fp: string) {
    const next = data.filterFp === fp ? null : fp;
    const params = new URLSearchParams({ date: data.date });
    if (next) params.set('fp', next);
    if (data.hideOwner) params.set('hideOwner', '1');
    goto(`?${params}`);
  }

  function toggleOwner() {
    const params = new URLSearchParams({ date: data.date });
    if (data.filterFp) params.set('fp', data.filterFp);
    if (!data.hideOwner) params.set('hideOwner', '1');
    goto(`?${params}`);
  }

  function logout() {
    document.cookie = 'admin_auth=; Max-Age=0; path=/';
    goto('/admin/login');
  }

  function shortFp(fp: string) {
    return fp ? fp.slice(0, 8) + '…' : '(no fp)';
  }

  function formatTime(ts: string) {
    try {
      return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Chicago' });
    } catch { return ts; }
  }

  const overviewCards = $derived([
    ['Events',   data.overview.total],
    ['Sessions', data.overview.sessions],
    ['Enters',   data.overview.enters],
    ['Exits',    data.overview.exits],
    ['Devices',  data.overview.devices],
  ] as [string, number][]);
</script>

<div class="page">
  <!-- Header -->
  <header class="top-bar">
    <span class="site-name">TodayPage</span>
    <h1>Analytics</h1>
    <button class="logout-btn" onclick={logout}>Logout</button>
  </header>

  <!-- Date navigation -->
  <nav class="date-nav">
    <button class="nav-btn" onclick={() => shiftDate(-1)}>←</button>
    <input
      type="date"
      class="date-input"
      value={data.date}
      onchange={(e) => goto(`?date=${e.currentTarget.value}`)}
    />
    <button class="nav-btn" onclick={() => shiftDate(1)}>→</button>
    <button class="owner-btn" class:active={data.hideOwner} onclick={toggleOwner}>
      {data.hideOwner ? '👤 Owner hidden' : '👤 Show owner'}
    </button>
  </nav>

  <!-- Overview cards -->
  <section class="cards">
    {#each overviewCards as [label, val]}
      <div class="card">
        <span class="card-num">{val}</span>
        <span class="card-lbl">{label}</span>
      </div>
    {/each}
  </section>

  {#if data.overview.total === 0}
    <div class="empty">No events on this date.</div>
  {:else}

    <!-- Two-column: Devices + Player Properties -->
    <div class="two-col">
      <!-- Device Fingerprints -->
      <section class="panel">
        <h2>Devices</h2>
        <p class="hint">Click to filter sessions below</p>
        <table>
          <thead>
            <tr><th>device_fp</th><th>Events</th></tr>
          </thead>
          <tbody>
            {#each data.uniqueFps as fp}
              <tr
                class="fp-row"
                class:active={data.filterFp === fp}
                onclick={() => toggleFp(fp)}
              >
                <td><span class="fp-chip" class:active={data.filterFp === fp}>{fp || '(empty)'}</span></td>
                <td>{data.fpCounts[fp]}</td>
              </tr>
            {/each}
          </tbody>
        </table>
        {#if data.filterFp}
          <button class="clear-btn" onclick={() => toggleFp(data.filterFp!)}>
            Clear filter ×
          </button>
        {/if}
      </section>

      <!-- Player Properties -->
      <section class="panel">
        <h2>Player Properties</h2>
        <dl class="props-list">
          {#each Object.entries(data.playerProps) as [field, counts]}
            {#if counts.length}
              <dt>{field}</dt>
              <dd>{counts.map(([v, n]) => `${v}: ${n}`).join('  |  ')}</dd>
            {/if}
          {/each}
        </dl>
      </section>
    </div>

    <!-- Game Engagement -->
    {#if data.games.length}
      <section class="panel">
        <h2>Game Engagement</h2>
        <table>
          <thead>
            <tr>
              <th>Game</th>
              <th>Enters</th>
              <th>Exits</th>
              {#each BUCKET_ORDER as b}<th>{b}</th>{/each}
            </tr>
          </thead>
          <tbody>
            {#each data.games as g}
              <tr>
                <td>{g.game}</td>
                <td>{g.enters}</td>
                <td>{g.exits}</td>
                {#each BUCKET_ORDER as b}
                  <td>{g.buckets[b] ?? '—'}</td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </section>
    {/if}

    <!-- Per-Device Game Sessions -->
    {#if data.gameSessions.length}
      <section class="panel">
        <h2>
          Game Sessions
          {#if data.filterFp}
            <span class="filter-badge">fp: {shortFp(data.filterFp)} ×</span>
          {/if}
        </h2>
        <table>
          <thead>
            <tr><th>device_fp</th><th>Game</th><th>Duration</th><th>Bucket</th><th>Time (CST)</th></tr>
          </thead>
          <tbody>
            {#each data.gameSessions as s}
              <tr>
                <td><span class="fp-chip">{s.fp || '(empty)'}</span></td>
                <td>{s.game}</td>
                <td>{s.duration}s</td>
                <td>{s.bucket}</td>
                <td>{formatTime(s.ts)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>
    {/if}

    <!-- Bottom row: Visit Count Distribution + All Events -->
    <div class="two-col">
      <!-- Visit Count Distribution -->
      <section class="panel">
        <h2>Visit Counts</h2>
        <table>
          <thead><tr><th>visit_count</th><th>Sessions</th></tr></thead>
          <tbody>
            {#each data.vcDist as [v, n]}
              <tr><td>{v}</td><td>{n}</td></tr>
            {/each}
          </tbody>
        </table>
      </section>

      <!-- All Events -->
      <section class="panel">
        <h2>All Events</h2>
        <table>
          <thead><tr><th>Event</th><th>Count</th></tr></thead>
          <tbody>
            {#each data.allEventCounts as [name, cnt]}
              <tr><td class="event-name">{name}</td><td>{cnt}</td></tr>
            {/each}
          </tbody>
        </table>
      </section>
    </div>

  {/if}
</div>

<style>
  .page {
    max-width: 960px;
    margin: 0 auto;
    padding: 1rem;
    font-family: var(--font-body, 'Nunito', system-ui, sans-serif);
  }

  /* Header */
  .top-bar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0 1rem;
    border-bottom: 2px solid #e8f5e9;
    margin-bottom: 1rem;
  }
  .site-name { font-size: 0.8rem; color: #888; text-transform: uppercase; letter-spacing: .05em; }
  .top-bar h1 {
    flex: 1;
    font-family: var(--font-display, 'Fredoka One', sans-serif);
    font-size: 1.6rem;
    color: #2e7d32;
    margin: 0;
  }
  .logout-btn {
    font-size: 13px;
    padding: 6px 14px;
    background: #f5f5f5;
    color: #555;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
  }
  .logout-btn:hover { background: #ffe0e0; color: #c62828; border-color: #ef9a9a; }

  /* Date nav */
  .date-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }
  .nav-btn {
    padding: 6px 14px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
  }
  .nav-btn:hover { background: #388e3c; }
  .owner-btn {
    margin-left: 0.5rem;
    padding: 6px 12px;
    border: 1px solid #c8e6c9;
    border-radius: 8px;
    background: white;
    color: #555;
    font-size: 13px;
    cursor: pointer;
    font-family: inherit;
  }
  .owner-btn.active { background: #e8f5e9; border-color: #4caf50; color: #2e7d32; font-weight: 600; }
  .date-input {
    padding: 6px 10px;
    border: 1px solid #c8e6c9;
    border-radius: 8px;
    font-size: 15px;
    color: #333;
    font-family: inherit;
  }

  /* Overview cards */
  .cards {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }
  @media (max-width: 600px) { .cards { grid-template-columns: repeat(3, 1fr); } }
  .card {
    background: white;
    border-radius: 12px;
    padding: 1rem 0.5rem;
    text-align: center;
    box-shadow: 0 1px 4px rgba(0,0,0,.08);
    border-top: 3px solid #4caf50;
  }
  .card-num { display: block; font-size: 2rem; font-weight: 700; color: #2e7d32; }
  .card-lbl { display: block; font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: .05em; margin-top: 2px; }

  .empty { text-align: center; color: #888; padding: 3rem; font-size: 1.1rem; }

  /* Two-column layout */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  @media (max-width: 700px) { .two-col { grid-template-columns: 1fr; } }

  /* Panels */
  .panel {
    background: white;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 1px 4px rgba(0,0,0,.08);
    margin-bottom: 1rem;
  }
  .panel h2 {
    font-family: var(--font-display, 'Fredoka One', sans-serif);
    font-size: 1.1rem;
    color: #2e7d32;
    margin: 0 0 0.6rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .hint { font-size: 11px; color: #aaa; margin: -0.4rem 0 0.6rem; }

  /* Tables */
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th {
    background: #4caf50;
    color: white;
    padding: 6px 10px;
    text-align: left;
    font-weight: 600;
    font-size: 12px;
  }
  td { padding: 6px 10px; border-bottom: 1px solid #f0f0f0; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #f9fbe7; }

  /* FP chips */
  .fp-chip {
    font-family: monospace;
    font-size: 11px;
    background: #e8f5e9;
    border: 1px solid #c8e6c9;
    border-radius: 4px;
    padding: 2px 6px;
  }
  .fp-chip.active { background: #4caf50; color: white; border-color: #388e3c; }

  .fp-row { cursor: pointer; }
  .fp-row.active td { background: #f1f8e9; }

  .clear-btn {
    margin-top: 0.5rem;
    font-size: 12px;
    padding: 4px 10px;
    background: #fff3e0;
    color: #e65100;
    border: 1px solid #ffcc80;
    border-radius: 6px;
    cursor: pointer;
  }

  .filter-badge {
    font-size: 11px;
    font-family: monospace;
    background: #fff3e0;
    color: #e65100;
    border: 1px solid #ffcc80;
    border-radius: 4px;
    padding: 2px 7px;
    cursor: pointer;
  }

  /* Player props */
  .props-list {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px 12px;
    font-size: 13px;
  }
  dt { font-weight: 600; color: #555; white-space: nowrap; }
  dd { color: #333; }

  /* Event name col */
  .event-name { font-family: monospace; font-size: 12px; }
</style>
