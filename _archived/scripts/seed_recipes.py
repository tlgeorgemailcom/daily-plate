#!/usr/bin/env python3
"""
Seed built-in recipes from game-state.svelte.ts to Turso database.
Parses the TypeScript file and extracts all LEVELS entries.
"""

import re
import json
import libsql_experimental as libsql
import os

# Turso connection details
TURSO_URL = "libsql://daily-food-chain-tlgeorge.aws-us-east-1.turso.io"
TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI2MjQxOTAsImlkIjoiMDE5Y2I4YTItNTQwMS03Y2VmLWFkMjYtNjAwZWJiYTUwNzkyIiwicmlkIjoiY2ZiMjkyYmYtNjViNC00NTQ1LThiYzgtMjM5ZDVhODQzYzYwIn0.C2ZB6niPeWPmKA16_IzNbSLn8VAOELLjrdml6ZXp12cfKfMtS6f4w1w32LFlUPjiJLiYhg9yGbjzojvUGPqNDg"

def parse_levels_from_ts(filepath: str) -> list[dict]:
    """Extract LEVELS array from TypeScript file."""
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Find LEVELS array
    match = re.search(r'export const LEVELS: Level\[\] = \[(.*?)\];', content, re.DOTALL)
    if not match:
        raise ValueError("Could not find LEVELS array")
    
    levels_str = match.group(1)
    
    # Parse each level object
    levels = []
    # Find each level block starting with {
    level_pattern = re.compile(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', re.DOTALL)
    
    # Actually, let's use a simpler approach - extract key fields directly
    level_blocks = re.split(r'\n  \{', levels_str)
    
    for block in level_blocks:
        if "id:" not in block:
            continue
        
        level = {}
        
        # Extract simple string fields
        for field in ['id', 'name', 'category', 'dietaryCategory', 'servings', 'prepTime']:
            match = re.search(rf"{field}: '([^']*)'", block)
            if match:
                level[field] = match.group(1)
        
        # Extract levelNum
        match = re.search(r'levelNum: (\d+)', block)
        if match:
            level['levelNum'] = int(match.group(1))
        
        # Extract recipe array
        match = re.search(r"recipe: \[([^\]]*)\]", block)
        if match:
            recipe_str = match.group(1)
            level['recipe'] = re.findall(r"'([^']*)'", recipe_str)
        
        # Extract foodSupply
        match = re.search(r"foodSupply: \{([^}]+)\}", block)
        if match:
            supply_str = match.group(1)
            supply = {}
            for item in re.findall(r"(\w+): (\d+)", supply_str):
                supply[item[0]] = int(item[1])
            level['foodSupply'] = supply
        
        # Extract tools
        tools = []
        for tool_match in re.finditer(r"\{ type: '(\w+)', count: (\d+), emoji: '([^']+)' \}", block):
            tools.append({
                'type': tool_match.group(1),
                'count': int(tool_match.group(2)),
                'emoji': tool_match.group(3)
            })
        if tools:
            level['tools'] = tools
        
        # Extract animalSpawns
        spawns = []
        for spawn_match in re.finditer(r"\{ type: '(\w+)', delay: (\d+)", block):
            spawns.append({
                'type': spawn_match.group(1),
                'delay': int(spawn_match.group(2))
            })
        if spawns:
            level['animalSpawns'] = spawns
        
        # Extract recipeInstructions
        match = re.search(r"recipeInstructions: \[(.*?)\](?:,|\n)", block, re.DOTALL)
        if match:
            instr_str = match.group(1)
            level['recipeInstructions'] = re.findall(r"'([^']*)'", instr_str)
        
        # Extract recipeIngredients
        ingredients = []
        for ing_match in re.finditer(r"\{ name: '([^']+)', quantity: '([^']+)' \}", block):
            ingredients.append({
                'name': ing_match.group(1),
                'quantity': ing_match.group(2)
            })
        if ingredients:
            level['recipeIngredients'] = ingredients
        
        if 'id' in level:
            levels.append(level)
    
    return levels


def seed_to_turso(levels: list[dict]):
    """Insert levels into Turso database."""
    conn = libsql.connect("daily-food-chain", sync_url=TURSO_URL, auth_token=TURSO_TOKEN)
    conn.sync()
    
    cursor = conn.cursor()
    
    # Clear existing builtin recipes
    cursor.execute("DELETE FROM recipes WHERE type = 'builtin'")
    
    for level in levels:
        cursor.execute("""
            INSERT INTO recipes (
                id, type, name, category, dietary_category, level_num,
                prep_time, servings,
                recipe, recipe_ingredients, recipe_instructions,
                food_supply, tools, animal_spawns,
                submitted_by, status, created_at
            ) VALUES (?, 'builtin', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'System', 'approved', datetime('now'))
        """, [
            f"builtin-{level.get('id', '')}",
            level.get('name', ''),
            level.get('category', ''),
            level.get('dietaryCategory'),
            level.get('levelNum'),
            level.get('prepTime'),
            level.get('servings'),
            json.dumps(level.get('recipe', [])),
            json.dumps(level.get('recipeIngredients', [])),
            json.dumps(level.get('recipeInstructions', [])),
            json.dumps(level.get('foodSupply', {})),
            json.dumps(level.get('tools', [])),
            json.dumps(level.get('animalSpawns', [])),
        ])
    
    conn.commit()
    conn.sync()
    
    # Verify
    cursor.execute("SELECT COUNT(*) FROM recipes WHERE type = 'builtin'")
    count = cursor.fetchone()[0]
    print(f"✅ Seeded {count} built-in recipes to Turso")
    
    return count


if __name__ == "__main__":
    ts_file = "src/lib/farmers-basket/game-state.svelte.ts"
    
    print(f"📖 Parsing levels from {ts_file}...")
    levels = parse_levels_from_ts(ts_file)
    print(f"   Found {len(levels)} levels")
    
    # Debug: print first level
    if levels:
        print(f"   First level: {levels[0]['name']}")
    
    print(f"\n🌱 Seeding to Turso...")
    seed_to_turso(levels)
