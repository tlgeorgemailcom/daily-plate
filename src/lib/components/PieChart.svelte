<script lang="ts">
  import { GROUP_COLORS, GROUP_NAMES, type FoodGroup } from '$lib/data/food-portions';
  import { caloriesByGroup, targets, totalCalories, nutrientTotals, nutrientTargets } from '$lib/stores/gameStore';

  // Inner pie: main food groups only
  const innerGroups: FoodGroup[] = ['vegetable', 'fruit', 'grain', 'protein'];
  
  // Macro colors for outer ring
  const MACRO_COLORS = {
    protein: '#ef4444',   // red
    fat: '#f59e0b',       // amber/yellow
    carbs: '#3b82f6'      // blue
  };

  // Get current values from stores
  let byGroup = $derived($caloriesByGroup);
  let target = $derived($targets);
  let total = $derived($totalCalories);
  let nutrients = $derived($nutrientTotals);
  let nutrientTarget = $derived($nutrientTargets);

  // Calculate actual macro calories consumed (4 cal/g protein, 9 cal/g fat, 4 cal/g carbs)
  const macroCalories = $derived.by(() => {
    return {
      protein: nutrients.protein * 4,
      fat: nutrients.fat * 9,
      carbs: nutrients.carbs * 4
    };
  });

  // Target macro calories
  const macroTargetCalories = $derived.by(() => {
    return {
      protein: nutrientTarget.protein * 4,
      fat: nutrientTarget.fats * 9,
      carbs: nutrientTarget.carbohydrates * 4
    };
  });

  // Target macro ratios (fixed positions for the ring sections)
  const macroTargetRatios = $derived.by(() => {
    const totalCal = macroTargetCalories.protein + macroTargetCalories.fat + macroTargetCalories.carbs;
    
    return {
      protein: totalCal > 0 ? (macroTargetCalories.protein / totalCal) * 100 : 33,
      fat: totalCal > 0 ? (macroTargetCalories.fat / totalCal) * 100 : 33,
      carbs: totalCal > 0 ? (macroTargetCalories.carbs / totalCal) * 100 : 34
    };
  });

  // Outer ring sections with fixed positions and fill percentages
  const outerRingSections = $derived.by(() => {
    const macros = ['protein', 'fat', 'carbs'] as const;
    const result: { 
      macro: string; 
      color: string; 
      startAngle: number; 
      endAngle: number;
      fillPercent: number;  // How full is this section (0-100+)
      fillEndAngle: number; // Where the fill ends
    }[] = [];
    
    let currentAngle = -90;

    for (const macro of macros) {
      const sectionPercent = macroTargetRatios[macro];
      const sectionAngle = (sectionPercent / 100) * 360;
      const sectionStart = currentAngle;
      const sectionEnd = currentAngle + sectionAngle;
      
      // Calculate how full this section is (actual / target)
      const actual = macroCalories[macro];
      const targetCal = macroTargetCalories[macro];
      const fillPercent = targetCal > 0 ? (actual / targetCal) * 100 : 0;
      
      // Fill angle is proportional to fill percent, capped at section size (100%)
      const fillRatio = Math.min(fillPercent / 100, 1);
      const fillEndAngle = sectionStart + (sectionAngle * fillRatio);
      
      result.push({
        macro,
        color: MACRO_COLORS[macro],
        startAngle: sectionStart,
        endAngle: sectionEnd,
        fillPercent,
        fillEndAngle
      });
      
      currentAngle = sectionEnd;
    }
    return result;
  });

  // Target calories per food group (from settings)
  const groupTargetCalories = $derived.by(() => {
    const totalCal = target.totalCalories;
    return {
      vegetable: (target.groups.vegetable / 100) * totalCal,
      fruit: (target.groups.fruit / 100) * totalCal,
      grain: (target.groups.grain / 100) * totalCal,
      protein: (target.groups.protein / 100) * totalCal
    };
  });

  // Inner pie: fixed sections like outer ring, each fills based on consumption vs target
  const innerSections = $derived.by(() => {
    const result: { 
      group: FoodGroup; 
      color: string; 
      startAngle: number; 
      endAngle: number;
      fillPercent: number;
      fillEndAngle: number;
    }[] = [];
    
    let currentAngle = -90;
    
    // Calculate total target percentage for inner groups
    let totalTargetPercent = 0;
    for (const group of innerGroups) {
      totalTargetPercent += target.groups[group];
    }
    
    // If no targets set, use equal distribution
    if (totalTargetPercent === 0) {
      totalTargetPercent = 100;
    }

    for (const group of innerGroups) {
      // Section size based on target ratio (normalized to 100%)
      const groupTargetPercent = target.groups[group] || (100 / innerGroups.length);
      const normalizedPercent = (groupTargetPercent / totalTargetPercent) * 100;
      const sectionAngle = (normalizedPercent / 100) * 360;
      const sectionStart = currentAngle;
      const sectionEnd = currentAngle + sectionAngle;
      
      // Calculate fill based on actual vs target
      const actual = byGroup[group];
      const targetCal = groupTargetCalories[group as keyof typeof groupTargetCalories] || 100;
      const fillPercent = targetCal > 0 ? (actual / targetCal) * 100 : 0;
      
      // Fill angle is proportional to fill percent, capped at section size
      const fillRatio = Math.min(fillPercent / 100, 1);
      const fillEndAngle = sectionStart + (sectionAngle * fillRatio);
      
      result.push({
        group,
        color: GROUP_COLORS[group],
        startAngle: sectionStart,
        endAngle: sectionEnd,
        fillPercent,
        fillEndAngle
      });
      
      currentAngle = sectionEnd;
    }
    
    return result;
  });

  // SVG arc path for pie slice (filled wedge)
  function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
    if (endAngle - startAngle < 0.1) return ''; // Skip tiny slices
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${x} ${y} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  }

  // SVG arc path for ring (donut segment)
  function describeRingArc(x: number, y: number, innerR: number, outerR: number, startAngle: number, endAngle: number): string {
    if (endAngle - startAngle < 0.1) return ''; // Skip tiny slices
    const outerStart = polarToCartesian(x, y, outerR, startAngle);
    const outerEnd = polarToCartesian(x, y, outerR, endAngle);
    const innerStart = polarToCartesian(x, y, innerR, startAngle);
    const innerEnd = polarToCartesian(x, y, innerR, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
      'Z'
    ].join(' ');
  }

  // SVG arc path for text (just the arc, no fill)
  // For bottom half of circle, we reverse direction so text reads right-side-up
  function describeTextArc(x: number, y: number, r: number, startAngle: number, endAngle: number): string {
    const midAngle = (startAngle + endAngle) / 2;
    // If the middle of the arc is in the bottom half (0 to 180 degrees, where -90 is top)
    // we need to reverse the arc so text isn't upside down
    const isBottomHalf = midAngle > 0 && midAngle < 180;
    
    if (isBottomHalf) {
      // Reverse: draw from end to start
      const start = polarToCartesian(x, y, r, endAngle);
      const end = polarToCartesian(x, y, r, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
      return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    } else {
      // Normal direction
      const start = polarToCartesian(x, y, r, startAngle);
      const end = polarToCartesian(x, y, r, endAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
      return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
    }
  }

  function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  }

  // Macro labels
  const MACRO_LABELS: Record<string, string> = {
    protein: 'ALL PROTEIN',
    fat: 'FAT',
    carbs: 'CARBS'
  };

  // Macro legend labels (longer names for the legend below the chart)
  const MACRO_LEGEND_NAMES: Record<string, string> = {
    protein: 'All Protein',
    fat: 'Fat',
    carbs: 'Carbs'
  };

  // Food group short labels
  const GROUP_LABELS: Record<string, string> = {
    vegetable: 'VEG',
    fruit: 'FRUIT',
    grain: 'GRAIN',
    protein: 'PROTEIN RICH'
  };
</script>

<div class="pie-chart-container">
  <!-- Pattern definitions for crosshatch backgrounds -->
  <svg width="0" height="0">
    <defs>
      <!-- Outer ring macro patterns -->
      <pattern id="crosshatch-protein" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="8" height="8" fill="{MACRO_COLORS.protein}" opacity="0.15"/>
        <line x1="0" y1="0" x2="0" y2="8" stroke="{MACRO_COLORS.protein}" stroke-width="1.5" opacity="0.3"/>
      </pattern>
      <pattern id="crosshatch-fat" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="8" height="8" fill="{MACRO_COLORS.fat}" opacity="0.15"/>
        <line x1="0" y1="0" x2="0" y2="8" stroke="{MACRO_COLORS.fat}" stroke-width="1.5" opacity="0.3"/>
      </pattern>
      <pattern id="crosshatch-carbs" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="8" height="8" fill="{MACRO_COLORS.carbs}" opacity="0.15"/>
        <line x1="0" y1="0" x2="0" y2="8" stroke="{MACRO_COLORS.carbs}" stroke-width="1.5" opacity="0.3"/>
      </pattern>
      <!-- Inner pie food group patterns -->
      <pattern id="crosshatch-vegetable" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="6" fill="{GROUP_COLORS.vegetable}" opacity="0.2"/>
        <line x1="0" y1="0" x2="0" y2="6" stroke="{GROUP_COLORS.vegetable}" stroke-width="1" opacity="0.4"/>
      </pattern>
      <pattern id="crosshatch-fruit" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="6" fill="{GROUP_COLORS.fruit}" opacity="0.2"/>
        <line x1="0" y1="0" x2="0" y2="6" stroke="{GROUP_COLORS.fruit}" stroke-width="1" opacity="0.4"/>
      </pattern>
      <pattern id="crosshatch-grain" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="6" fill="{GROUP_COLORS.grain}" opacity="0.2"/>
        <line x1="0" y1="0" x2="0" y2="6" stroke="{GROUP_COLORS.grain}" stroke-width="1" opacity="0.4"/>
      </pattern>
      <pattern id="crosshatch-foodprotein" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="6" fill="{GROUP_COLORS.protein}" opacity="0.2"/>
        <line x1="0" y1="0" x2="0" y2="6" stroke="{GROUP_COLORS.protein}" stroke-width="1" opacity="0.4"/>
      </pattern>
    </defs>
  </svg>

  <svg viewBox="0 0 200 200" class="pie-chart">
    <!-- Outer ring: crosshatched target sections (always visible) -->
    {#each outerRingSections as section}
      <path
        d={describeRingArc(100, 100, 70, 95, section.startAngle, section.endAngle)}
        fill="url(#crosshatch-{section.macro})"
        class="target-slice"
      />
    {/each}

    <!-- Outer ring: solid fill for actual consumption (fills within each section) -->
    {#each outerRingSections as section}
      {#if section.fillPercent > 0}
        <path
          d={describeRingArc(100, 100, 70, 95, section.startAngle, section.fillEndAngle)}
          fill={section.color}
          class="actual-slice"
        />
      {/if}
    {/each}

    <!-- Outer ring: curved text labels -->
    <defs>
      {#each outerRingSections as section, i}
        <path
          id="outerLabelPath{i}"
          d={describeTextArc(100, 100, 82, section.startAngle + 5, section.endAngle - 5)}
          fill="none"
        />
      {/each}
    </defs>
    {#each outerRingSections as section, i}
      <text class="arc-label outer-label" fill={section.color}>
        <textPath href="#outerLabelPath{i}" startOffset="50%" text-anchor="middle">
          {MACRO_LABELS[section.macro]}
        </textPath>
      </text>
    {/each}

    <!-- Section dividers for outer ring -->
    {#each outerRingSections as section, i}
      {#if i > 0}
        {@const pos = polarToCartesian(100, 100, 95, section.startAngle)}
        {@const posInner = polarToCartesian(100, 100, 70, section.startAngle)}
        <line 
          x1={posInner.x} y1={posInner.y} 
          x2={pos.x} y2={pos.y} 
          stroke="white" 
          stroke-width="2"
        />
      {/if}
    {/each}

    <!-- Inner pie: crosshatched target sections (always visible) -->
    {#each innerSections as section}
      {@const patternId = section.group === 'protein' ? 'foodprotein' : section.group}
      <path
        d={describeArc(100, 100, 65, section.startAngle, section.endAngle)}
        fill="url(#crosshatch-{patternId})"
        class="target-slice"
      />
    {/each}

    <!-- Inner pie: solid fill for actual consumption (fills within each section) -->
    {#each innerSections as section}
      {#if section.fillPercent > 0}
        <path
          d={describeArc(100, 100, 65, section.startAngle, section.fillEndAngle)}
          fill={section.color}
          class="actual-slice"
        />
      {/if}
    {/each}

    <!-- Inner pie: curved text labels -->
    <defs>
      {#each innerSections as section, i}
        <path
          id="innerLabelPath{i}"
          d={describeTextArc(100, 100, 50, section.startAngle + 3, section.endAngle - 3)}
          fill="none"
        />
      {/each}
    </defs>
    {#each innerSections as section, i}
      <text class="arc-label inner-label" fill={section.color}>
        <textPath href="#innerLabelPath{i}" startOffset="50%" text-anchor="middle">
          {GROUP_LABELS[section.group]}
        </textPath>
      </text>
    {/each}

    <!-- Section dividers for inner pie -->
    {#each innerSections as section, i}
      {#if i > 0}
        {@const pos = polarToCartesian(100, 100, 65, section.startAngle)}
        <line 
          x1="100" y1="100" 
          x2={pos.x} y2={pos.y} 
          stroke="white" 
          stroke-width="1.5"
        />
      {/if}
    {/each}
    
    <!-- Center hole -->
    <circle cx="100" cy="100" r="30" fill="white" />
    
    <!-- Center text -->
    <text x="100" y="97" text-anchor="middle" class="cal-value">
      {Math.round(total)}
    </text>
    <text x="100" y="110" text-anchor="middle" class="cal-label">
      cal
    </text>
  </svg>

  <!-- Dual Legend -->
  <div class="legends">
    <!-- Macro legend (outer ring) -->
    <div class="legend macro-legend">
      <div class="ring-label">Outer Ring</div>
      <div class="legend-title">Macros (P/F/C)</div>
      {#each outerRingSections as section}
        <div class="legend-item">
          <span class="legend-color" style="background-color: {section.color}"></span>
          <span class="legend-name">{MACRO_LEGEND_NAMES[section.macro]}</span>
          <span class="legend-value">{Math.round(section.fillPercent)}%</span>
        </div>
      {/each}
    </div>

    <!-- Food group legend (inner pie) -->
    <div class="legend group-legend">
      <div class="ring-label">Inner Ring</div>
      <div class="legend-title">Food Groups</div>
      {#each innerSections as section}
        <div class="legend-item">
          <span class="legend-color" style="background-color: {section.color}"></span>
          <span class="legend-name">{section.group === 'protein' ? 'Protein Rich' : GROUP_NAMES[section.group]}</span>
          <span class="legend-value">{Math.round(section.fillPercent)}%</span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .pie-chart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .pie-chart {
    width: 200px;
    height: 200px;
  }

  .target-slice {
    transition: opacity 0.3s;
  }

  .actual-slice {
    transition: all 0.3s ease-out;
  }

  .slice {
    transition: opacity 0.3s;
  }

  .arc-label {
    font-weight: 600;
    letter-spacing: 0.05em;
    pointer-events: none;
  }

  .outer-label {
    font-size: 0.5rem;
  }

  .inner-label {
    font-size: 0.4rem;
  }

  .cal-value {
    font-size: 1.25rem;
    font-weight: 700;
    fill: #1f2937;
  }

  .cal-label {
    font-size: 0.6rem;
    fill: #6b7280;
  }

  .legends {
    display: flex;
    gap: 1.5rem;
    width: 100%;
    justify-content: center;
  }

  .legend {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .legend-title {
    font-size: 0.65rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.125rem;
  }

  .ring-label {
    font-size: 0.55rem;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: center;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.7rem;
  }

  .legend-color {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .legend-name {
    color: #374151;
    min-width: 3.5rem;
  }

  .legend-value {
    color: #6b7280;
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 400px) {
    .legends {
      flex-direction: column;
      gap: 0.75rem;
    }
  }
</style>
