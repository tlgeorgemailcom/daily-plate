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
    ontouchdragstart?: (tool: ToolType) => void;  // For mobile touch drag
  }
  
  let { tools, selectedTool, onselect, ontouchdragstart }: Props = $props();
  
  function handleClick(tool: ToolSlot) {
    if (!tool.unlocked) return;
    if (tool.remaining === null || tool.remaining === 0) return;
    
    if (selectedTool === tool.type) {
      onselect(null); // deselect
    } else {
      onselect(tool.type);
    }
  }
  
  // Check if tool is available (has count > 0)
  function isAvailable(tool: ToolSlot): boolean {
    return tool.unlocked && tool.remaining !== null && tool.remaining > 0;
  }
  
  // Handle drag start - set tool type as transfer data
  function handleDragStart(e: DragEvent, tool: ToolSlot) {
    if (!isAvailable(tool)) {
      e.preventDefault();
      return;
    }
    e.dataTransfer!.setData('application/tool-type', tool.type);
    e.dataTransfer!.effectAllowed = 'copy';
  }
  
  // Handle touch start for mobile drag
  function handleTouchStart(e: TouchEvent, tool: ToolSlot) {
    if (!isAvailable(tool)) return;
    e.preventDefault(); // Prevent default to avoid click conflicts
    ontouchdragstart?.(tool.type);
  }
</script>

<div class="toolbar">
  {#each tools as tool, index}
    <button
      class="tool-slot"
      class:selected={selectedTool === tool.type}
      class:locked={!tool.unlocked}
      class:unavailable={tool.remaining === null}
      class:empty={tool.remaining === 0}
      onclick={() => handleClick(tool)}
      disabled={!isAvailable(tool)}
      draggable={isAvailable(tool)}
      ondragstart={(e) => handleDragStart(e, tool)}
      ontouchstart={(e) => handleTouchStart(e, tool)}
      title="{tool.type} (Press {index + 1} or drag to place)"
    >
      <span class="hotkey">{index + 1}</span>
      <span class="tool-emoji">{TOOL_EMOJI[tool.type]}</span>
      {#if tool.remaining !== null && tool.remaining > 0}
        <span class="count">{tool.remaining}</span>
      {:else if tool.remaining === 0}
        <span class="count zero">0</span>
      {:else}
        <span class="count none">—</span>
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
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    touch-action: none; /* Prevent browser touch gestures */
  }
  
  .tool-slot:active:not(:disabled) {
    cursor: grabbing;
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
  
  .unavailable {
    filter: grayscale(0.5);
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .tool-emoji {
    font-size: 28px;
  }
  
  .hotkey {
    position: absolute;
    top: 2px;
    left: 2px;
    font-size: 10px;
    font-weight: bold;
    color: #fff;
    background: rgba(0,0,0,0.5);
    border-radius: 3px;
    padding: 1px 4px;
    min-width: 12px;
    text-align: center;
  }
  
  .selected .hotkey {
    background: #FFD700;
    color: #5D4037;
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
  
  .count.zero {
    color: #f44336;
    background: rgba(255,255,255,0.9);
  }
  
  .count.none {
    color: #9E9E9E;
    background: transparent;
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
