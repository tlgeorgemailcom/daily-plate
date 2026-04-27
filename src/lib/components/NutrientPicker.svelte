<script lang="ts">
  import { nutrientProgress, selectedPieNutrient, micronutrientTotals, type PieChartNutrient, type FoodMicros } from '$lib/stores/gameStore';
  import { slide } from 'svelte/transition';
  import { browser } from '$app/environment';
  import type { DRIRow } from '$lib/data/dri';

  type Props = { driRow?: DRIRow | null };
  let { driRow = null }: Props = $props();

  let isOpen = $state(false);
  let showMore = $state(false);
  let selectedDRIKey = $state<string | null>(null);

  let microTotals = $derived(browser ? $micronutrientTotals : {} as FoodMicros);

  const nutrients: { key: PieChartNutrient; label: string; emoji: string }[] = [
    { key: 'calories', label: 'Calories', emoji: '🔥' },
    { key: 'protein', label: 'Protein', emoji: '🥩' },
    { key: 'fat', label: 'Fats', emoji: '🧈' },
    { key: 'carbs', label: 'Carbs', emoji: '🍞' },
    { key: 'fiber', label: 'Fiber', emoji: '🌾' },
    { key: 'water', label: 'Water', emoji: '💧' },
    { key: 'sugar', label: 'Sugar', emoji: '🍬' }
  ];

  // DRI micronutrients available in the expanded "more" panel.
  // scale: copper mcg→mg (÷1000), potassium/sodium g→mg (×1000)
  type DRIItem = { key: string; label: string; unit: string; driKey?: keyof DRIRow; scale?: number };
  const DRI_EXTENDED: { section: string; items: DRIItem[] }[] = [
    {
      section: 'Fatty Acids',
      items: [
        { key: 'linoleic_acid',   label: 'Linoleic (Ω6)',    unit: 'g',   driKey: 'linoleic_acid',        scale: 1    },
        { key: 'alpha_linolenic', label: 'α-Linolenic (Ω3)', unit: 'g',   driKey: 'alpha_linolenic_acid', scale: 1    },
        { key: 'saturated_fat',        label: 'Saturated fat',       unit: 'g'  },
        { key: 'monounsaturated_fat',  label: 'Monounsaturated fat', unit: 'g'  },
        { key: 'polyunsaturated_fat',  label: 'Polyunsaturated fat', unit: 'g'  },
        { key: 'cholesterol',          label: 'Cholesterol',         unit: 'mg' },
        { key: 'omega3_total',         label: 'Omega-3 total',       unit: 'g'  },
        { key: 'omega6_total',         label: 'Omega-6 total',       unit: 'g'  },
        { key: 'epa',                  label: 'EPA (20:5n-3)',        unit: 'g'  },
        { key: 'dpa',                  label: 'DPA (22:5n-3)',        unit: 'g'  },
        { key: 'dha',                  label: 'DHA (22:6n-3)',        unit: 'g'  },
      ],
    },
    {
      section: 'Vitamins',
      items: [
        { key: 'vitamin_a_rae',    label: 'Vitamin A',       unit: 'mcg', driKey: 'vitamin_a_rae',    scale: 1 },
        { key: 'vitamin_d',        label: 'Vitamin D',       unit: 'mcg', driKey: 'vitamin_d',        scale: 1 },
        { key: 'vitamin_e',        label: 'Vitamin E',       unit: 'mg',  driKey: 'vitamin_e',        scale: 1 },
        { key: 'vitamin_k',        label: 'Vitamin K1',      unit: 'mcg', driKey: 'vitamin_k',        scale: 1 },
        { key: 'vitamin_c',        label: 'Vitamin C',       unit: 'mg',  driKey: 'vitamin_c',        scale: 1 },
        { key: 'thiamin',          label: 'Thiamin (B1)',    unit: 'mg',  driKey: 'thiamin',          scale: 1 },
        { key: 'riboflavin',       label: 'Riboflavin (B2)', unit: 'mg',  driKey: 'riboflavin',       scale: 1 },
        { key: 'niacin',           label: 'Niacin (B3)',     unit: 'mg',  driKey: 'niacin',           scale: 1 },
        { key: 'pantothenic_acid', label: 'Pant. Acid (B5)', unit: 'mg',  driKey: 'pantothenic_acid', scale: 1 },
        { key: 'vitamin_b6',       label: 'Vitamin B6',      unit: 'mg',  driKey: 'vitamin_b6',       scale: 1 },
        { key: 'folate',           label: 'Folate (B9)',     unit: 'mcg', driKey: 'folate',           scale: 1 },
        { key: 'vitamin_b12',      label: 'Vitamin B12',     unit: 'mcg', driKey: 'vitamin_b12',      scale: 1 },
        { key: 'biotin',           label: 'Biotin (B7)',     unit: 'mcg', driKey: 'biotin',           scale: 1 },
        { key: 'choline',          label: 'Choline',         unit: 'mg',  driKey: 'choline',          scale: 1 },
        { key: 'betaine',          label: 'Betaine',         unit: 'mg'  },
      ],
    },
    {
      section: 'Minerals',
      items: [
        { key: 'calcium',    label: 'Calcium',    unit: 'mg',  driKey: 'calcium',    scale: 1    },
        { key: 'copper',     label: 'Copper',     unit: 'mg',  driKey: 'copper',     scale: 0.001 },
        { key: 'fluoride',   label: 'Fluoride',   unit: 'mg',  driKey: 'fluoride',   scale: 1    },
        { key: 'iodine',     label: 'Iodine',     unit: 'mcg', driKey: 'iodine',     scale: 1    },
        { key: 'iron',       label: 'Iron',       unit: 'mg',  driKey: 'iron',       scale: 1    },
        { key: 'magnesium',  label: 'Magnesium',  unit: 'mg',  driKey: 'magnesium',  scale: 1    },
        { key: 'manganese',  label: 'Manganese',  unit: 'mg',  driKey: 'manganese',  scale: 1    },
        { key: 'phosphorus', label: 'Phosphorus', unit: 'mg',  driKey: 'phosphorus', scale: 1    },
        { key: 'potassium',  label: 'Potassium',  unit: 'mg',  driKey: 'potassium',  scale: 1000 },
        { key: 'selenium',   label: 'Selenium',   unit: 'mcg', driKey: 'selenium',   scale: 1    },
        { key: 'sodium',     label: 'Sodium',     unit: 'mg',  driKey: 'sodium',     scale: 1000 },
        { key: 'zinc',       label: 'Zinc',       unit: 'mg',  driKey: 'zinc',       scale: 1    },
      ],
    },
    {
      section: 'Amino Acids',
      items: [
        { key: 'tryptophan',    label: 'Tryptophan',    unit: 'g' },
        { key: 'threonine',     label: 'Threonine',     unit: 'g' },
        { key: 'isoleucine',    label: 'Isoleucine',    unit: 'g' },
        { key: 'leucine',       label: 'Leucine',       unit: 'g' },
        { key: 'lysine',        label: 'Lysine',        unit: 'g' },
        { key: 'methionine',    label: 'Methionine',    unit: 'g' },
        { key: 'phenylalanine', label: 'Phenylalanine', unit: 'g' },
        { key: 'valine',        label: 'Valine',        unit: 'g' },
        { key: 'histidine',     label: 'Histidine',     unit: 'g' },
        { key: 'arginine',      label: 'Arginine',      unit: 'g' },
        { key: 'alanine',       label: 'Alanine',       unit: 'g' },
        { key: 'aspartic_acid', label: 'Aspartic acid', unit: 'g' },
        { key: 'glutamic_acid', label: 'Glutamic acid', unit: 'g' },
        { key: 'glycine',       label: 'Glycine',       unit: 'g' },
        { key: 'proline',       label: 'Proline',       unit: 'g' },
        { key: 'serine',        label: 'Serine',        unit: 'g' },
      ],
    },
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
    selectedDRIKey = null;
    isOpen = false;
  }

  function selectDRINutrient(key: string) {
    selectedDRIKey = key;
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

  // Get selected nutrient data — DRI selection overrides macro selection in the featured bar
  const selectedData = $derived.by(() => {
    if (selectedDRIKey) {
      for (const section of DRI_EXTENDED) {
        const item = section.items.find(i => i.key === selectedDRIKey);
        if (item) {
          const rawTarget = (item.driKey && driRow) ? Number(driRow[item.driKey]) : 0;
          const target = (item.scale != null && rawTarget > 0)
            ? parseFloat((rawTarget * item.scale).toPrecision(3))
            : rawTarget > 0 ? rawTarget : 0;
          const rawCurrent = (microTotals as Record<string, number>)[item.key] ?? 0;
          const current = parseFloat(rawCurrent.toFixed(2));
          const percent = target > 0 ? Math.round((current / target) * 100) : 0;
          return {
            key: item.key,
            label: item.label,
            emoji: '📊',
            current,
            target,
            percent,
            unit: item.unit,
            status: (percent > 120 ? 'over' : percent > 100 ? 'warning' : 'under') as 'under' | 'warning' | 'over'
          };
        }
      }
    }
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

      <button class="more-link" onclick={() => showMore = !showMore}>
        {showMore ? '▲ less' : '▼ more nutrients'}
      </button>

      {#if showMore}
        <div class="dri-extended" transition:slide={{ duration: 150 }}>
          {#each DRI_EXTENDED as section}
            <div class="dri-section-heading">{section.section}</div>
            {#each section.items as item}
              {@const rawTarget = (item.driKey && driRow) ? Number(driRow[item.driKey]) : null}
              {@const target = (rawTarget !== null && item.scale != null) ? parseFloat((rawTarget * item.scale).toPrecision(3)) : null}
              {@const rawCurrent = (microTotals as Record<string, number>)[item.key] ?? 0}
              {@const current = parseFloat(rawCurrent.toFixed(2))}
              {@const pct = target !== null && target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0}
              <button
                class="dri-row"
                class:selected={selectedDRIKey === item.key}
                onclick={() => selectDRINutrient(item.key)}
              >
                <span class="name">{item.label}</span>
                <div class="dri-bar-wrap">
                  {#if target !== null && target > 0}
                    <div class="dri-bar-bg">
                      <div class="dri-bar-fill" style="width:{pct}%"></div>
                    </div>
                  {/if}
                </div>
                <span class="dri-target">
                  {current > 0 ? `${current}\u00a0/\u00a0` : ''}{target !== null ? `${target}\u00a0${item.unit}` : `\u2014\u00a0${item.unit}`}
                </span>
              </button>
            {/each}
          {/each}
        </div>
      {/if}
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

  .more-link {
    display: block;
    width: 100%;
    padding: 0.25rem 0.5rem;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 0.7rem;
    color: #6366f1;
    text-align: center;
    letter-spacing: 0.03em;
  }

  .more-link:hover {
    color: #4338ca;
  }

  .dri-extended {
    margin-top: 0.25rem;
    border-top: 1px solid #e2e8f0;
    padding-top: 0.25rem;
  }

  .dri-section-heading {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #94a3b8;
    padding: 0.5rem 0.5rem 0.15rem;
  }

  .dri-row {
    display: grid;
    grid-template-columns: 7rem 1fr 6rem;
    align-items: center;
    gap: 0.375rem;
    width: 100%;
    padding: 0.25rem 0.5rem;
    background: transparent;
    border: 2px solid transparent;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .dri-row:hover {
    background: #f8fafc;
  }

  .dri-row.selected {
    background: #eff6ff;
    border-color: #6366f1;
  }

  .dri-target {
    font-size: 0.7rem;
    color: #64748b;
    font-variant-numeric: tabular-nums;
    text-align: right;
  }

  .dri-bar-wrap {
    display: flex;
    align-items: center;
  }

  .dri-bar-bg {
    width: 100%;
    height: 0.3rem;
    background: #e2e8f0;
    border-radius: 0.25rem;
    overflow: hidden;
  }

  .dri-bar-fill {
    height: 100%;
    background: #6366f1;
    border-radius: 0.25rem;
    transition: width 0.3s ease-out;
  }
</style>
