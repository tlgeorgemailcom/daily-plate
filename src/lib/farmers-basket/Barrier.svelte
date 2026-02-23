<script lang="ts">
  import type { ToolType, Position } from './types';
  import { TOOL_EMOJI } from './types';
  
  interface Props {
    id: string;
    type: ToolType;
    position: Position;
    health?: number;       // For decoys: 0-100
    depleted?: boolean;
    selected?: boolean;
    ondragbarrier?: (id: string) => void;
    ontouchdragbarrier?: (id: string) => void;  // For mobile touch drag
  }
  
  let { id, type, position, health = 100, depleted = false, selected = false, ondragbarrier, ontouchdragbarrier }: Props = $props();
  
  const emoji = $derived(TOOL_EMOJI[type]);
  const decoyScale = $derived(type === 'decoy' ? 0.5 + (health / 100) * 0.5 : 1);
  
  function handleDragStart(e: DragEvent) {
    if (depleted) {
      e.preventDefault();
      return;
    }
    e.dataTransfer!.setData('application/barrier-id', id);
    e.dataTransfer!.effectAllowed = 'move';
    ondragbarrier?.(id);
  }
  
  function handleTouchStart(e: TouchEvent) {
    if (depleted) return;
    e.preventDefault();
    e.stopPropagation();
    ontouchdragbarrier?.(id);
  }
</script>

<div 
  class="barrier {type}"
  class:depleted
  class:selected
  style="left: {position.x}px; top: {position.y}px; {type === 'decoy' ? `--decoy-scale: ${decoyScale};` : ''}"
  draggable={!depleted}
  ondragstart={handleDragStart}
  ontouchstart={handleTouchStart}
  role="img"
  aria-label="{type} barrier"
>
  {emoji}
</div>

<style>
  .barrier {
    position: absolute;
    font-size: 24px;
    transform: translate(-50%, -50%);
    z-index: 4;
    user-select: none;
    animation: place-in 0.3s ease-out;
    cursor: grab;
    touch-action: none; /* Prevent browser touch gestures */
  }
  
  .barrier:active {
    cursor: grabbing;
  }
  
  @keyframes place-in {
    0% { 
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
    }
    100% { 
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  
  .depleted {
    opacity: 0.3;
    filter: grayscale(1);
    animation: fade-out 0.5s ease-out forwards;
  }
  
  .selected {
    z-index: 10;
    filter: drop-shadow(0 0 8px #FFD700) drop-shadow(0 0 16px #FFA000);
    animation: selected-pulse 0.5s ease-in-out infinite alternate;
  }
  
  @keyframes selected-pulse {
    from { transform: translate(-50%, -50%) scale(1); }
    to { transform: translate(-50%, -50%) scale(1.15); }
  }
  
  @keyframes fade-out {
    0% { opacity: 0.3; }
    100% { opacity: 0; }
  }
  
  /* Fence wobble when hit */
  .fence {
    animation: place-in 0.3s ease-out;
  }
  
  .fence:global(.hit) {
    animation: wobble 0.3s ease-out;
  }
  
  @keyframes wobble {
    0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
    25% { transform: translate(-50%, -50%) rotate(-5deg); }
    75% { transform: translate(-50%, -50%) rotate(5deg); }
  }
  
  /* Decoy shrinking as consumed */
  .decoy {
    transform: translate(-50%, -50%) scale(var(--decoy-scale, 1));
    transition: transform 0.2s;
  }
  
  /* Lid covers basket to block all animals */
  .lid {
    animation: lid-cover 2s ease-in-out infinite;
    z-index: 10;
    font-size: 48px;
  }
  
  @keyframes lid-cover {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.9; }
  }
  
  /* Net sprawled */
  .net {
    font-size: 32px;
  }
</style>
