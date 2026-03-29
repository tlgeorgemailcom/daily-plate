<script lang="ts">
  let { children } = $props();
</script>

<nav class="admin-nav">
  <a href="/admin/analytics" class="nav-link">Analytics</a>
  <a href="/admin/subscribers" class="nav-link">Subscribers</a>
  <a href="/admin/cartoon" class="nav-link">Cartoon</a>
</nav>

{@render children()}

<style>
  .admin-nav {
    background: #1b5e20;
    padding: 0.5rem 1rem;
    display: flex;
    gap: 1rem;
  }
  .nav-link {
    color: #a5d6a7;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 6px;
    transition: background 0.15s;
  }
  .nav-link:hover { background: rgba(255,255,255,0.1); color: white; }
</style>
