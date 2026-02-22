<script lang="ts">
  import type { Animal } from './types';
  import { ANIMAL_EMOJI, FOOD_EMOJI } from './types';
  
  interface Props {
    animal: Animal;
  }
  
  let { animal }: Props = $props();
  
  const emoji = $derived(ANIMAL_EMOJI[animal.type]);
  const facingClass = $derived(animal.direction === 'left' ? 'facing-left' : 'facing-right');
  const stolenEmoji = $derived(animal.stolenFood ? FOOD_EMOJI[animal.stolenFood] : null);
</script>

<span 
  class="animal {animal.state} {facingClass}"
  style="left: {animal.position.x}px; top: {animal.position.y}px;"
>
  {emoji}
  {#if (animal.state === 'stealing' || animal.state === 'celebrating') && stolenEmoji}
    <span class="stolen-food">{stolenEmoji}</span>
  {/if}
  {#if animal.state === 'digging' || animal.state === 'climbing' || animal.state === 'squeezing'}
    <span class="progress-bar">
      <span class="progress-fill" style="width: {animal.escapeProgress}%"></span>
    </span>
  {/if}
</span>

<style>
  .animal {
    position: absolute;
    font-size: 32px;
    transform: translate(-50%, -50%);
    transition: left 0.1s linear, top 0.1s linear;
    z-index: 10;
    user-select: none;
    cursor: default;
  }
  
  /* Direction */
  .facing-left {
    transform: translate(-50%, -50%) scaleX(-1);
  }
  
  /* Approaching - hopping */
  .approaching {
    animation: hop 0.4s ease-in-out infinite;
  }
  
  @keyframes hop {
    0%, 100% { transform: translate(-50%, -50%) translateY(0); }
    50% { transform: translate(-50%, -50%) translateY(-8px); }
  }
  
  .approaching.facing-left {
    animation: hop-left 0.4s ease-in-out infinite;
  }
  
  @keyframes hop-left {
    0%, 100% { transform: translate(-50%, -50%) scaleX(-1) translateY(0); }
    50% { transform: translate(-50%, -50%) scaleX(-1) translateY(-8px); }
  }
  
  /* Blocked - bump */
  .blocked {
    animation: bump 0.2s ease-out;
  }
  
  @keyframes bump {
    0% { transform: translate(-50%, -50%) translateX(0); }
    50% { transform: translate(-50%, -50%) translateX(5px); }
    100% { transform: translate(-50%, -50%) translateX(0); }
  }
  
  /* Rerouting - turn */
  .rerouting {
    animation: turn 0.3s ease-out;
  }
  
  @keyframes turn {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(45deg); }
  }
  
  /* Digging (rabbit) */
  .digging {
    animation: dig 0.5s ease-in-out infinite;
  }
  
  @keyframes dig {
    0%, 100% { transform: translate(-50%, -50%) translateY(0) rotate(-10deg); }
    50% { transform: translate(-50%, -50%) translateY(5px) rotate(10deg); }
  }
  
  /* Climbing (squirrel) */
  .climbing {
    animation: climb 0.3s ease-in-out infinite;
  }
  
  @keyframes climb {
    0%, 100% { transform: translate(-50%, -50%) translateY(0) translateX(0); }
    50% { transform: translate(-50%, -50%) translateY(-5px) translateX(3px); }
  }
  
  /* Squeezing (mouse) */
  .squeezing {
    animation: squeeze 0.2s ease-in-out infinite;
  }
  
  @keyframes squeeze {
    0%, 100% { transform: translate(-50%, -50%) scaleX(1) scaleY(1); }
    50% { transform: translate(-50%, -50%) scaleX(0.7) scaleY(1.3); }
  }
  
  /* Sniffing at basket */
  .sniffing {
    animation: sniff 0.3s ease-in-out infinite;
  }
  
  @keyframes sniff {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.1); }
  }
  
  /* Stealing - grab and run */
  .stealing {
    animation: grab 0.3s ease-out forwards;
  }
  
  @keyframes grab {
    0% { transform: translate(-50%, -50%) scale(1); }
    100% { transform: translate(-50%, -50%) scale(1.3); }
  }
  
  /* Celebrating - victory dance with stolen food */
  .celebrating {
    animation: victory-dance 0.4s ease-in-out infinite;
    z-index: 100;
  }
  
  @keyframes victory-dance {
    0%, 100% { transform: translate(-50%, -50%) scale(1.3) rotate(-10deg) translateY(0); }
    25% { transform: translate(-50%, -50%) scale(1.4) rotate(10deg) translateY(-15px); }
    50% { transform: translate(-50%, -50%) scale(1.3) rotate(-10deg) translateY(0); }
    75% { transform: translate(-50%, -50%) scale(1.4) rotate(10deg) translateY(-15px); }
  }
  
  /* Stolen food display */
  .stolen-food {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    animation: bounce-food 0.3s ease-in-out infinite;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  }
  
  @keyframes bounce-food {
    0%, 100% { transform: translateX(-50%) translateY(0) rotate(-5deg); }
    50% { transform: translateX(-50%) translateY(-8px) rotate(5deg); }
  }
  
  /* Distracted by decoy */
  .distracted {
    animation: munch 0.4s ease-in-out infinite;
  }
  
  @keyframes munch {
    0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
    25% { transform: translate(-50%, -50%) rotate(-5deg); }
    75% { transform: translate(-50%, -50%) rotate(5deg); }
  }
  
  /* Avoiding (lid active) */
  .avoiding {
    animation: shake 0.3s ease-in-out infinite;
    opacity: 0.7;
  }
  
  @keyframes shake {
    0%, 100% { transform: translate(-50%, -50%) translateX(0); }
    25% { transform: translate(-50%, -50%) translateX(-3px); }
    75% { transform: translate(-50%, -50%) translateX(3px); }
  }
  
  /* Flying (bird) */
  .flying {
    animation: fly 0.3s ease-in-out infinite;
  }
  
  @keyframes fly {
    0%, 100% { transform: translate(-50%, -50%) translateY(0) rotate(-5deg); }
    50% { transform: translate(-50%, -50%) translateY(-10px) rotate(5deg); }
  }
  
  /* Progress bar for escape */
  .progress-bar {
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 4px;
    background: rgba(0,0,0,0.3);
    border-radius: 2px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: #4CAF50;
    transition: width 0.1s linear;
  }
</style>
