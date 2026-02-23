<script lang="ts">
  import type { Level, FoodType } from './types';
  import { FOOD_EMOJI } from './types';
  
  // All available categories (shown even if empty)
  const ALL_CATEGORIES = [
    'Breakfast',
    'Snacks',
    'Lunch',
    'Dinner',
    'Beverages',
    'Salads',
    'Sides'
  ];
  
  // Recipe of the Day ID (Simple Salad for now)
  const RECIPE_OF_THE_DAY_ID = '1-1';
  
  interface Props {
    levels: Level[];
    completedLevels: Set<string>;
    currentLevelId: string | null;
    onselect: (levelId: string) => void;
    onclose: () => void;
  }
  
  let { levels, completedLevels, currentLevelId, onselect, onclose }: Props = $props();
  
  // View states: 'recipe-of-day' | 'index' | 'detail'
  let showRecipeOfDay = $state(true);
  
  // Which level is expanded (null = show index view)
  let selectedLevel = $state<Level | null>(null);
  
  // Recipe of the Day
  let recipeOfTheDay = $derived(levels.find(l => l.id === RECIPE_OF_THE_DAY_ID) || levels[0]);
  
  // Search/filter
  let searchQuery = $state('');
  
  // Collapsed categories (set of category names that are collapsed)
  let collapsedCategories = $state<Set<string>>(new Set());
  
  // Group levels by category
  let categoryGroups = $derived(() => {
    const groups = new Map<string, Level[]>();
    // Initialize all categories (even empty ones)
    for (const cat of ALL_CATEGORIES) {
      groups.set(cat, []);
    }
    // Fill with actual levels
    for (const level of levels) {
      const categoryLevels = groups.get(level.category) || [];
      categoryLevels.push(level);
      groups.set(level.category, categoryLevels);
    }
    return groups;
  });
  
  // Use predefined category order
  let categories = ALL_CATEGORIES;
  
  // Category completion stats
  let categoryStats = $derived(() => {
    const stats = new Map<string, { completed: number; total: number }>();
    for (const category of ALL_CATEGORIES) {
      const categoryLevels = categoryGroups().get(category) || [];
      const completed = categoryLevels.filter(l => completedLevels.has(l.id)).length;
      stats.set(category, { completed, total: categoryLevels.length });
    }
    return stats;
  });
  
  // Filtered levels based on search (searches all categories)
  let isSearching = $derived(searchQuery.trim().length > 0);
  let searchResults = $derived(
    isSearching
      ? levels.filter(l => 
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : []
  );
  
  // Reference to scroll container
  let scrollContainer: HTMLDivElement;
  
  function toggleCategory(category: string) {
    const newSet = new Set(collapsedCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    collapsedCategories = newSet;
  }
  
  function scrollToCategory(category: string) {
    // Expand if collapsed
    if (collapsedCategories.has(category)) {
      toggleCategory(category);
    }
    // Scroll to category section
    setTimeout(() => {
      const section = document.getElementById(`category-${category.replace(/\s+/g, '-')}`);
      if (section && scrollContainer) {
        scrollContainer.scrollTo({
          top: section.offsetTop - scrollContainer.offsetTop,
          behavior: 'smooth'
        });
      }
    }, 50);
  }
  
  function handleSelect(level: Level) {
    selectedLevel = level;
    showRecipeOfDay = false;
    searchQuery = ''; // Clear search when viewing detail
  }
  
  function handlePlay(levelId: string) {
    onselect(levelId);
    onclose();
  }
  
  function handleBack() {
    selectedLevel = null;
  }
  
  function handleClose() {
    // From detail view, go back to index first
    if (selectedLevel) {
      selectedLevel = null;
      return;
    }
    // From index view, close the modal
    onclose();
  }
  
  function handleBrowseAll() {
    showRecipeOfDay = false;
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if (selectedLevel) {
        selectedLevel = null;
      } else if (!showRecipeOfDay) {
        onclose();
      } else {
        showRecipeOfDay = false;
      }
    }
  }
  
  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      if (selectedLevel) {
        selectedLevel = null;
      } else {
        onclose();
      }
    }
  }
  
  // Find which category the current level is in
  let currentCategory = $derived(
    currentLevelId 
      ? levels.find(l => l.id === currentLevelId)?.category ?? '' 
      : ''
  );
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="modal-backdrop" onclick={handleBackdropClick} role="dialog" aria-modal="true" aria-label="Recipe Book">
  <div class="recipe-book" class:detail-view={selectedLevel}>
    <header class="book-header">
      {#if selectedLevel}
        <button class="back-btn" onclick={handleBack} aria-label="Back to index">
          ← Back
        </button>
      {:else}
        <h2>📖 Recipe Book</h2>
      {/if}
      <span class="level-count">{completedLevels.size}/{levels.length} ✓</span>
      <button class="close-btn" onclick={handleClose} aria-label="Close">×</button>
    </header>
    
    {#if showRecipeOfDay && !selectedLevel && recipeOfTheDay && completedLevels.size === 0}
      <!-- RECIPE OF THE DAY VIEW (only for new players) -->
      <div class="recipe-of-day">
        <div class="cotd-badge">🌟 Recipe of the Day</div>
        
        <div class="cotd-card">
          <h3 class="cotd-name">{recipeOfTheDay.name}</h3>
          <span class="cotd-category">{recipeOfTheDay.category}</span>
          
          <div class="cotd-ingredients">
            {#each recipeOfTheDay.recipe as food}
              <span class="cotd-ingredient" title={food}>{FOOD_EMOJI[food]}</span>
            {/each}
          </div>
          
          <div class="cotd-actions">
            <button 
              class="cotd-play-btn"
              onclick={() => handleSelect(recipeOfTheDay)}
            >
              ▶ Make This Recipe
            </button>
            <button 
              class="cotd-browse-btn"
              onclick={handleBrowseAll}
            >
              Browse All Recipes
            </button>
          </div>
        </div>
      </div>
    {:else if selectedLevel}
      <!-- DETAIL VIEW: Full recipe card -->
      {@const isCompleted = completedLevels.has(selectedLevel.id)}
      {@const isCurrent = selectedLevel.id === currentLevelId}
      <div class="detail-card">
        {#if isCurrent}
          <div class="current-badge">Now Playing</div>
        {/if}
        
        <div class="recipe-header">
          <span class="recipe-number">#{selectedLevel.levelNum}</span>
          <h3 class="recipe-name">{selectedLevel.name}</h3>
          <span class="recipe-category">{selectedLevel.category}</span>
        </div>
        
        <div class="ingredients">
          <span class="ingredients-label">Ingredients:</span>
          <div class="ingredient-icons">
            {#each selectedLevel.recipe as food}
              <span class="ingredient" title={food}>{FOOD_EMOJI[food]}</span>
            {/each}
          </div>
        </div>
        
        {#if isCompleted && selectedLevel.recipeInstructions}
          <div class="recipe-details">
            <div class="recipe-meta">
              {#if selectedLevel.prepTime}<span>⏱️ {selectedLevel.prepTime}</span>{/if}
              {#if selectedLevel.servings}<span>🍽️ {selectedLevel.servings}</span>{/if}
            </div>
            <div class="instructions">
              <span class="instructions-label">How to make:</span>
              <ol>
                {#each selectedLevel.recipeInstructions as step}
                  <li>{step}</li>
                {/each}
              </ol>
            </div>
          </div>
        {:else}
          <div class="locked-message">
            <span class="lock-icon">🔒</span>
            <span>Complete this recipe to unlock the instructions!</span>
          </div>
        {/if}
        
        <button class="play-btn" onclick={() => handlePlay(selectedLevel!.id)}>
          {isCurrent ? '🔄 Replay' : isCompleted ? '🎮 Replay' : '▶️ Play'}
        </button>
      </div>
    {:else}
      <!-- INDEX VIEW: Category tabs + recipes -->
      <div class="index-layout">
        <!-- Side tabs for categories (like rolodex dividers) -->
        <div class="category-tabs">
          {#each categories as category (category)}
            {@const stats = categoryStats().get(category)}
            {@const isCurrentCategory = category === currentCategory}
            {@const isEmpty = stats?.total === 0}
            <button 
              class="category-tab"
              class:current={isCurrentCategory}
              class:complete={stats && stats.total > 0 && stats.completed === stats.total}
              class:empty={isEmpty}
              onclick={() => scrollToCategory(category)}
              title="{category}: {isEmpty ? 'Coming soon' : `${stats?.completed}/${stats?.total} completed`}"
            >
              <span class="category-name">{category}</span>
              {#if isEmpty}
                <span class="category-progress empty">—</span>
              {:else if stats && stats.completed === stats.total}
                <span class="category-check">✓</span>
              {:else if stats}
                <span class="category-progress">{stats.completed}/{stats.total}</span>
              {/if}
            </button>
          {/each}
        </div>
        
        <div class="main-content">
          <!-- Search bar -->
          <div class="search-bar">
            <input 
              type="text" 
              placeholder="🔍 Search recipes..." 
              bind:value={searchQuery}
              class="search-input"
            />
          </div>
          
          <div class="rolodex-index" bind:this={scrollContainer}>
            {#if isSearching}
              <!-- Search results -->
              <div class="search-results-header">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
              </div>
              {#each searchResults as level (level.id)}
                {@const isCompleted = completedLevels.has(level.id)}
                {@const isCurrent = level.id === currentLevelId}
                <button 
                  class="recipe-tab"
                  class:completed={isCompleted}
                  class:current={isCurrent}
                  onclick={() => handleSelect(level)}
                >
                  <span class="tab-number">#{level.levelNum}</span>
                  <span class="tab-name">{level.name}</span>
                  <span class="tab-status">
                    {#if isCurrent}🎮{:else if isCompleted}✓{:else}🔒{/if}
                  </span>
                </button>
              {/each}
              {#if searchResults.length === 0}
                <div class="no-results">No recipes found</div>
              {/if}
            {:else}
              <!-- Category sections -->
              {#each categories as category (category)}
                {@const categoryLevels = categoryGroups().get(category) || []}
                {@const stats = categoryStats().get(category)}
                {@const isCollapsed = collapsedCategories.has(category)}
                {@const isEmpty = categoryLevels.length === 0}
                <div class="category-section" id="category-{category.replace(/\s+/g, '-')}">
                  <button class="category-header" class:empty={isEmpty} onclick={() => toggleCategory(category)}>
                    <span class="category-title">
                      <span class="expand-icon">{isCollapsed ? '▶' : '▼'}</span>
                      {category}
                    </span>
                    <div class="category-stats">
                      {#if isEmpty}
                        <span class="stat-text empty">Coming soon</span>
                      {:else}
                        <span class="stat-text">{stats?.completed}/{stats?.total}</span>
                        <div class="progress-bar">
                          <div 
                            class="progress-fill" 
                            style="width: {stats && stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%"
                          ></div>
                        </div>
                      {/if}
                    </div>
                  </button>
                  
                  {#if !isCollapsed}
                    <div class="category-recipes">
                      {#if isEmpty}
                        <div class="empty-category">No recipes yet - check back soon!</div>
                      {:else}
                        {#each categoryLevels as level (level.id)}
                          {@const isCompleted = completedLevels.has(level.id)}
                          {@const isCurrent = level.id === currentLevelId}
                          <button 
                            class="recipe-tab"
                            class:completed={isCompleted}
                            class:current={isCurrent}
                            onclick={() => handleSelect(level)}
                          >
                            <span class="tab-number">#{level.levelNum}</span>
                            <span class="tab-name">{level.name}</span>
                            <span class="tab-status">
                              {#if isCurrent}🎮{:else if isCompleted}✓{:else}🔒{/if}
                            </span>
                            <span class="tab-ingredients">
                              {#each level.recipe.slice(0, 3) as food}
                                <span class="mini-emoji">{FOOD_EMOJI[food]}</span>
                              {/each}
                              {#if level.recipe.length > 3}
                                <span class="more">+{level.recipe.length - 3}</span>
                              {/if}
                          </span>
                        </button>
                      {/each}
                      {/if}
                    </div>
                  {/if}
                </div>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }
  
  .recipe-book {
    background: linear-gradient(135deg, #FDF5E6 0%, #F5DEB3 100%);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    max-width: 520px;
    max-height: 85vh;
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 4px solid #8B4513;
  }
  
  .recipe-book.detail-view {
    max-width: 480px;
  }
  
  .book-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background: #8B4513;
    color: white;
    gap: 12px;
  }
  
  .book-header h2 {
    margin: 0;
    font-size: 1.2rem;
    flex: 1;
  }
  
  .back-btn {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: bold;
  }
  
  .back-btn:hover {
    background: rgba(255,255,255,0.3);
  }
  
  .level-count {
    font-size: 0.85rem;
    opacity: 0.9;
    background: rgba(255,255,255,0.15);
    padding: 4px 10px;
    border-radius: 12px;
  }
  
  .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.6rem;
    cursor: pointer;
    line-height: 1;
    padding: 0 4px;
  }
  
  .close-btn:hover {
    opacity: 0.8;
  }
  
  /* INDEX LAYOUT: Side tabs + main content */
  .index-layout {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  
  /* Category tabs (side rolodex dividers) */
  .category-tabs {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 0 8px 4px;
    background: #D2B48C;
    overflow-y: auto;
    min-width: 120px;
    max-width: 140px;
  }
  
  .category-tab {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 8px 10px;
    background: #FDF5E6;
    border: none;
    border-radius: 6px 0 0 6px;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: bold;
    color: #8B4513;
    text-align: left;
    transition: all 0.15s;
    gap: 2px;
  }
  
  .category-tab:hover {
    background: #FFF8E7;
    transform: translateX(-2px);
  }
  
  .category-tab.current {
    background: #FF9800;
    color: white;
  }
  
  .category-tab.complete {
    background: #C8E6C9;
    color: #2E7D32;
  }
  
  .category-tab.empty {
    background: #f0f0f0;
    color: #999;
  }
  
  .category-tab.empty:hover {
    background: #e8e8e8;
  }
  
  .category-name {
    font-size: 0.8rem;
    line-height: 1.2;
  }
  
  .category-check {
    font-size: 0.7rem;
  }
  
  .category-progress {
    font-size: 0.65rem;
    opacity: 0.8;
  }
  
  .category-progress.empty {
    opacity: 0.5;
  }
  
  .empty-category {
    padding: 12px;
    text-align: center;
    color: #999;
    font-style: italic;
    font-size: 0.85rem;
  }
  
  .category-header.empty {
    opacity: 0.7;
  }
  
  .stat-text.empty {
    font-style: italic;
    opacity: 0.7;
  }
  
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  /* Search bar */
  .search-bar {
    padding: 10px 12px 6px;
  }
  
  .search-input {
    width: 100%;
    padding: 8px 12px;
    border: 2px solid #DEB887;
    border-radius: 8px;
    font-size: 0.95rem;
    background: white;
    box-sizing: border-box;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #8B4513;
  }
  
  .search-results-header {
    padding: 8px 12px;
    font-size: 0.85rem;
    color: #666;
    background: #FFF8E7;
    border-radius: 6px;
    margin-bottom: 6px;
  }
  
  /* INDEX VIEW: Rolodex content */
  .rolodex-index {
    flex: 1;
    overflow-y: auto;
    padding: 6px 12px 12px;
  }
  
  /* Category sections */
  .category-section {
    margin-bottom: 8px;
  }
  
  .category-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 8px 12px;
    background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    color: white;
    font-size: 0.9rem;
    font-weight: bold;
  }
  
  .category-header:hover {
    filter: brightness(1.1);
  }
  
  .category-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .expand-icon {
    font-size: 0.7rem;
    width: 12px;
  }
  
  .category-stats {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .stat-text {
    font-size: 0.75rem;
    opacity: 0.9;
  }
  
  .progress-bar {
    width: 50px;
    height: 6px;
    background: rgba(255,255,255,0.3);
    border-radius: 3px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: #4CAF50;
    border-radius: 3px;
    transition: width 0.3s;
  }
  
  .category-recipes {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 6px 0 0 0;
  }
  
  .recipe-tab {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    background: white;
    border: 2px solid #DEB887;
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
  }
  
  .recipe-tab:hover {
    border-color: #8B4513;
    background: #FFF8E7;
  }
  
  .recipe-tab.completed {
    background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
    border-color: #81C784;
  }
  
  .recipe-tab.completed:hover {
    border-color: #4CAF50;
  }
  
  .recipe-tab.current {
    border-color: #FF9800;
    border-width: 3px;
    background: #FFF3E0;
  }
  
  .tab-number {
    font-size: 0.7rem;
    font-weight: bold;
    color: white;
    background: #8B4513;
    padding: 2px 6px;
    border-radius: 4px;
    min-width: 36px;
    text-align: center;
  }
  
  .recipe-tab.completed .tab-number {
    background: #4CAF50;
  }
  
  .tab-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: #5D4037;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .tab-status {
    font-size: 0.9rem;
    min-width: 20px;
    text-align: center;
  }
  
  .recipe-tab.completed .tab-status {
    color: #4CAF50;
    font-weight: bold;
  }
  
  .tab-ingredients {
    display: flex;
    gap: 1px;
  }
  
  .mini-emoji {
    font-size: 0.8rem;
  }
  
  .more {
    font-size: 0.65rem;
    color: #999;
    margin-left: 2px;
  }
  
  .no-results {
    text-align: center;
    padding: 30px;
    color: #999;
    font-style: italic;
  }
  
  /* DETAIL VIEW: Recipe card */
  .detail-card {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
  }
  
  .current-badge {
    position: absolute;
    top: 8px;
    right: 20px;
    background: #FF9800;
    color: white;
    padding: 4px 12px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: bold;
  }
  
  .recipe-header {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  
  .recipe-number {
    background: #8B4513;
    color: white;
    padding: 5px 12px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: bold;
  }
  
  .recipe-name {
    margin: 0;
    font-size: 1.4rem;
    color: #5D4037;
    flex: 1;
  }
  
  .recipe-category {
    font-size: 0.8rem;
    color: #888;
    background: #f5f5f5;
    padding: 4px 10px;
    border-radius: 12px;
  }
  
  .ingredients {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px;
    background: white;
    border-radius: 12px;
    border: 2px solid #DEB887;
  }
  
  .ingredients-label {
    font-size: 0.85rem;
    color: #888;
    font-weight: bold;
  }
  
  .ingredient-icons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  .ingredient {
    font-size: 2rem;
    background: #FFF9C4;
    padding: 8px 12px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .recipe-details {
    background: white;
    border-radius: 12px;
    border: 2px solid #81C784;
    padding: 14px;
  }
  
  .recipe-meta {
    display: flex;
    gap: 16px;
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 12px;
  }
  
  .instructions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .instructions-label {
    font-size: 0.85rem;
    color: #4CAF50;
    font-weight: bold;
  }
  
  .instructions ol {
    margin: 0;
    padding-left: 22px;
    font-size: 0.9rem;
    color: #555;
    line-height: 1.5;
  }
  
  .instructions li {
    margin-bottom: 6px;
  }
  
  .locked-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #999;
    font-size: 1rem;
    padding: 30px 20px;
    background: #f5f5f5;
    border-radius: 12px;
    border: 2px dashed #ddd;
  }
  
  .lock-icon {
    font-size: 2rem;
  }
  
  .play-btn {
    margin-top: auto;
    padding: 14px 24px;
    font-size: 1.1rem;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
    color: white;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
  
  .play-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.25);
  }
  
  .play-btn:active {
    transform: translateY(0);
  }
  
  /* RECIPE OF THE DAY */
  .recipe-of-day {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px;
    background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%);
    text-align: center;
    gap: 20px;
  }
  
  .cotd-badge {
    font-size: 1.4rem;
    font-weight: bold;
    color: #D84315;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
  
  .cotd-card {
    background: white;
    border-radius: 16px;
    padding: 24px 32px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    max-width: 320px;
    border: 3px solid #FFB74D;
  }
  
  .cotd-name {
    margin: 0;
    font-size: 1.6rem;
    color: #5D4037;
    font-weight: bold;
  }
  
  .cotd-category {
    font-size: 0.9rem;
    color: #8D6E63;
    font-style: italic;
  }
  
  .cotd-ingredients {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    padding: 12px 0;
  }
  
  .cotd-ingredient {
    font-size: 2rem;
    background: #FFF3E0;
    padding: 8px 12px;
    border-radius: 12px;
    border: 2px solid #FFE0B2;
    transition: transform 0.2s;
  }
  
  .cotd-ingredient:hover {
    transform: scale(1.15);
  }
  
  .cotd-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    margin-top: 8px;
  }
  
  .cotd-play-btn {
    padding: 14px 28px;
    font-size: 1.1rem;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #FF7043 0%, #F4511E 100%);
    color: white;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 12px rgba(244, 81, 30, 0.4);
  }
  
  .cotd-play-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(244, 81, 30, 0.5);
  }
  
  .cotd-browse-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
    font-weight: 600;
    border: 2px solid #8D6E63;
    border-radius: 10px;
    background: transparent;
    color: #8D6E63;
    cursor: pointer;
    transition: all 0.15s;
  }
  
  .cotd-browse-btn:hover {
    background: #8D6E63;
    color: white;
  }
  
  @media (max-width: 480px) {
    .recipe-book {
      max-height: 90vh;
      margin: 10px;
    }
    
    .category-tabs {
      min-width: 80px;
      max-width: 100px;
      padding: 6px 0 6px 2px;
    }
    
    .category-tab {
      padding: 6px 6px;
    }
    
    .category-name {
      font-size: 0.7rem;
    }
    
    .recipe-tab {
      padding: 6px 8px;
      gap: 6px;
    }
    
    .tab-name {
      font-size: 0.8rem;
    }
    
    .mini-emoji {
      font-size: 0.7rem;
    }
    
    .recipe-name {
      font-size: 1.2rem;
    }
    
    .ingredient {
      font-size: 1.6rem;
      padding: 6px 10px;
    }
  }
</style>
