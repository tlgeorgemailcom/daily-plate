<script lang="ts">
  import { selectedContainer, type Container } from '$lib/stores/gameStore';

  const containers: { id: Container; icon: string; label: string }[] = [
    { id: 'plate', icon: '🍽️', label: 'Plate' },
    { id: 'bowl', icon: '🥣', label: 'Bowl' },
    { id: 'cup', icon: '☕', label: 'Cup' },
    { id: 'glass', icon: '🥛', label: 'Glass' },
    { id: 'saucer', icon: '🫖', label: 'Saucer' }
  ];

  let current = $derived($selectedContainer);

  function select(container: Container) {
    selectedContainer.set(container);
  }
</script>

<div class="container-buttons">
  {#each containers as c}
    <button 
      class="container-btn"
      class:selected={current === c.id}
      onclick={() => select(c.id)}
    >
      <span class="icon">{c.icon}</span>
      <span class="label">{c.label}</span>
    </button>
  {/each}
</div>

<style>
  .container-buttons {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.375rem;
  }

  .container-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.125rem;
    padding: 0.5rem 0.25rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
    transition: all 0.15s;
  }

  .container-btn:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .container-btn.selected {
    border-color: #3b82f6;
    background: #eff6ff;
    box-shadow: 0 2px 4px rgb(59 130 246 / 0.2);
  }

  .icon {
    font-size: 1.25rem;
  }

  .label {
    font-size: 0.625rem;
    font-weight: 500;
    color: #374151;
  }
</style>
