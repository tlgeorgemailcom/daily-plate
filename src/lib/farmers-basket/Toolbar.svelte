<script lang="ts">
  import { TOOL_EMOJI } from './types';
  import type { ToolType } from './types';
  
  interface ToolSlot {
    type: ToolType;
    remaining: number | null; // null = unlimited
    unlocked: boolean;
  }
  
  interface Props {
    tools: ToolSlot[];
    selectedTool: ToolType | null;
    onselect: (tool: ToolType | null) => void;
  }
  
  let { tools, selectedTool, onselect }: Props = $props();
  
  function handleClick(tool: ToolSlot) {
    if (!tool.unlocked) return;
    if (tool.remaining === 0) return;
    
    if (selectedTool === tool.type) {
      onselect(null); // deselect
    } else {
      onselect(tool.type);
    }
  }
</script>

<div class="toolbar">
  {#each tools as tool}
    <button
      class="tool-slot"
      class:selected={selectedTool === tool.type}
      class:locked={!tool.unlocked}
      class:empty={tool.remaining === 0}
      onclick={() => handleClick(tool)}
      disabled={!tool.unlocked || tool.remaining === 0}
      title={tool.type}
    >
      <span class="tool-emoji">{TOOL_EMOJI[tool.type]}</span>
      {#if tool.remaining !== null}
        <span class="count">{tool.remaining}</span>
      {:else}
        <span class="count infinite">∞</span>
      {/if}
      {#if !tool.unlocked}
        <span class="lock">🔒</span>
      {/if}
    </button>
  {/each}
</div>

<style>
  .toolbar {
    display: flex;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(139, 69, 19, 0.9);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  
  .tool-slot {
    position: relative;
    width: 50px;
    height: 50px;
    background: #F5DEB3;
    border: 2px solid #8B4513;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  }
  
  .tool-slot:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }
  
  .tool-slot:focus {
    outline: 2px solid #FFEB3B;
    outline-offset: 2px;
  }
  
  .selected {
    background: #FFF8DC;
    border-color: #FFD700;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
    transform: scale(1.1);
  }
  
  .locked {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .empty {
    filter: grayscale(0.7);
    opacity: 0.4;
    cursor: not-allowed;
  }
  
  .tool-emoji {
    font-size: 28px;
  }
  
  .count {
    position: absolute;
    bottom: 2px;
    right: 2px;
    font-size: 10px;
    font-weight: bold;
    color: #5D4037;
    background: rgba(255,255,255,0.8);
    border-radius: 4px;
    padding: 0 3px;
    min-width: 14px;
    text-align: center;
  }
  
  .count.infinite {
    color: #4CAF50;
  }
  
  .lock {
    position: absolute;
    top: 2px;
    right: 2px;
    font-size: 12px;
  }
</style>
