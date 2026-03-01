<script lang="ts">
  import { FOOD_EMOJI } from './types';
  import type { FoodType, Position } from './types';
  
  interface Props {
    type: FoodType;
    position: Position;
    remaining: number;  // quantity remaining
    onclick?: () => void;
  }
  
  let { type, position, remaining, onclick }: Props = $props();
  
  const emoji = $derived(FOOD_EMOJI[type]);
  const available = $derived(remaining > 0);
</script>

<button 
  class="food-source"
  class:available
  class:depleted={!available}
  style="left: {position.x}px; top: {position.y}px;"
  disabled={!available}
  onclick={onclick}
>
  <span class="food-emoji">{emoji}</span>
  <span class="quantity" class:empty={remaining === 0}>{remaining}</span>
  {#if available}
    <span class="glow"></span>
  {/if}
</button>

<style>
  .food-source {
    position: absolute;
    font-size: 40px;
    transform: translate(-50%, -50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 10px;
    border-radius: 50%;
    transition: transform 0.2s, filter 0.2s;
    z-index: 3;
  }
  
  .food-source:focus {
    outline: 2px solid #4CAF50;
    outline-offset: 2px;
  }
  
  .available {
    animation: pulse 2s ease-in-out infinite;
  }
  
  .available:hover {
    transform: translate(-50%, -50%) scale(1.2);
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.05); }
  }
  
  .depleted {
    filter: grayscale(0.7);
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .food-emoji {
    display: block;
    position: relative;
    z-index: 2;
  }
  
  .quantity {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #4CAF50;
    color: white;
    font-size: 12px;
    font-weight: bold;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    font-family: system-ui, sans-serif;
  }
  
  .quantity.empty {
    background: #9E9E9E;
  }
  
  .glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(255,235,59,0.4) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 1;
    animation: glow-pulse 1.5s ease-in-out infinite;
  }
  
  @keyframes glow-pulse {
    0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
  }
</style>
