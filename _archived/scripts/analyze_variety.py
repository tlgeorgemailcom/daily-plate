from itertools import combinations
import re
import os

# Load food words
script_dir = os.path.dirname(os.path.abspath(__file__))
food_file = os.path.join(script_dir, 'src/lib/data/food-portions.ts')
with open(food_file, 'r') as f:
    content = f.read()

# Extract food words - look for "word" field
pattern = r'"word":\s*"([^"]+)"'
matches = re.findall(pattern, content)

# Get single words, lowercase
words = set()
for name in matches:
    for word in name.lower().split():
        word = re.sub(r'[^a-z]', '', word)
        if len(word) >= 3:
            words.add(word)

print(f"Total food words: {len(words)}")

# Function to check if word can be made from letters (with reuse)
def can_make(word, letters):
    return all(c in letters for c in word)

def get_valid_words(letters):
    return [w for w in words if can_make(w, letters)]

# Find ALL 7-letter combos that yield 10+ words
alphabet = 'abcdefghijklmnopqrstuvwxyz'
viable_combos = []

print("\nFinding all viable 7-letter combinations (10+ words)...")
for combo in combinations(alphabet, 7):
    letters = set(combo)
    valid = get_valid_words(letters)
    if len(valid) >= 10:
        viable_combos.append((combo, valid))

print(f"\nTotal viable combos (10+ words): {len(viable_combos)}")

# Sort by word count
viable_combos.sort(key=lambda x: len(x[1]), reverse=True)

# Show top 20
print("\nTop 20 combinations:")
for combo, valid in viable_combos[:20]:
    print(f"  {''.join(combo).upper()}: {len(valid)} words")

# Analyze overlap between top combos
print("\n--- Overlap Analysis (Top 10) ---")
top_10 = viable_combos[:10]
for i, (c1, w1) in enumerate(top_10):
    for j, (c2, w2) in enumerate(top_10):
        if i < j:
            overlap = len(set(w1) & set(w2))
            print(f"{''.join(c1)} vs {''.join(c2)}: {overlap} shared")

# How many days of unique puzzles?
print(f"\n--- Puzzle Variety ---")
print(f"Viable combinations: {len(viable_combos)}")
if len(viable_combos) > 0:
    print(f"If daily: {len(viable_combos)} days = {len(viable_combos)//30} months")
