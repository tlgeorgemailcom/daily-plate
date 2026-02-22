<script lang="ts">
  import type { FarmerState, Position } from './types';
  
  interface Props {
    state: FarmerState;
    position: Position;
    carrying: string | null; // food emoji
    direction: 'up' | 'down' | 'left' | 'right';
  }
  
  let { state, position, carrying, direction }: Props = $props();
  
  const facingClass = $derived(
    direction === 'left' ? 'facing-left' : 
    direction === 'right' ? 'facing-right' : ''
  );
</script>

<div 
  class="farmer {state} {facingClass}"
  style="left: {position.x}px; top: {position.y}px;"
>
  <span class="emoji">🧑‍🌾</span>
  {#if carrying}
    <span class="carrying">{carrying}</span>
  {/if}
</div>

<style>
  .farmer {
    position: absolute;
    font-size: 36px;
    transform: translate(-50%, -50%);
    z-index: 20;
    user-select: none;
    cursor: grab;
  }
  
  .farmer:active {
    cursor: grabbing;
  }
  
  .emoji {
    display: block;
  }
  
  /* Direction */
  .facing-left .emoji {
    transform: scaleX(-1);
  }
  
  /* Walking */
  .walking {
    animation: walk 0.3s ease-in-out infinite;
  }
  
  @keyframes walk {
    0%, 100% { transform: translate(-50%, -50%) translateY(0); }
    50% { transform: translate(-50%, -50%) translateY(-4px); }
  }
  
  /* Picking up food */
  .picking {
    animation: bend 0.3s ease-out;
  }
  
  @keyframes bend {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    50% { transform: translate(-50%, -50%) rotate(15deg) translateY(5px); }
    100% { transform: translate(-50%, -50%) rotate(0deg); }
  }
  
  /* Placing tool */
  .placing {
    animation: place 0.3s ease-out;
  }
  
  @keyframes place {
    0% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.1); }
    100% { transform: translate(-50%, -50%) scale(1); }
  }
  
  /* Dropping food in basket */
  .dropping {
    animation: drop 0.2s ease-out;
  }
  
  @keyframes drop {
    0% { transform: translate(-50%, -50%) translateY(0); }
    100% { transform: translate(-50%, -50%) translateY(5px); }
  }
  
  /* Recovering stolen food */
  .recovering {
    animation: chase 0.2s ease-in-out infinite;
  }
  
  @keyframes chase {
    0%, 100% { transform: translate(-50%, -50%) translateX(0); }
    50% { transform: translate(-50%, -50%) translateX(5px); }
  }
  
  /* Food being carried */
  .carrying {
    position: absolute;
    font-size: 20px;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    animation: bounce 0.3s ease-in-out infinite;
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-3px); }
  }
</style>
