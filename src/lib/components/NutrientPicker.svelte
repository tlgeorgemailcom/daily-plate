<script lang="ts">
  import { nutrientProgress, selectedPieNutrient, type PieChartNutrient } from '$lib/stores/gameStore';
  import { slide } from 'svelte/transition';
  import { browser } from '$app/environment';

  let isOpen = $state(false);

  const nutrients: { key: PieChartNutrient; label: string; emoji: string }[] = [
    { key: 'calories', label: 'Calories', emoji: '🔥' },
    { key: 'protein', label: 'Protein', emoji: '🥩' },
    { key: 'fat', label: 'Fats', emoji: '🧈' },
    { key: 'carbs', label: 'Carbs', emoji: '🍞' },
    { key: 'fiber', label: 'Fiber', emoji: '🌾' },
    { key: 'water', label: 'Water', emoji: '💧' },
    { key: 'sugar', label: 'Sugar', emoji: '🍬' }
  ];

  // Default progress data for SSR
  const defaultProgress = {
    current: 0,
    target: 0,
    percent: 0,
    unit: '',
    status: 'under' as const
  };

  let progress = $derived(browser ? $nutrientProgress : {
    calories: defaultProgress,
    protein: defaultProgress,
    fat: defaultProgress,
    carbs: defaultProgress,
    fiber: defaultProgress,
    water: defaultProgress,
    sugar: defaultProgress
  });
  
  let selected = $derived(browser ? $selectedPieNutrient : 'calories');

  function selectNutrient(key: PieChartNutrient) {
    selectedPieNutrient.set(key);
    isOpen = false;
  }

  function getBarColor(status: string): string {
    switch (status) {
      case 'warning': return '#d97706';  // dark yellow/amber
      case 'over': return '#dc2626';     // red
      default: return '#3b82f6';          // blue
    }
  }

  function getBarWidth(percent: number): number {
    return Math.min(percent || 0, 100);
  }

  // Get selected nutrient data
  const selectedData = $derived.by(() => {
    const nutrient = nutrients.find(n => n.key === selected) || nutrients[0];
    const data = progress[selected] || defaultProgress;
    return {
      key: nutrient.key,
      label: nutrient.label,
      emoji: nutrient.emoji,
      current: data.current,
      target: data.target,
      percent: data.percent,
      unit: data.unit,
      status: data.status
    };
  });

  function getRowData(key: PieChartNutrient) {
    return progress[key] || defaultProgress;
  }
</script>

<div class="nutrient-picker">
  <!-- Featured bar for selected nutrient -->
  <button class="featured-bar" onclick={() => isOpen = !isOpen}>
    <div class="featured-header">
      <span class="featured-label">
        <span class="emoji">{selectedData.emoji}</span>
        <span class="name">{selectedData.label}</span>
      </span>
      <span class="featured-percent" style="color: {getBarColor(selectedData.status)};">
        {selectedData.percent}%
      </span>
      <span class="featured-value">
        {selectedData.current} / {selectedData.target} {selectedData.unit}
      </span>
      <span class="expand-icon">{isOpen ? '▼' : '▶'}</span>
    </div>
    <div class="featured-bar-container">
      <div 
        class="bar-fill featured-fill"
        style="width: {getBarWidth(selectedData.percent)}%; background: {getBarColor(selectedData.status)};"
      ></div>
      {#if selectedData.percent > 100}
        <div class="overflow-indicator featured-overflow" style="background: {getBarColor(selectedData.status)};"></div>
      {/if}
    </div>
  </button>

  {#if isOpen}
    <div class="nutrient-bars" transition:slide={{ duration: 200 }}>
      <div class="picker-label">Select nutrient to track:</div>
      {#each nutrients as nutrient}
        {@const rowData = getRowData(nutrient.key)}
        <button 
          class="nutrient-row"
          class:selected={selected === nutrient.key}
          onclick={() => selectNutrient(nutrient.key)}
        >
          <div class="nutrient-label">
            <span class="emoji">{nutrient.emoji}</span>
            <span class="name">{nutrient.label}</span>
          </div>
          <div class="bar-container">
            <div 
              class="bar-fill"
              style="width: {getBarWidth(rowData.percent)}%; background: {getBarColor(rowData.status)};"
            ></div>
            {#if rowData.percent > 100}
              <div class="overflow-indicator" style="background: {getBarColor(rowData.status)};"></div>
            {/if}
          </div>
          <div class="nutrient-value">
            <span class="current">{rowData.current}</span>
            <span class="separator">/</span>
            <span class="target">{rowData.target}</span>
            <span class="unit">{rowData.unit}</span>
          </div>
          <div class="percent" style="color: {getBarColor(rowData.status)};">
            {rowData.percent}%
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .nutrient-picker {
    width: 100%;
    margin-top: 0.5rem;
  }

  .featured-bar {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    padding: 0.75rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .featured-bar:hover {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  }

  .featured-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .featured-label {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .featured-label .emoji {
    font-size: 1.25rem;
  }

  .featured-label .name {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
  }

  .featured-value {
    margin-left: auto;
    font-size: 0.875rem;
    color: #475569;
  }

  .expand-icon {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  .featured-bar-container {
    position: relative;
    height: 1rem;
    background: #e2e8f0;
    border-radius: 0.5rem;
    overflow: visible;
  }

  .featured-fill {
    height: 100%;
    border-radius: 0.5rem;
  }

  .featured-overflow {
    top: 50%;
    transform: translateY(-50%);
  }

  .featured-percent {
    font-size: 1rem;
    font-weight: 700;
  }

  .picker-label {
    font-size: 0.75rem;
    color: #64748b;
    padding: 0 0.5rem;
    margin-bottom: 0.25rem;
  }

  .nutrient-bars {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
  }

  .nutrient-row {
    display: grid;
    grid-template-columns: 5rem 1fr 5.5rem 2.5rem;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.5rem;
    background: transparent;
    border: 2px solid transparent;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .nutrient-row:hover {
    background: #f8fafc;
  }

  .nutrient-row.selected {
    background: #eff6ff;
    border-color: #3b82f6;
  }

  .nutrient-label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .emoji {
    font-size: 1rem;
  }

  .name {
    font-size: 0.75rem;
    font-weight: 500;
    color: #334155;
  }

  .bar-container {
    position: relative;
    height: 0.5rem;
    background: #e2e8f0;
    border-radius: 0.25rem;
    overflow: visible;
  }

  .bar-fill {
    height: 100%;
    border-radius: 0.25rem;
    transition: width 0.3s ease-out, background 0.3s;
  }

  .overflow-indicator {
    position: absolute;
    right: -0.25rem;
    top: -0.125rem;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
  }

  .nutrient-value {
    display: flex;
    align-items: baseline;
    gap: 0.125rem;
    font-size: 0.7rem;
    color: #64748b;
    justify-content: flex-end;
  }

  .current {
    font-weight: 600;
    color: #334155;
  }

  .separator {
    color: #94a3b8;
  }

  .unit {
    font-size: 0.6rem;
    color: #94a3b8;
  }

  .percent {
    font-size: 0.7rem;
    font-weight: 600;
    text-align: right;
  }

  /* Mobile: stack on very small screens */
  @media (max-width: 360px) {
    .nutrient-row {
      grid-template-columns: 4rem 1fr 2.5rem;
    }
    .nutrient-value {
      display: none;
    }
  }
</style>
