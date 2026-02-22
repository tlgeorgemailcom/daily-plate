// Farmer's Basket - Game State (Svelte 5 Runes)

import type { 
  Animal, Barrier, Level,
  AnimalType, FoodType, ToolType, Position, Direction
} from './types';
import { ANIMAL_SPEED, ANIMAL_ESCAPE_TIME, ANIMAL_TARGETS } from './types';

// Game constants
export const GRID_WIDTH = 600;
export const GRID_HEIGHT = 450;
const FARMER_SPEED = 180; // pixels per second (increased for larger grid)
const BASKET_POSITION: Position = { x: 300, y: 100 };
const FARMER_START: Position = { x: 300, y: 320 };

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
    tools: [],
    animalSpawns: [],
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
      { type: 'decoy', count: 2, emoji: '🧀' }
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
      { type: 'decoy', count: 2, emoji: '🧀' },
      { type: 'umbrella', count: 1, emoji: '☂️' }
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
    fence: null,
    decoy: null,
    umbrella: null,
    net: null,
    scarecrow: null
  });
  let selectedTool = $state<ToolType | null>(null);
  
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
    
    // Setup food sources at bottom based on foodSupply
    // Only create sources for items with quantity > 0
    const availableFoods = Object.entries(level.foodSupply)
      .filter(([_, qty]) => qty > 0)
      .map(([type, qty]) => ({ type: type as FoodType, qty }));
    
    const spacing = GRID_WIDTH / (availableFoods.length + 1);
    foodSources = availableFoods.map((food, i) => ({
      type: food.type,
      position: { x: spacing * (i + 1), y: GRID_HEIGHT - 40 },
      remaining: food.qty
    }));
    
    // Reset farmer
    farmer = {
      position: { ...FARMER_START },
      state: 'idle',
      carrying: null,
      direction: 'down'
    };
    
    // Setup tools
    tools = {
      fence: null,
      decoy: null,
      umbrella: null,
      net: null,
      scarecrow: null
    };
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
    
    // Schedule animal spawns
    currentLevel.animalSpawns.forEach((spawn) => {
      const timeout = setTimeout(() => {
        spawnAnimal(spawn.type);
      }, spawn.delay);
      spawnTimeouts.push(timeout as unknown as number);
    });
    
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
  
  // Spawn an animal
  function spawnAnimal(type: AnimalType) {
    const side = Math.random() > 0.5 ? 'left' : 'right';
    const animal: Animal = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      position: {
        x: side === 'left' ? -30 : GRID_WIDTH + 30,
        y: 60 + Math.random() * 60
      },
      state: 'approaching',
      direction: side === 'left' ? 'right' : 'left',
      targetFood: null,
      path: [],
      escapeProgress: 0
    };
    animals = [...animals, animal];
  }
  
  // Set farmer input direction
  function setFarmerInput(dx: number, dy: number) {
    inputDx = dx;
    inputDy = dy;
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
    if (touchTargetPos) {
      // Apply offset so farmer appears above finger (no horizontal offset)
      const targetX = Math.max(20, Math.min(GRID_WIDTH - 20, touchTargetPos.x));
      const targetY = Math.max(20, Math.min(GRID_HEIGHT - 20, touchTargetPos.y + TOUCH_OFFSET_Y));
      
      const diffX = targetX - farmer.position.x;
      const diffY = targetY - farmer.position.y;
      const distance = Math.sqrt(diffX * diffX + diffY * diffY);
      
      if (distance > 3) {
        // Update direction based on movement
        if (Math.abs(diffX) > Math.abs(diffY)) {
          farmer.direction = diffX > 0 ? 'right' : 'left';
        } else {
          farmer.direction = diffY > 0 ? 'down' : 'up';
        }
        
        // Directly set position to target (instant follow)
        farmer.position = { x: targetX, y: targetY };
        moved = true;
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
      
      // Clamp to bounds
      newX = Math.max(20, Math.min(GRID_WIDTH - 20, newX));
      newY = Math.max(20, Math.min(GRID_HEIGHT - 20, newY));
      
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
      setTimeout(() => {
        const food = foods.find(f => f.id === foodId);
        if (food) {
          food.inBasket = true;
        }
        farmer.carrying = null;
        carryingFoodId = null;
        farmer.state = 'idle';
      }, 200);
    }
  }
  
  // Select tool
  function selectTool(type: ToolType | null) {
    if (type === null) {
      selectedTool = null;
      return;
    }
    
    const count = tools[type];
    if (count === null || count <= 0) return;
    selectedTool = type;
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
    
    // Handle umbrella specially (area effect, not barrier)
    if (selectedTool === 'umbrella') {
      tools.umbrella = (tools.umbrella ?? 1) - 1;
      // Umbrella effect: pause all animals briefly
      animals = animals.map(a => ({ ...a, state: 'avoiding' as const }));
      setTimeout(() => {
        animals = animals.map(a => ({ ...a, state: 'approaching' as const }));
      }, 3000);
      selectedTool = null;
      return;
    }
    
    // Place barrier
    tools[selectedTool] = count - 1;
    barriers = [...barriers, {
      id: `barrier-${Date.now()}`,
      type: selectedTool as 'fence' | 'scarecrow' | 'torch',
      position: { x, y }
    }];
    
    farmer.state = 'placing';
    setTimeout(() => {
      farmer.state = 'idle';
    }, 200);
    
    selectedTool = null;
  }
  
  // Update animals
  function updateAnimals(deltaTime: number) {
    animals = animals.map(animal => {
      // Check if avoiding (umbrella effect)
      if (animal.state === 'avoiding') {
        return animal;
      }
      
      // Simple pathfinding toward basket
      const dx = BASKET_POSITION.x - animal.position.x;
      const dy = BASKET_POSITION.y - animal.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Check for barrier collision
      const blocked = barriers.some(barrier => {
        const bx = barrier.position.x - animal.position.x;
        const by = barrier.position.y - animal.position.y;
        return Math.abs(bx) < 30 && Math.abs(by) < 30;
      });
      
      if (blocked && !['digging', 'climbing', 'squeezing', 'blocked'].includes(animal.state)) {
        // Start escape behavior based on animal type
        if (animal.type === 'rabbit') {
          return { ...animal, state: 'digging' as const, escapeProgress: 0 };
        } else if (animal.type === 'squirrel') {
          return { ...animal, state: 'climbing' as const, escapeProgress: 0 };
        } else if (animal.type === 'mouse') {
          return { ...animal, state: 'squeezing' as const, escapeProgress: 0 };
        } else {
          return { ...animal, state: 'blocked' as const };
        }
      }
      
      // Handle escape progress
      if (['digging', 'climbing', 'squeezing'].includes(animal.state)) {
        const escapeTime = ANIMAL_ESCAPE_TIME[animal.type];
        const progress = animal.escapeProgress + (deltaTime * 1000 / escapeTime) * 100;
        if (progress >= 100) {
          // Escaped - teleport past all barriers
          return { 
            ...animal, 
            state: 'approaching' as const, 
            escapeProgress: 0,
            position: {
              x: BASKET_POSITION.x + (Math.random() - 0.5) * 40,
              y: BASKET_POSITION.y + 20
            }
          };
        }
        return { ...animal, escapeProgress: progress };
      }
      
      // Check if at basket (arrived!)
      if (distance < 40) {
        if (animal.state !== 'sniffing' && animal.state !== 'stealing') {
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
            // Remove this animal after stealing
            setTimeout(() => {
              animals = animals.filter(a => a.id !== animal.id);
            }, 500);
            return { ...animal, state: 'stealing' as const };
          }
          // Nothing to steal, but reached basket
          return animal;
        }
        
        return animal;
      }
      
      // Birds fly over barriers (no path blocking)
      if (animal.type === 'bird') {
        const speed = ANIMAL_SPEED[animal.type] * deltaTime;
        return {
          ...animal,
          state: 'flying' as const,
          position: {
            x: animal.position.x + (dx / distance) * speed,
            y: animal.position.y + (dy / distance) * speed
          }
        };
      }
      
      // Normal movement
      const speed = ANIMAL_SPEED[animal.type] * deltaTime;
      const newDirection: Direction = dx > 0 ? 'right' : 'left';
      
      return {
        ...animal,
        state: 'approaching' as const,
        direction: newDirection,
        position: {
          x: animal.position.x + (dx / distance) * speed,
          y: animal.position.y + (dy / distance) * speed
        }
      };
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
    
    // Actions
    initLevel,
    startLevel,
    stopLevel,
    setFarmerInput,
    setTouchTarget,
    pickupFood,
    dropFood,
    selectTool,
    placeTool,
    placeToolAt,
    nextLevel
  };
}

export type GameState = ReturnType<typeof createGameState>;
