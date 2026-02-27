<script lang="ts">
  import { fade } from 'svelte/transition';
  
  // Daily puzzle number (days since Jan 1, 2024)
  const puzzleNumber = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / 86400000);
</script>

<svelte:head>
  <title>Daily Food Games</title>
</svelte:head>

<div class="landing-container" in:fade>
  <div class="welcome-card">
    <h1>🍽️ Daily Food Games</h1>
    <p class="puzzle-info">Puzzle #{puzzleNumber}</p>
    
    <div class="intro">
      <p>Tap a game to play:</p>
      
      <ul class="game-list">
        <li><a href="/chain"><strong>🔗 Chain</strong></a> — Build a chain of 11 food words, each starting with the last letter of the previous word</li>
        <li><a href="/plate"><strong>🍽️ Plate</strong></a> — Place 11 food words on a crossword grid</li>
        <li><a href="/balanced-diet"><strong>🥗 Balance</strong></a> — Build a balanced meal by choosing foods from different groups</li>
        <li><a href="/matching"><strong>🎯 Match</strong></a> — Catch falling food words by dragging a container on the right to catch the falling word and then match the container to a meal category on the left</li>
        <li><a href="/slider"><strong>🧩 Slider</strong></a> — Slide tiles to unscramble the food image in this classic 8-puzzle game</li>
        <li><a href="/compare"><strong>👆 Compare</strong></a> — Spot the 4 subtle differences between two nearly identical food images</li>
        <li><a href="/farmers-basket"><strong>🧺 Basket</strong></a> — Help the farmer catch falling food in baskets while avoiding obstacles</li>
        <li><a href="/scrambled"><strong>🐝 Scramble Bees</strong></a> — Find all the food words hidden in a set of scrambled letters (USDA or FOODIE levels)</li>
        <li><a href="/tower"><strong>🗼 Tower</strong></a> — Climb the tower by guessing food words of decreasing length</li>
      </ul>
    </div>
    
    <p class="tip">💡 A new puzzle is available each day!</p>
  </div>
</div>

<style>
  .landing-container {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem 1rem;
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .welcome-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    text-align: center;
  }
  
  h1 {
    font-size: 1.75rem;
    margin: 0 0 0.5rem;
    background: linear-gradient(135deg, #22c55e, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .puzzle-info {
    color: #9ca3af;
    font-size: 0.9rem;
    margin: 0 0 1.5rem;
  }
  
  .intro {
    text-align: left;
    margin-bottom: 1.5rem;
  }
  
  .intro > p {
    color: #374151;
    margin: 0 0 1rem;
  }
  
  .game-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .game-list li {
    font-size: 0.9rem;
    color: #4b5563;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    line-height: 1.4;
  }
  
  .game-list a {
    text-decoration: none;
    color: inherit;
  }

  .game-list a:hover strong,
  .game-list a:active strong {
    color: #3b82f6;
  }

  .game-list strong {
    color: #1f2937;
  }

  .tip {
    color: #6b7280;
    font-size: 0.85rem;
    margin: 0;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }
</style>
