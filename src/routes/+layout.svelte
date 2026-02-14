<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  
  let { children } = $props();
</script>

<div class="app">
  <nav>
    <a href="/chain" class:active={$page.url.pathname === '/chain'}>
      🔗 Chain
    </a>
    <a href="/plate" class:active={$page.url.pathname === '/plate'}>
      🍽️ Plate
    </a>
    <a href="/balanced-diet" class:active={$page.url.pathname === '/balanced-diet'}>
      🥗 Balance
    </a>
  </nav>
  
  <main>
    {@render children()}
  </main>
  
  <footer>
    <p>A new puzzle every day!</p>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 600px;
    margin: 0 auto;
    padding: var(--spacing-md);
  }
  
  nav {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 1rem;
  }
  
  nav a {
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    text-decoration: none;
    font-weight: 600;
    color: #6b7280;
    background: #f3f4f6;
    transition: all 0.2s;
  }
  
  nav a:hover {
    background: #e5e7eb;
  }
  
  nav a.active {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
  }
  
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  footer {
    text-align: center;
    padding: var(--spacing-lg) 0;
    color: #888;
    font-size: 0.875rem;
  }
  
  @media (min-width: 768px) {
    header h1 {
      font-size: 2.5rem;
    }
  }
</style>
