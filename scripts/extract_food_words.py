#!/usr/bin/env python3
"""
Extract single-word food names from USDA DataCentralCombo.csv
for the Daily Food Chain game.
"""

import csv
import json
import unicodedata

def remove_accents(text):
    """Remove accented characters, converting to ASCII equivalent."""
    normalized = unicodedata.normalize('NFD', text)
    return ''.join(c for c in normalized if unicodedata.category(c) != 'Mn')

def extract_single_food_words(csv_path):
    """Extract single-word food names from the Long_Desc column."""
    single_words = set()
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            desc = row.get('Long_Desc', '')
            
            # Get the first word before any comma (usually the main food name)
            if ',' in desc:
                first_part = desc.split(',')[0].strip()
            else:
                first_part = desc.strip()
            
            # Check if it's a single word (no spaces)
            if first_part and ' ' not in first_part:
                # Clean: uppercase, remove accents
                word = remove_accents(first_part.upper())
                
                # Only keep if it's purely alphabetic and at least 3 chars
                if word.isalpha() and len(word) >= 3:
                    single_words.add(word)
    
    return sorted(single_words)

def main():
    csv_path = '/Users/macminidata/Downloads/DataCentralCombo.csv'
    
    words = extract_single_food_words(csv_path)
    
    print(f"Found {len(words)} single-word foods")
    print("\nFirst 50 words:")
    for w in words[:50]:
        print(f"  {w}")
    
    print("\n...")
    
    print("\nLast 20 words:")
    for w in words[-20:]:
        print(f"  {w}")
    
    # Save to JSON for the Svelte app
    output_path = '/Volumes/training/Daily Food Chain/daily-food-chain/src/lib/data/food-words.json'
    with open(output_path, 'w') as f:
        json.dump(words, f, indent=2)
    
    print(f"\nSaved to: {output_path}")

if __name__ == '__main__':
    main()
