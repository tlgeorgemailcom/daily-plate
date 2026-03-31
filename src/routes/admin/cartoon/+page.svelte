<script lang="ts">
  import { invalidateAll } from '$app/navigation';

  let { data } = $props();

  let publishDate = $state(defaultDate(data.strips));
  let altText     = $state('');
  let stripType   = $state('weekday');
  let fileInput: HTMLInputElement;
  let uploading   = $state(false);
  let message     = $state('');
  let error       = $state('');
  let migrating   = $state(false);

  // Default to today if today is unpublished, otherwise next future date.
  // User can manually change to any past date.
  function defaultDate(strips: { publish_date: string }[]) {
    const published = new Set(strips.map(s => s.publish_date));
    const today = new Date().toISOString().slice(0, 10);
    if (!published.has(today)) return today;
    // today is taken — find next future unpublished date
    const d = new Date();
    d.setDate(d.getDate() + 1);
    for (let i = 0; i < 365; i++) {
      const iso = d.toISOString().slice(0, 10);
      if (!published.has(iso)) return iso;
      d.setDate(d.getDate() + 1);
    }
    return today;
  }

  async function runMigration() {
    migrating = true;
    error = '';
    message = '';
    try {
      const res = await fetch('/api/cartoon/migrate');
      const json = await res.json();
      message = json.error ? `Error: ${json.error}` : `Migration: ${JSON.stringify(json.results)}`;
    } catch (e) {
      error = String(e);
    } finally {
      migrating = false;
    }
  }

  async function uploadStrip() {
    const file = fileInput?.files?.[0];
    if (!file)    { error = 'Select an image file.'; return; }
    if (!publishDate) { error = 'Enter a publish date.'; return; }

    uploading = true;
    error = '';
    message = '';

    const form = new FormData();
    form.append('image', file);
    form.append('publish_date', publishDate);
    form.append('alt_text', altText);
    form.append('strip_type', stripType);

    try {
      const res = await fetch('/api/cartoon/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok || json.error) {
        error = json.error ?? 'Upload failed';
      } else {
        message = `✓ Uploaded — ${json.publish_date}`;
        altText = '';
        fileInput.value = '';
        await invalidateAll();
        publishDate = defaultDate(data.strips);
      }
    } catch (e) {
      error = String(e);
    } finally {
      uploading = false;
    }
  }

  async function deleteStrip(date: string) {
    if (!confirm(`Delete strip for ${date}?`)) return;
    const res = await fetch(`/api/cartoon/${date}`, { method: 'DELETE' });
    if (res.ok) {
      await invalidateAll();
      message = `Deleted ${date}`;
    } else {
      error = 'Delete failed';
    }
  }

  function formatDate(d: string) {
    return new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  const today = new Date().toISOString().slice(0, 10);
</script>

<div class="page">
  <div class="top-bar">
    <span class="site-name">TodayPage Admin</span>
    <h1>Feather &amp; Spag — Strip Manager</h1>
    <a href="/cartoon" target="_blank" class="preview-link">View live →</a>
  </div>

  <!-- Migration -->
  <section class="card">
    <h2>Database</h2>
    <p class="hint">Run once to create the <code>cartoon_strips</code> table. Safe to re-run.</p>
    <button onclick={runMigration} disabled={migrating} class="btn-secondary">
      {migrating ? 'Running…' : 'Run Migration'}
    </button>
  </section>

  <!-- Upload form -->
  <section class="card">
    <h2>Upload New Strip</h2>
    <div class="form-grid">
      <label>
        <span>Publish date</span>
        <input type="date" bind:value={publishDate} />
      </label>
      <label>
        <span>Strip type</span>
        <select bind:value={stripType}>
          <option value="weekday">Weekday (900 × 300 px)</option>
          <option value="sunday">Sunday (900 × 450 px)</option>
        </select>
      </label>
      <label class="full-width">
        <span>Alt text <em>(accessibility + SEO — describe the punchline)</em></span>
        <input type="text" bind:value={altText} placeholder="e.g. Blue Jay claims to be a free spirit; Feather notes he visits every single day." />
      </label>
      <label class="full-width">
        <span>Strip image <em>(PNG or JPEG, max 10 MB)</em></span>
        <input type="file" accept="image/png,image/jpeg,image/webp" bind:this={fileInput} />
      </label>
    </div>

    {#if error}   <p class="msg error">{error}</p>   {/if}
    {#if message} <p class="msg success">{message}</p> {/if}

    <button onclick={uploadStrip} disabled={uploading} class="btn-primary">
      {uploading ? 'Uploading…' : 'Upload & Schedule'}
    </button>
  </section>

  <!-- Scheduled / published strips -->
  <section class="card">
    <h2>Scheduled Strips <span class="count">({data.strips.length})</span></h2>
    {#if data.strips.length === 0}
      <p class="hint">No strips uploaded yet.</p>
    {:else}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Status</th>
            <th>Preview</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each data.strips as strip}
            <tr class:future={strip.publish_date > today}>
              <td>
                <a href="/cartoon/{strip.publish_date}" target="_blank" class="date-link">
                  {formatDate(strip.publish_date)}
                </a>
              </td>
              <td class="type">{strip.strip_type}</td>
              <td>
                {#if strip.publish_date > today}
                  <span class="badge scheduled">Scheduled</span>
                {:else}
                  <span class="badge live">Live</span>
                {/if}
              </td>
              <td>
                <img src={strip.image_url} alt="" class="thumb" />
              </td>
              <td>
                <button onclick={() => deleteStrip(strip.publish_date)} class="btn-delete">Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </section>
</div>

<style>
  .page { padding: 1rem 1.5rem 3rem; max-width: 960px; margin: 0 auto; font-family: Arial, sans-serif; }

  .top-bar {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }
  .site-name { font-size: 0.8rem; color: #888; }
  h1 { font-size: 1.3rem; color: #1b5e20; margin: 0; flex: 1; }
  .preview-link { font-size: 0.85rem; color: #1b5e20; text-decoration: none; }
  .preview-link:hover { text-decoration: underline; }

  .card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1.25rem;
    margin-bottom: 1.25rem;
  }

  h2 { margin: 0 0 0.75rem; font-size: 1rem; color: #333; }
  .count { color: #888; font-weight: normal; font-size: 0.9rem; }
  .hint { font-size: 0.85rem; color: #888; margin: 0 0 0.75rem; }

  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem; }
  .form-grid .full-width { grid-column: 1 / -1; }
  label span { display: block; font-size: 0.8rem; color: #555; margin-bottom: 0.25rem; }
  label em { font-style: italic; color: #999; }
  input[type=date], input[type=text], select {
    width: 100%; padding: 0.4rem 0.6rem; border: 1px solid #ccc; border-radius: 5px;
    font-size: 0.9rem; box-sizing: border-box;
  }
  input[type=file] { font-size: 0.85rem; }

  .msg { padding: 0.5rem 0.75rem; border-radius: 5px; font-size: 0.85rem; margin: 0.5rem 0; }
  .msg.error   { background: #ffebee; color: #c62828; }
  .msg.success { background: #e8f5e9; color: #2e7d32; }

  .btn-primary {
    background: #1b5e20; color: white; border: none; border-radius: 6px;
    padding: 0.5rem 1.25rem; font-size: 0.95rem; cursor: pointer;
  }
  .btn-primary:disabled { opacity: 0.6; cursor: default; }
  .btn-primary:hover:not(:disabled) { background: #2e7d32; }

  .btn-secondary {
    background: white; color: #1b5e20; border: 1px solid #1b5e20; border-radius: 6px;
    padding: 0.45rem 1rem; font-size: 0.9rem; cursor: pointer;
  }
  .btn-secondary:hover:not(:disabled) { background: #e8f5e9; }

  table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
  thead th { text-align: left; border-bottom: 1px solid #ddd; padding: 0.4rem 0.5rem; color: #666; font-weight: 600; }
  tbody td { padding: 0.45rem 0.5rem; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
  tr.future td { color: #888; }

  .date-link { color: #1b5e20; text-decoration: none; }
  .date-link:hover { text-decoration: underline; }
  .type { font-size: 0.8rem; color: #999; }

  .badge { font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 10px; font-weight: 600; }
  .badge.live      { background: #e8f5e9; color: #2e7d32; }
  .badge.scheduled { background: #e3f2fd; color: #1565c0; }

  .thumb { width: 120px; height: auto; display: block; border: 1px solid #eee; border-radius: 3px; }

  .btn-delete {
    background: none; border: 1px solid #e57373; color: #c62828;
    border-radius: 5px; padding: 0.2rem 0.55rem; font-size: 0.8rem; cursor: pointer;
  }
  .btn-delete:hover { background: #ffebee; }
</style>
