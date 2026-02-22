<script lang="ts">
  import type { ToolType, Position } from './types';
  import { TOOL_EMOJI } from './types';
  
  interface Props {
    type: ToolType;
    position: Position;
    depleted?: boolean;
  }
  
  let { type, position, depleted = false }: Props = $props();
  
  const emoji = $derived(TOOL_EMOJI[type]);
</script>

<div 
  class="barrier {type}"
  class:depleted
  style="left: {position.x}px; top: {position.y}px;"
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
    transition: transform 0.2s;
  }
  
  /* Umbrella spinning */
  .umbrella {
    animation: spin-slow 3s linear infinite;
  }
  
  @keyframes spin-slow {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
  
  /* Net sprawled */
  .net {
    font-size: 32px;
  }
</style>
