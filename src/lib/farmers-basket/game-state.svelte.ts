// Farmer's Basket - Game State (Svelte 5 Runes)

import type { 
  Animal, Barrier, Level,
  AnimalType, FoodType, ToolType, Position, Direction
} from './types';
import { ANIMAL_SPEED, ANIMAL_ESCAPE_TIME, ANIMAL_TARGETS, FOOD_ANIMAL_MAP } from './types';

// Game constants
export const GRID_WIDTH = 650;
export const GRID_HEIGHT = 450;

// Grid system: 13x9 cells for main game, +1 row for pantry
export const GRID_COLS = 13;
export const GRID_ROWS = 9;  // Main game rows (animals can be here)
export const PANTRY_ROW = 9; // Extra row for food sources (farmer only)
export const CELL_SIZE = 50;
export const PANTRY_HEIGHT = CELL_SIZE; // Height of pantry area
export const TOTAL_HEIGHT = GRID_HEIGHT + PANTRY_HEIGHT; // 500px total

const FARMER_SPEED = 180; // pixels per second (increased for larger grid)

// Grid position type
export interface GridPosition {
  col: number;
  row: number;
}

// Convert grid position (col, row) to pixel position (center of cell)
export function gridToPixel(gridPos: GridPosition): Position {
  return {
    x: gridPos.col * CELL_SIZE + CELL_SIZE / 2,
    y: gridPos.row * CELL_SIZE + CELL_SIZE / 2
  };
}

// Convert pixel position to grid position
export function pixelToGrid(pixelPos: Position): GridPosition {
  return {
    col: Math.floor(pixelPos.x / CELL_SIZE),
    row: Math.floor(pixelPos.y / CELL_SIZE)
  };
}

// Snap pixel position to nearest grid cell center
export function snapToGrid(pixelPos: Position): Position {
  const gridPos = pixelToGrid(pixelPos);
  return gridToPixel(gridPos);
}

// Check if grid position is within bounds (for animals - main grid only)
export function isValidGridPos(gridPos: GridPosition): boolean {
  return gridPos.col >= 0 && gridPos.col < GRID_COLS && 
         gridPos.row >= 0 && gridPos.row < GRID_ROWS;
}

// Check if grid position is valid for farmer (includes pantry row)
export function isValidFarmerGridPos(gridPos: GridPosition): boolean {
  return gridPos.col >= 0 && gridPos.col < GRID_COLS && 
         gridPos.row >= 0 && gridPos.row <= PANTRY_ROW;
}

// Starting positions in grid coordinates
const BASKET_GRID: GridPosition = { col: 6, row: 0 }; // Top center area (row 0 matches CSS top: 20px)
const FARMER_START_GRID: GridPosition = { col: 6, row: 6 }; // Lower center

const BASKET_POSITION: Position = gridToPixel(BASKET_GRID);
const FARMER_START: Position = gridToPixel(FARMER_START_GRID);
// Visual basket position - use grid position for consistency
const BASKET_VISUAL_POSITION: Position = { x: BASKET_POSITION.x, y: 25 }; // y=25 matches CSS top: 20px + padding

// Food item with position and status (individual food being carried or in basket)
interface FoodItem {
  id: string;
  type: FoodType;
  position: Position;
  pickedUp: boolean;  // being carried by farmer
  inBasket: boolean;  // deposited in basket
  stolen: boolean;
}

// Food source at bottom of screen with limited quantity
interface FoodSource {
  type: FoodType;
  position: Position;
  remaining: number;  // how many left to pick
}

// Extended Farmer with direction
interface FarmerState {
  position: Position;
  state: 'idle' | 'walking' | 'picking' | 'carrying' | 'dropping' | 'placing' | 'recovering';
  carrying: FoodType | null;
  direction: Direction;
}

type GameStatus = 'ready' | 'playing' | 'won' | 'lost';

// Sample levels - foodSupply shows how many of each item available (must collect 1 of each in recipe)
export const LEVELS: Level[] = [
  {
    id: '1-1',
    name: 'Simple Salad',
    world: 1,
    levelNum: 1,
    recipe: ['lettuce'],
    tools: [{ type: 'fence', count: 2, emoji: '🚧' }],  // Added for testing
    animalSpawns: [{ type: 'rabbit', delay: 5000 }],    // Added for testing
    foodSupply: { lettuce: 3, tomato: 0, carrot: 0, cheese: 0, egg: 0, bread: 0, apple: 0, grapes: 0, bacon: 0, butter: 0 }
  },
  {
    id: '1-2',
    name: 'Garden Salad',
    world: 1,
    levelNum: 2,
    recipe: ['lettuce', 'tomato'],
    tools: [{ type: 'fence', count: 2, emoji: '🚧' }],
    animalSpawns: [{ type: 'rabbit', delay: 3000 }],
    foodSupply: { lettuce: 2, tomato: 2, carrot: 0, cheese: 0, egg: 0, bread: 0, apple: 0, grapes: 0, bacon: 0, butter: 0 }
  },
  {
    id: '1-3',
    name: 'Veggie Platter',
    world: 1,
    levelNum: 3,
    recipe: ['lettuce', 'tomato', 'carrot'],
    tools: [{ type: 'fence', count: 3, emoji: '🚧' }],
    animalSpawns: [
      { type: 'rabbit', delay: 2000 },
      { type: 'rabbit', delay: 8000 }
    ],
    foodSupply: { lettuce: 2, tomato: 2, carrot: 3, cheese: 0, egg: 0, bread: 0, apple: 0, grapes: 0, bacon: 0, butter: 0 }
  },
  {
    id: '1-4',
    name: 'Cheese Snack',
    world: 1,
    levelNum: 4,
    recipe: ['lettuce', 'cheese', 'bread'],
    tools: [
      { type: 'fence', count: 3, emoji: '🚧' },
      { type: 'decoy', count: 2, emoji: '🍯' }
    ],
    animalSpawns: [
      { type: 'rabbit', delay: 2000 },
      { type: 'mouse', delay: 5000 }
    ],
    foodSupply: { lettuce: 2, tomato: 0, carrot: 0, cheese: 3, egg: 0, bread: 2, apple: 0, grapes: 0, bacon: 0, butter: 0 }
  },
  {
    id: '1-5',
    name: 'Full Garden Salad',
    world: 1,
    levelNum: 5,
    recipe: ['lettuce', 'tomato', 'carrot', 'cheese'],
    tools: [
      { type: 'fence', count: 4, emoji: '🚧' },
      { type: 'decoy', count: 2, emoji: '🍯' },
      { type: 'lid', count: 1, emoji: '🥏' }
    ],
    animalSpawns: [
      { type: 'rabbit', delay: 2000 },
      { type: 'mouse', delay: 4000 },
      { type: 'rabbit', delay: 7000 }
    ],
    foodSupply: { lettuce: 2, tomato: 2, carrot: 2, cheese: 2, egg: 0, bread: 0, apple: 0, grapes: 0, bacon: 0, butter: 0 }
  }
];

// Create game state factory
export function createGameState() {
  // Current level
  let currentLevel = $state<Level | null>(LEVELS[0]);
  let levelIndex = $state(0);
  
  // Game entities
  let animals = $state<Animal[]>([]);
  let farmer = $state<FarmerState>({
    position: { ...FARMER_START },
    state: 'idle',
    carrying: null,
    direction: 'down'
  });
  let barriers = $state<Barrier[]>([]);
  let foods = $state<FoodItem[]>([]);
  let foodSources = $state<FoodSource[]>([]);  // Food supply at bottom
  
  // Tools available (as counts) - keys are the tool types we support
  let tools = $state<Record<string, number | null>>({
    net: null,
    decoy: null,
    fence: null,
    lid: null,
    scarecrow: null
  });
  let selectedTool = $state<ToolType | null>(null);
  let activeLidId = $state<string | null>(null);  // Track active lid covering basket
  
  // Theft log for notifications
  interface TheftEntry {
    id: string;
    animalType: AnimalType;
    foodType: FoodType;
    timestamp: number;
  }
  let theftLog = $state<TheftEntry[]>([]);
  
  // Game state
  let gameStatus = $state<GameStatus>('ready');
  
  // Input state
  let inputDx = 0;
  let inputDy = 0;
  
  // Touch target for mobile (actual position, not direction)
  let touchTargetPos: Position | null = null;
  // Offset so farmer appears above finger (visible while dragging)
  const TOUCH_OFFSET_Y = -60;
  
  // Spawn timers
  let spawnTimeouts: number[] = [];
  let gameLoopId: number | null = null;
  let animalMoveTimer = 0;  // Timer for grid-based animal movement
  const ANIMAL_MOVE_INTERVAL = 1000;  // Animals move every 1 second
  
  // Check if a grid cell is blocked by barriers or animals
  function isGridCellBlocked(gridPos: GridPosition): boolean {
    // Check barriers (except lid)
    const barrierBlocking = barriers.some(barrier => {
      if (barrier.type === 'lid') return false;
      const barrierGrid = pixelToGrid(barrier.position);
      return barrierGrid.col === gridPos.col && barrierGrid.row === gridPos.row;
    });
    if (barrierBlocking) return true;
    
    // Check animals
    const animalBlocking = animals.some(animal => 
      animal.gridPos.col === gridPos.col && animal.gridPos.row === gridPos.row
    );
    return animalBlocking;
  }
  
  // Initialize level by index
  function initLevel(index: number) {
    if (index < 0 || index >= LEVELS.length) return;
    
    levelIndex = index;
    const level = LEVELS[index];
    currentLevel = level;
    
    // Reset entities
    animals = [];
    barriers = [];
    foods = [];  // Clear any carried/deposited items
    theftLog = [];  // Clear theft notifications
    
    // Setup food sources at bottom based on foodSupply
    // Only create sources for items with quantity > 0
    const availableFoods = Object.entries(level.foodSupply)
      .filter(([_, qty]) => qty > 0)
      .map(([type, qty]) => ({ type: type as FoodType, qty }));
    
    // Position food sources in the pantry row (row 9, below main game grid)
    // Spread evenly across available columns
    const totalFoods = availableFoods.length;
    const startCol = Math.floor((GRID_COLS - totalFoods) / 2); // Center the sources
    
    foodSources = availableFoods.map((food, i) => ({
      type: food.type,
      position: gridToPixel({ col: startCol + i, row: PANTRY_ROW }),
      remaining: food.qty
    }));
    
    // Reset farmer
    farmer = {
      position: { ...FARMER_START },
      state: 'idle',
      carrying: null,
      direction: 'down'
    };
    
    // Setup tools - all tools always available with default counts
    // Level can override with specific counts
    // Order: 1.Net 2.Decoy 3.Fence 4.Lid 5.Scarecrow
    tools = {
      net: 3,
      decoy: 2,
      fence: 2,
      lid: 1,
      scarecrow: 2
    };
    // Override with level-specific counts if provided
    level.tools.forEach(t => {
      tools[t.type] = t.count;
    });
    selectedTool = null;
    
    // Reset game state
    gameStatus = 'ready';
    
    // Clear any existing timers
    spawnTimeouts.forEach(t => clearTimeout(t));
    spawnTimeouts = [];
    if (gameLoopId) {
      cancelAnimationFrame(gameLoopId);
      gameLoopId = null;
    }
  }
  
  // Start the level
  function startLevel() {
    if (!currentLevel) return;
    gameStatus = 'playing';
    
    // NOTE: Animals now spawn when food is picked up (spawnAnimalForFood)
    // Disabling timed spawns from level config
    // currentLevel.animalSpawns.forEach((spawn) => {
    //   const timeout = setTimeout(() => {
    //     spawnAnimal(spawn.type);
    //   }, spawn.delay);
    //   spawnTimeouts.push(timeout as unknown as number);
    // });
    
    // Start game loop
    let lastTime = performance.now();
    function gameLoop(currentTime: number) {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      if (gameStatus === 'playing') {
        updateFarmer(deltaTime);
        updateAnimals(deltaTime);
        checkWinCondition();
        checkLoseCondition();
      }
      
      if (gameStatus === 'playing') {
        gameLoopId = requestAnimationFrame(gameLoop);
      }
    }
    gameLoopId = requestAnimationFrame(gameLoop);
  }
  
  // Stop the level
  function stopLevel() {
    spawnTimeouts.forEach(t => clearTimeout(t));
    spawnTimeouts = [];
    if (gameLoopId) {
      cancelAnimationFrame(gameLoopId);
      gameLoopId = null;
    }
  }
  
  // Spawn an animal (from level config - enters from sides)
  function spawnAnimal(type: AnimalType) {
    const side = Math.random() > 0.5 ? 'left' : 'right';
    const spawnCol = side === 'left' ? 0 : GRID_COLS - 1;
    const spawnRow = GRID_ROWS - 1;  // Bottom row
    const spawnPos = gridToPixel({ col: spawnCol, row: spawnRow });
    
    const animal: Animal = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      position: spawnPos,
      gridPos: { col: spawnCol, row: spawnRow },
      state: 'approaching',
      direction: side === 'left' ? 'right' : 'left',
      targetFood: null,
      path: [],
      escapeProgress: 0
    };
    animals = [...animals, animal];
  }
  
  // Set farmer input direction (for continuous movement)
  function setFarmerInput(dx: number, dy: number) {
    inputDx = dx;
    inputDy = dy;
  }
  
  // Move farmer by exactly one grid cell (for keyboard)
  function moveFarmerByCell(dx: number, dy: number) {
    if (farmer.state === 'picking' || farmer.state === 'dropping' || farmer.state === 'placing') {
      return; // Don't move during actions
    }
    if (gameStatus !== 'playing') return;
    
    // Remove lid when farmer moves
    removeLid();
    
    // Get current grid position
    const currentGrid = pixelToGrid(farmer.position);
    
    // Calculate new grid position
    const newGrid: GridPosition = {
      col: currentGrid.col + dx,
      row: currentGrid.row + dy
    };
    
    // Check bounds (farmer can access pantry row too)
    if (!isValidFarmerGridPos(newGrid)) return;
    
    // Check for barrier collision (farmer cannot walk through barriers)
    const barrierBlocking = barriers.some(barrier => {
      if (barrier.type === 'lid') return false; // Lid doesn't block farmer
      const barrierGrid = pixelToGrid(barrier.position);
      return barrierGrid.col === newGrid.col && barrierGrid.row === newGrid.row;
    });
    if (barrierBlocking) return;
    
    // Check for animal collision (farmer must avoid animals)
    const animalBlocking = animals.some(animal => 
      animal.gridPos.col === newGrid.col && animal.gridPos.row === newGrid.row
    );
    if (animalBlocking) return;
    
    // Update direction based on movement
    if (dx !== 0) {
      farmer.direction = dx > 0 ? 'right' : 'left';
    } else if (dy !== 0) {
      farmer.direction = dy > 0 ? 'down' : 'up';
    }
    
    // Move to new cell center
    farmer.position = gridToPixel(newGrid);
    farmer.state = farmer.carrying ? 'carrying' : 'walking';
    
    // Brief animation state, then return to idle/carrying
    setTimeout(() => {
      if (farmer.state === 'walking') {
        farmer.state = farmer.carrying ? 'carrying' : 'idle';
      }
    }, 150);
  }
  
  // Set touch target position for mobile
  function setTouchTarget(target: Position | null) {
    touchTargetPos = target;
  }
  
  // Update farmer position based on input
  function updateFarmer(deltaTime: number) {
    if (farmer.state === 'picking' || farmer.state === 'dropping' || farmer.state === 'placing') {
      return; // Don't move during actions
    }
    
    let moved = false;
    
    // Touch movement: directly follow finger position (with offset so farmer is visible)
    // Now with collision detection - farmer stops at blocked cells
    if (touchTargetPos) {
      // Grid-based movement - no offset needed since farmer snaps to cells
      const targetX = Math.max(20, Math.min(GRID_WIDTH - 20, touchTargetPos.x));
      const targetY = Math.max(20, Math.min(TOTAL_HEIGHT - 20, touchTargetPos.y));
      
      // Get target grid cell
      const targetGrid = pixelToGrid({ x: targetX, y: targetY });
      const currentGrid = pixelToGrid(farmer.position);
      
      // Only move one cell at a time toward target
      let nextGrid = { ...currentGrid };
      
      if (targetGrid.col !== currentGrid.col || targetGrid.row !== currentGrid.row) {
        // Determine which direction to move
        const dcol = Math.sign(targetGrid.col - currentGrid.col);
        const drow = Math.sign(targetGrid.row - currentGrid.row);
        
        // Try horizontal movement first
        if (dcol !== 0) {
          const testGrid = { col: currentGrid.col + dcol, row: currentGrid.row };
          if (isValidFarmerGridPos(testGrid) && !isGridCellBlocked(testGrid)) {
            nextGrid = testGrid;
          }
        }
        // Then try vertical if horizontal blocked or not needed
        if (nextGrid.col === currentGrid.col && nextGrid.row === currentGrid.row && drow !== 0) {
          const testGrid = { col: currentGrid.col, row: currentGrid.row + drow };
          if (isValidFarmerGridPos(testGrid) && !isGridCellBlocked(testGrid)) {
            nextGrid = testGrid;
          }
        }
      }
      
      if (nextGrid.col !== currentGrid.col || nextGrid.row !== currentGrid.row) {
        // Update direction based on movement
        if (nextGrid.col !== currentGrid.col) {
          farmer.direction = nextGrid.col > currentGrid.col ? 'right' : 'left';
        } else {
          farmer.direction = nextGrid.row > currentGrid.row ? 'down' : 'up';
        }
        
        farmer.position = gridToPixel(nextGrid);
        moved = true;
        
        // Remove lid when farmer moves
        removeLid();
      }
    }
    // Keyboard movement: use direction + speed
    else if (inputDx !== 0 || inputDy !== 0) {
      // Normalize diagonal movement
      const magnitude = Math.sqrt(inputDx * inputDx + inputDy * inputDy);
      const normDx = inputDx / magnitude;
      const normDy = inputDy / magnitude;
      
      // Update direction
      if (Math.abs(inputDx) > Math.abs(inputDy)) {
        farmer.direction = inputDx > 0 ? 'right' : 'left';
      } else {
        farmer.direction = inputDy > 0 ? 'down' : 'up';
      }
      
      // Move farmer
      const moveDistance = FARMER_SPEED * deltaTime;
      let newX = farmer.position.x + normDx * moveDistance;
      let newY = farmer.position.y + normDy * moveDistance;
      
      // Clamp to bounds (includes pantry area)
      newX = Math.max(20, Math.min(GRID_WIDTH - 20, newX));
      newY = Math.max(20, Math.min(TOTAL_HEIGHT - 20, newY));
      
      farmer.position = { x: newX, y: newY };
      moved = true;
    }
    
    if (moved) {
      farmer.state = farmer.carrying ? 'carrying' : 'walking';
    } else {
      farmer.state = farmer.carrying ? 'carrying' : 'idle';
    }
  }
  
  // Track which food item farmer is carrying (by id)
  let carryingFoodId: string | null = null;
  
  // Spawn animal from bottom of screen when food is picked up
  function spawnAnimalForFood(foodType: FoodType) {
    const animalType = FOOD_ANIMAL_MAP[foodType];
    // Spawn at random column on bottom row
    const spawnCol = Math.floor(Math.random() * GRID_COLS);
    const spawnRow = GRID_ROWS - 1;  // Bottom row
    const spawnPos = gridToPixel({ col: spawnCol, row: spawnRow });
    
    const newAnimal: Animal = {
      id: `animal-${animalType}-${Date.now()}`,
      type: animalType,
      position: spawnPos,
      gridPos: { col: spawnCol, row: spawnRow },
      state: 'approaching',
      direction: 'up',
      targetFood: foodType,
      path: [],
      escapeProgress: 0
    };
    
    animals = [...animals, newAnimal];
  }
  
  // Pick up food from a food source
  function pickupFood() {
    if (farmer.carrying) return;
    
    // Check for nearby food source with remaining items
    const nearbySource = foodSources.find(src => 
      src.remaining > 0 &&
      Math.abs(src.position.x - farmer.position.x) < 50 &&
      Math.abs(src.position.y - farmer.position.y) < 50
    );
    
    if (nearbySource) {
      farmer.state = 'picking';
      const sourceType = nearbySource.type;
      
      setTimeout(() => {
        // Find the source again and decrement
        const source = foodSources.find(s => s.type === sourceType);
        if (source && source.remaining > 0) {
          source.remaining--;
          
          // Create a new food item for tracking
          const newFood: FoodItem = {
            id: `food-${sourceType}-${Date.now()}`,
            type: sourceType,
            position: { ...farmer.position },
            pickedUp: true,
            inBasket: false,
            stolen: false
          };
          foods = [...foods, newFood];
          
          farmer.carrying = sourceType;
          carryingFoodId = newFood.id;
          
          // Spawn an animal when food is picked up!
          spawnAnimalForFood(sourceType);
        }
        farmer.state = 'carrying';
      }, 200);
    }
  }
  
  // Drop food in basket
  function dropFood() {
    if (!farmer.carrying || !carryingFoodId) return;
    
    // Check if near basket (larger Y range to account for touch offset)
    const nearBasket = 
      Math.abs(BASKET_POSITION.x - farmer.position.x) < 60 &&
      Math.abs(BASKET_POSITION.y - farmer.position.y) < 100;
    
    if (nearBasket) {
      farmer.state = 'dropping';
      const foodId = carryingFoodId;
      const foodType = farmer.carrying;
      setTimeout(() => {
        const food = foods.find(f => f.id === foodId);
        if (food) {
          food.inBasket = true;
          
          // Remove theft notification for this food type (it's been replaced)
          const theftIndex = theftLog.findIndex(t => t.foodType === foodType);
          if (theftIndex !== -1) {
            theftLog = theftLog.filter((_, i) => i !== theftIndex);
          }
        }
        farmer.carrying = null;
        carryingFoodId = null;
        farmer.state = 'idle';
      }, 200);
    }
  }
  
  // Select tool
  function selectTool(type: ToolType | null) {
    if (gameStatus !== 'playing') return;  // Only allow during gameplay
    
    if (type === null) {
      selectedTool = null;
      return;
    }
    
    const count = tools[type];
    if (count === null || count <= 0) return;
    
    // Lid activates immediately when selected - no placement needed
    if (type === 'lid') {
      activateLid();
      return;
    }
    
    selectedTool = type;
  }
  
  // Activate lid - covers basket immediately
  function activateLid() {
    const count = tools.lid;
    if (count === null || count <= 0) return;
    
    tools.lid = count - 1;
    const lidId = `lid-${Date.now()}`;
    activeLidId = lidId;  // Track this lid
    barriers = [...barriers, {
      id: lidId,
      type: 'lid' as const,
      position: { ...BASKET_VISUAL_POSITION }
    }];
    // Lid effect: covers basket, blocks ALL animals until farmer moves
    animals = animals.map(a => ({ ...a, state: 'avoiding' as const }));
  }
  
  // Remove lid when farmer moves
  function removeLid() {
    if (activeLidId) {
      barriers = barriers.filter(b => b.id !== activeLidId);
      // Only reset animals that were avoiding due to lid, not animals already at basket
      animals = animals.map(a => 
        a.state === 'avoiding' ? { ...a, state: 'approaching' as const } : a
      );
      activeLidId = null;
    }
  }
  
  // Place tool at farmer position
  function placeTool() {
    if (!selectedTool) return;
    placeToolAt(farmer.position.x, farmer.position.y);
  }
  
  // Place tool at specific position
  function placeToolAt(x: number, y: number) {
    if (!selectedTool) return;
    
    const count = tools[selectedTool];
    if (count === null || count <= 0) return;
    
    // Place barrier snapped to grid
    const snappedPos = snapToGrid({ x, y });
    tools[selectedTool] = count - 1;
    barriers = [...barriers, {
      id: `barrier-${Date.now()}`,
      type: selectedTool as 'fence' | 'scarecrow' | 'torch' | 'decoy',
      position: snappedPos,
      health: selectedTool === 'decoy' ? 100 : undefined
    }];
    
    farmer.state = 'placing';
    setTimeout(() => {
      farmer.state = 'idle';
    }, 200);
    
    selectedTool = null;
  }
  
  // Place tool by drag and drop (without pre-selecting)
  function placeToolByDrag(toolType: ToolType, x: number, y: number): boolean {
    if (gameStatus !== 'playing') return false;
    
    const count = tools[toolType];
    if (count === null || count <= 0) return false;
    
    // Lid activates via selectTool, not drag
    if (toolType === 'lid') {
      activateLid();
      return true;
    }
    
    // Place barrier snapped to grid
    const snappedPos = snapToGrid({ x, y });
    tools[toolType] = count - 1;
    barriers = [...barriers, {
      id: `barrier-${Date.now()}`,
      type: toolType as 'fence' | 'scarecrow' | 'torch' | 'decoy',
      position: snappedPos,
      health: toolType === 'decoy' ? 100 : undefined
    }];
    
    return true;
  }
  
  // Move an existing barrier to a new position
  function moveBarrier(barrierId: string, x: number, y: number) {
    if (gameStatus !== 'playing') return;
    
    const snappedPos = snapToGrid({ x, y });
    barriers = barriers.map(b => 
      b.id === barrierId ? { ...b, position: snappedPos } : b
    );
  }
  
  // Update animals with grid-based movement
  function updateAnimals(deltaTime: number) {
    // Accumulate time for grid movement
    animalMoveTimer += deltaTime * 1000;
    
    // Only move animals at intervals
    const shouldMove = animalMoveTimer >= ANIMAL_MOVE_INTERVAL;
    if (shouldMove) {
      animalMoveTimer = 0;
    }
    
    animals = animals.map(animal => {
      // Check if avoiding (lid effect)
      if (animal.state === 'avoiding') {
        return animal;
      }
      
      // Check if escaping through/under/over a barrier - skip movement logic
      if (['digging', 'climbing', 'squeezing'].includes(animal.state)) {
        return animal; // Progress handled below
      }
      
      // Check if distracted by decoy
      if (animal.state === 'distracted') {
        // Animal is eating a decoy - handled separately below
        return animal;
      }
      
      // Check for nearby decoys that attract the animal
      const decoys = barriers.filter(b => b.type === 'decoy');
      const DECOY_ATTRACTION_RANGE = 4; // Grid cells
      
      // Find the nearest decoy within range
      let nearestDecoy: typeof decoys[0] | null = null;
      let nearestDecoyDist = Infinity;
      
      for (const decoy of decoys) {
        const decoyGrid = pixelToGrid(decoy.position);
        const dist = Math.abs(decoyGrid.col - animal.gridPos.col) + Math.abs(decoyGrid.row - animal.gridPos.row);
        if (dist <= DECOY_ATTRACTION_RANGE && dist < nearestDecoyDist) {
          nearestDecoy = decoy;
          nearestDecoyDist = dist;
        }
      }
      
      // Get basket grid position
      const basketGrid = pixelToGrid(BASKET_POSITION);
      const animalGrid = animal.gridPos;
      
      // Check if animal has reached a decoy - becomes distracted
      if (nearestDecoy) {
        const decoyGrid = pixelToGrid(nearestDecoy.position);
        if (animalGrid.col === decoyGrid.col && animalGrid.row === decoyGrid.row) {
          // Animal reached the decoy - become distracted
          return { ...animal, state: 'distracted' as const };
        }
      }
      
      // Check if at basket (arrived!) - must be in same column and within 1 row
      // Also check if there's a fence blocking the path to the basket
      const atBasketColumn = animalGrid.col === basketGrid.col;
      const withinBasketRange = Math.abs(animalGrid.row - basketGrid.row) <= 1;
      
      // If exactly at basket position, can definitely steal (no fence check needed)
      const atExactBasket = animalGrid.col === basketGrid.col && animalGrid.row === basketGrid.row;
      
      // If animal is adjacent (not directly on basket), check if a fence blocks the path
      let pathBlocked = false;
      if (atBasketColumn && withinBasketRange && !atExactBasket) {
        // Animal is one row away - check for fences at basket position
        // A fence directly at the basket blocks stealing from any direction
        pathBlocked = barriers.some(barrier => {
          if (barrier.type === 'lid') return false;
          const barrierGrid = pixelToGrid(barrier.position);
          // Fence blocks if it's at the basket position, or between animal and basket
          if (barrierGrid.col !== animalGrid.col) return false;
          // Check basket row
          if (barrierGrid.row === basketGrid.row) return true;
          // Check row between animal and basket (if animal below basket, check row below basket)
          if (animalGrid.row > basketGrid.row && barrierGrid.row === basketGrid.row + 1) return true;
          // If animal above basket, only the basket row matters (row 0 and row 1 are adjacent)
          return false;
        });
      }
      
      if ((atExactBasket || (atBasketColumn && withinBasketRange)) && !pathBlocked) {
        if (animal.state !== 'sniffing' && animal.state !== 'stealing' && animal.state !== 'celebrating') {
          return { ...animal, state: 'sniffing' as const };
        }
        
        // Try to steal after sniffing
        if (animal.state === 'sniffing') {
          const targetFoods = ANIMAL_TARGETS[animal.type];
          const stolenItem = foods.find(f => 
            f.inBasket && !f.stolen && targetFoods.includes(f.type)
          );
          
          if (stolenItem) {
            stolenItem.stolen = true;
            stolenItem.inBasket = false;
            
            // Add to theft log
            const theftEntry: TheftEntry = {
              id: `theft-${Date.now()}`,
              animalType: animal.type,
              foodType: stolenItem.type,
              timestamp: Date.now()
            };
            theftLog = [theftEntry, ...theftLog].slice(0, 5); // Keep last 5
            
            // Go to celebrating state briefly, then remove
            setTimeout(() => {
              // Switch from stealing to celebrating (victory dance)
              animals = animals.map(a => 
                a.id === animal.id ? { ...a, state: 'celebrating' as const } : a
              );
              // Remove animal after celebration
              setTimeout(() => {
                animals = animals.filter(a => a.id !== animal.id);
              }, 1500);  // 1.5s celebration dance
            }, 300);
            
            return { ...animal, state: 'stealing' as const, stolenFood: stolenItem.type };
          }
          
          // Nothing to steal! Check for nearby decoy to be attracted to
          if (nearestDecoy && shouldMove) {
            const decoyGrid = pixelToGrid(nearestDecoy.position);
            // Move toward decoy instead of staying at basket
            const moves = [
              { col: Math.sign(decoyGrid.col - animalGrid.col), row: 0 },
              { col: 0, row: Math.sign(decoyGrid.row - animalGrid.row) }
            ].filter(m => m.col !== 0 || m.row !== 0);
            
            if (moves.length > 0) {
              const move = moves[Math.floor(Math.random() * moves.length)];
              const newCol = animalGrid.col + move.col;
              const newRow = animalGrid.row + move.row;
              if (newCol >= 0 && newCol < GRID_COLS && newRow >= 0 && newRow < GRID_ROWS) {
                const newPos = gridToPixel({ col: newCol, row: newRow });
                return {
                  ...animal,
                  state: 'approaching' as const,
                  gridPos: { col: newCol, row: newRow },
                  position: newPos
                };
              }
            }
          }
          
          // No decoy - wander away after a bit (give up)
          if (shouldMove && Math.random() < 0.3) {
            // Random direction away from basket
            const awayMoves = [
              { col: -1, row: 1 }, { col: 0, row: 1 }, { col: 1, row: 1 }
            ];
            const move = awayMoves[Math.floor(Math.random() * awayMoves.length)];
            const newCol = Math.max(0, Math.min(GRID_COLS - 1, animalGrid.col + move.col));
            const newRow = Math.min(GRID_ROWS - 1, animalGrid.row + move.row);
            if (newRow !== animalGrid.row || newCol !== animalGrid.col) {
              const newPos = gridToPixel({ col: newCol, row: newRow });
              return {
                ...animal,
                state: 'approaching' as const,
                gridPos: { col: newCol, row: newRow },
                position: newPos
              };
            }
          }
          
          return animal;
        }
        return animal;
      }
      
      // Only move if it's time
      if (!shouldMove) return animal;
      
      // Calculate direction toward target (decoy if nearby, otherwise basket)
      let targetGrid = basketGrid;
      if (nearestDecoy) {
        targetGrid = pixelToGrid(nearestDecoy.position);
      }
      
      const dcol = targetGrid.col - animalGrid.col;
      const drow = targetGrid.row - animalGrid.row;
      
      // Possible moves: prefer toward target but always include alternatives for pathfinding
      const moves: { col: number; row: number }[] = [];
      
      // Add moves toward target with higher weight
      if (dcol > 0) moves.push({ col: 1, row: 0 }, { col: 1, row: 0 });
      if (dcol < 0) moves.push({ col: -1, row: 0 }, { col: -1, row: 0 });
      if (drow > 0) moves.push({ col: 0, row: 1 }, { col: 0, row: 1 });
      if (drow < 0) moves.push({ col: 0, row: -1 }, { col: 0, row: -1 }, { col: 0, row: -1 }); // Prefer up toward basket
      
      // ALWAYS add some lateral and vertical moves for pathfinding around obstacles
      // Even if we're aligned with basket, we need options to go around barriers
      moves.push({ col: 1, row: 0 }, { col: -1, row: 0 }); // lateral
      moves.push({ col: 0, row: -1 }, { col: 0, row: 1 }); // vertical - enables going around fences
      
      // Birds can fly over barriers
      const canFly = animal.type === 'bird';
      
      // Try moves in random order
      const shuffled = moves.sort(() => Math.random() - 0.5);
      
      for (const move of shuffled) {
        const newCol = animalGrid.col + move.col;
        const newRow = animalGrid.row + move.row;
        
        // Check bounds
        if (newCol < 0 || newCol >= GRID_COLS || newRow < 0 || newRow >= GRID_ROWS) {
          continue;
        }
        
        const newPixelPos = gridToPixel({ col: newCol, row: newRow });
        
        // Check for barrier collision (unless bird flying)
        if (!canFly) {
          const blocked = barriers.some(barrier => {
            if (barrier.type === 'lid') return false; // Lid only blocks at basket
            if (barrier.type === 'decoy') return false; // Decoy is passable - attracts animals
            const barrierGrid = pixelToGrid(barrier.position);
            return barrierGrid.col === newCol && barrierGrid.row === newRow;
          });
          
          if (blocked) {
            // Get the barrier type that's blocking
            const blockingBarrier = barriers.find(barrier => {
              if (barrier.type === 'lid' || barrier.type === 'decoy') return false;
              const barrierGrid = pixelToGrid(barrier.position);
              return barrierGrid.col === newCol && barrierGrid.row === newRow;
            });
            const barrierType = blockingBarrier?.type;
            
            // Store where we're trying to escape to
            const escapeTarget = { col: newCol, row: newRow };
            
            // Start escape behavior based on animal type and barrier type
            if (animal.type === 'rabbit') {
              // Rabbit hops through fence gaps easily, but must dig under net
              if (barrierType === 'fence') {
                return { ...animal, state: 'squeezing' as const, escapeProgress: 0, escapeTarget };
              } else {
                return { ...animal, state: 'digging' as const, escapeProgress: 0, escapeTarget };
              }
            } else if (animal.type === 'mouse') {
              // Mouse walks right through fence, but must squeeze through net
              if (barrierType === 'fence') {
                // Pass through fence almost instantly
                const newPos = gridToPixel({ col: newCol, row: newRow });
                return { 
                  ...animal, 
                  gridPos: { col: newCol, row: newRow },
                  position: newPos 
                };
              } else {
                return { ...animal, state: 'squeezing' as const, escapeProgress: 0, escapeTarget };
              }
            } else if (animal.type === 'squirrel') {
              return { ...animal, state: 'climbing' as const, escapeProgress: 0, escapeTarget };
            }
            continue; // Try another direction (fox, raccoon)
          }
        }
        
        // Check for other animals (avoid collision)
        const animalCollision = animals.some(other => 
          other.id !== animal.id && 
          other.gridPos.col === newCol && 
          other.gridPos.row === newRow
        );
        if (animalCollision) continue;
        
        // Move to new cell
        const newDirection: Direction = move.col > 0 ? 'right' : move.col < 0 ? 'left' : move.row > 0 ? 'down' : 'up';
        
        return {
          ...animal,
          state: canFly ? 'flying' as const : 'approaching' as const,
          direction: newDirection,
          gridPos: { col: newCol, row: newRow },
          position: newPixelPos
        };
      }
      
      // No valid move found, stay in place (blocked)
      return { ...animal, state: 'blocked' as const };
    });
    
    // Handle escape progress (runs every frame, not just on move intervals)
    animals = animals.map(animal => {
      if (['digging', 'climbing', 'squeezing'].includes(animal.state)) {
        const escapeTime = ANIMAL_ESCAPE_TIME[animal.type];
        const progress = animal.escapeProgress + (deltaTime * 1000 / escapeTime) * 100;
        if (progress >= 100) {
          // Escaped - move to the target cell we were trying to reach
          const newGridPos = animal.escapeTarget ?? { col: animal.gridPos.col, row: Math.max(0, animal.gridPos.row - 1) };
          
          const newPos = gridToPixel(newGridPos);
          return { 
            ...animal, 
            state: 'approaching' as const, 
            escapeProgress: 0,
            escapeTarget: undefined,
            gridPos: newGridPos,
            position: newPos
          };
        }
        return { ...animal, escapeProgress: progress };
      }
      return animal;
    });
    
    // Handle distracted animals consuming decoys (runs every frame)
    const DECOY_CONSUME_RATE = 25; // % per second
    animals = animals.map(animal => {
      if (animal.state === 'distracted') {
        // Find the decoy at this animal's position
        const animalGrid = animal.gridPos;
        const decoyAtPos = barriers.find(b => {
          if (b.type !== 'decoy') return false;
          const bGrid = pixelToGrid(b.position);
          return bGrid.col === animalGrid.col && bGrid.row === animalGrid.row;
        });
        
        if (decoyAtPos && decoyAtPos.health !== undefined) {
          // Consume the decoy
          decoyAtPos.health -= DECOY_CONSUME_RATE * deltaTime;
          
          if (decoyAtPos.health <= 0) {
            // Decoy consumed - remove it and make animal approach again
            barriers = barriers.filter(b => b.id !== decoyAtPos.id);
            return { ...animal, state: 'approaching' as const };
          }
        } else {
          // No decoy found - animal goes back to approaching
          return { ...animal, state: 'approaching' as const };
        }
      }
      return animal;
    });
  }
  
  // Check win condition
  function checkWinCondition() {
    if (!currentLevel) return;
    
    // Win when we have collected all recipe items in the basket
    const recipe = currentLevel.recipe;
    const inBasket = foods.filter(f => f.inBasket).map(f => f.type);
    
    // Check each recipe item is in basket
    const allCollected = recipe.every(recipeItem => 
      inBasket.includes(recipeItem)
    );
    
    if (allCollected && recipe.length > 0 && gameStatus === 'playing') {
      gameStatus = 'won';
      stopLevel();
    }
  }
  
  // Check lose condition
  function checkLoseCondition() {
    if (!currentLevel) return;
    
    // Lose if:
    // 1. Required recipe items can no longer be collected (all stolen or depleted without enough in basket)
    const recipe = currentLevel.recipe;
    const inBasket = foods.filter(f => f.inBasket).map(f => f.type);
    const carrying = farmer.carrying;
    
    // Check each recipe item - can we still get it?
    for (const recipeItem of recipe) {
      if (inBasket.includes(recipeItem)) continue; // Already have it
      if (carrying === recipeItem) continue; // Carrying it
      
      // Check if any source has this item remaining
      const source = foodSources.find(s => s.type === recipeItem);
      if (!source || source.remaining <= 0) {
        // Can't get this item anymore - lose!
        gameStatus = 'lost';
        stopLevel();
        return;
      }
    }
  }
  
  // Next level
  function nextLevel() {
    if (levelIndex < LEVELS.length - 1) {
      initLevel(levelIndex + 1);
    }
  }
  
  // Initialize first level
  initLevel(0);
  
  return {
    // State (readable)
    get currentLevel() { return currentLevel; },
    get levelIndex() { return levelIndex; },
    get animals() { return animals; },
    get farmer() { return farmer; },
    get barriers() { return barriers; },
    get foods() { return foods; },
    get foodSources() { return foodSources; },
    get tools() { return tools; },
    get selectedTool() { return selectedTool; },
    get gameStatus() { return gameStatus; },
    get theftLog() { return theftLog; },
    
    // Actions
    initLevel,
    startLevel,
    stopLevel,
    setFarmerInput,
    moveFarmerByCell,
    setTouchTarget,
    pickupFood,
    dropFood,
    selectTool,
    placeTool,
    placeToolAt,
    placeToolByDrag,
    moveBarrier,
    nextLevel
  };
}

export type GameState = ReturnType<typeof createGameState>;
