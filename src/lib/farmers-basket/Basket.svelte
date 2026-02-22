<script lang="ts">
  import { FOOD_EMOJI } from './types';
  import type { FoodType } from './types';
  
  interface Props {
    contents: FoodType[];
  }
  
  let { contents }: Props = $props();
</script>

<div class="basket-container">
  <div class="basket">🧺</div>
  
  <div class="contents">
    {#each contents as food, i}
      <span 
        class="basket-food" 
        style="animation-delay: {i * 0.1}s;"
      >
        {FOOD_EMOJI[food]}
      </span>
    {/each}
  </div>
</div>

<style>
  .basket-container {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 5;
  }
  
  .basket {
    font-size: 48px;
    animation: sway 2s ease-in-out infinite;
  }
  
  @keyframes sway {
    0%, 100% { transform: rotate(-2deg); }
    50% { transform: rotate(2deg); }
  }
  
  .contents {
    position: absolute;
    top: 10px;
    display: flex;
    gap: 2px;
    justify-content: center;
    pointer-events: none;
  }
  
  .basket-food {
    font-size: 16px;
    animation: drop-in 0.3s ease-out forwards;
  }
  
  @keyframes drop-in {
    0% { 
      opacity: 0; 
      transform: translateY(-20px); 
    }
    100% { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
</style>
