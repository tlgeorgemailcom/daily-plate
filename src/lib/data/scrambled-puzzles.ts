// Scrambled puzzle data - precomputed viable letter combinations
// Each puzzle has 10-16 valid food words

import type { FoodGroup } from './food-portions';
import scrambledWordsCsv from './scrambled-words.csv?raw';
import scrambledWordsCombinedCsv from './scrambled-words-combined.csv?raw';

// Game levels
// usda: Official USDA food names only
// foodie: USDA + international foods (excludes wine & bar)
// foodie21: Full experience including wine & spirits
export type GameLevel = 'usda' | 'foodie' | 'foodie21';

// Groups to exclude from FOODIE level (alcohol-related)
const ALCOHOL_GROUPS = new Set(['wine', 'bar']);

// Parse CSV into word list
// Format: word,groups (groups separated by |)
function parseWordsCsv(csv: string): Array<{ word: string; groups: FoodGroup[] }> {
  const lines = csv.trim().split('\n');
  // Skip header row
  return lines.slice(1).map(line => {
    const [word, groupsStr] = line.split(',');
    const groups = groupsStr.trim().split('|').map(g => g.trim()) as FoodGroup[];
    return { word: word.trim(), groups };
  });
}

// Load word lists from CSV files
const usdaWordList = parseWordsCsv(scrambledWordsCsv);
const combinedWordList = parseWordsCsv(scrambledWordsCombinedCsv);

// Convert to Map for efficient lookup (USDA level)
export const FOOD_WORDS = new Map<string, { word: string; groups: FoodGroup[] }>(
  usdaWordList.map(entry => [entry.word, { word: entry.word, groups: entry.groups }])
);

// FOODIE level words - combined list excluding wine & bar groups
const foodieWords = combinedWordList.filter(entry => 
  !entry.groups.some(g => ALCOHOL_GROUPS.has(g))
);
export const FOODIE_WORDS = new Map<string, { word: string; groups: FoodGroup[] }>(
  foodieWords.map(entry => [entry.word, { word: entry.word, groups: entry.groups }])
);

// FOODIE 21+ level words - full combined list including wine & bar
export const FOODIE_21_WORDS = new Map<string, { word: string; groups: FoodGroup[] }>(
  combinedWordList.map(entry => [entry.word, { word: entry.word, groups: entry.groups }])
);

// Get word map for a level
export function getWordsForLevel(level: GameLevel): Map<string, { word: string; groups: FoodGroup[] }> {
  switch (level) {
    case 'foodie21': return FOODIE_21_WORDS;
    case 'foodie': return FOODIE_WORDS;
    default: return FOOD_WORDS;
  }
}

// Check if a word can be made from the given letters (with letter reuse)
export function canMakeWord(word: string, letters: Set<string>): boolean {
  return [...word].every(char => letters.has(char));
}

// Get all valid words for a set of letters (minimum 3 letters)
export function getValidWords(letters: Set<string>, level: GameLevel = 'usda'): string[] {
  const wordMap = getWordsForLevel(level);
  const valid: string[] = [];
  for (const word of wordMap.keys()) {
    if (word.length >= 3 && canMakeWord(word, letters)) {
      valid.push(word);
    }
  }
  return valid.sort();
}

// Get food groups for a word
export function getWordGroups(word: string, level: GameLevel = 'usda'): FoodGroup[] {
  const wordMap = getWordsForLevel(level);
  return wordMap.get(word)?.groups ?? [];
}

// Verified letter combinations per game level.
// Each set is independently validated against that level's word list (10+ valid food words).
// 420 entries each = ~14 months before cycling. Ordered to minimize adjacent-day word overlap.
// USDA level (796 words) — 10-25 valid words per combo
export const PUZZLE_COMBOS_USDA: string[] = [
'AEFIKLPT',
  'ABCEMNOR',
  'ADEILMOS',
  'ACIOPRST',
  'ACEIKLPR',
  'ABCDENOR',
  'ADEILMST',
  'AINOPRST',
  'ACEKLMPR',
  'ABCEGNOR',
  'ABEFLMST',
  'AILOPRST',
  'ADEIKLMP',
  'ABCEKNOR',
  'ABEFLMOT',
  'AILNOPST',
  'ACEILMPR',
  'ABCKNORT',
  'ADEHMPST',
  'EGIKLNOP',
  'ACDELORS',
  'ABCNORST',
  'ABEFLMPT',
  'ACEIKNPR',
  'ADELMORS',
  'ABCINORT',
  'AEFKLMPT',
  'ACEINPRS',
  'ABEILMOS',
  'ABCLNORT',
  'ADEFLMPT',
  'CEIKNOPR',
  'AEGLMNOS',
  'ACILOPRT',
  'AEFKLPST',
  'ABCEINOR',
  'ADELMNOS',
  'AEIKOPRT',
  'AEFILMOT',
  'ABCLMNOR',
  'ADEHLMPS',
  'ACEIKOPR',
  'AEILMNOT',
  'ABDEORST',
  'AEHKLMPS',
  'ACEKNOPR',
  'AEFLMNOT',
  'ABEIPRST',
  'ADEKLMPS',
  'ACEIKNOR',
  'ABEILMOT',
  'ABEINPRS',
  'ADEFKLST',
  'ACINOPRT',
  'AEGLMORS',
  'ABCEINPR',
  'ADEKLPST',
  'ACILNORT',
  'AEFILMST',
  'ABCEKOPR',
  'ACEIKLNP',
  'ACEILORT',
  'ADEFLMST',
  'ABCILNOR',
  'ACEKLNPR',
  'AEKOPRST',
  'ABDELMST',
  'ABEGLNOR',
  'CEIKLNOP',
  'ACEOPRST',
  'ABEILMST',
  'ABCELNOR',
  'AEFILNPT',
  'ADEOPRST',
  'AEIKLMST',
  'ACEILNOR',
  'AEGLNOPS',
  'ABDEIPRT',
  'AEFKLMST',
  'ACELMNOR',
  'AEGNOPST',
  'ABCEIPRT',
  'ADEKLMST',
  'ACDELNOR',
  'AEGILNOP',
  'ABCEKORT',
  'ADEHLMST',
  'ACEFLNOR',
  'AEINOPST',
  'ABCEINRT',
  'ADELMPRS',
  'ACEFKLOR',
  'AILMOPST',
  'ABEGNORT',
  'ACEILNPR',
  'ACEKLMOR',
  'ADEMOPST',
  'ABCHNORT',
  'ACEILNPS',
  'ACDEKLOR',
  'ABEMOPST',
  'ABCNOPRT',
  'AEILNPRS',
  'ACEIKLOR',
  'AEHILMST',
  'ABCMNORT',
  'AEINPRST',
  'ACEKLORS',
  'AEFGLMST',
  'ABCENORT',
  'AEILMNOP',
  'ACEKLOPR',
  'ADEGLMST',
  'ABCEORST',
  'ACEINOPT',
  'AEIKLOPR',
  'AEGILMST',
  'ABENORST',
  'ACEINOPR',
  'ADEFLPST',
  'AEKLMORS',
  'ABELMNOT',
  'ACEHNOPR',
  'ADEILPST',
  'ABCEKLOR',
  'ACEILMRT',
  'ACEGNOPR',
  'AEFILPST',
  'ABELMORS',
  'ACEILMOT',
  'ACDENOPR',
  'AEIKLPST',
  'ABEMORST',
  'ACEILORS',
  'ACEMNOPR',
  'AEIKLMPT',
  'ADEMORST',
  'ABCELORS',
  'ABEINOPR',
  'ACEFKLNP',
  'AEHMOPST',
  'ACELORST',
  'ADEILMPT',
  'ABCENOPR',
  'AEFKLNST',
  'AEGMOPST',
  'ABEILMPT',
  'ACEKNORT',
  'AEFKLOST',
  'EIKLNOPR',
  'AEHILMPT',
  'ACEGNORT',
  'ABELMNOS',
  'ABEKLOPR',
  'AEFILMPT',
  'ACEINORT',
  'ACELMORS',
  'ABENOPST',
  'AEIKLPRT',
  'ABEFLMNT',
  'ACELNORS',
  'AEMNOPST',
  'ADEILPRT',
  'ABEKLMST',
  'ACEGLNOR',
  'AEHOPRST',
  'AEILNOPS',
  'ACEKLMST',
  'ABCELMOR',
  'AEGOPRST',
  'ACEILNOP',
  'AEHKLMST',
  'AELMNORS',
  'ABEOPRST',
  'ADEILMPS',
  'ACEKLNOR',
  'ACEFLMOT',
  'ABEINPRT',
  'AEILMNOS',
  'AEGKLPST',
  'ACEMNORT',
  'ABCELOPR',
  'AEHILMPS',
  'AEFKLNPS',
  'ACDENORT',
  'ABELMOST',
  'ACEILPRT',
  'AEIKLNOP',
  'ACEFNORT',
  'ABEGLMST',
  'ADEHLPST',
  'ACEIKLOP',
  'ACENOPRT',
  'AEILMNST',
  'ADELORST',
  'AEHKLPST',
  'ACEINPRT',
  'AEFLMNST',
  'ABELORST',
  'AEIKLMPS',
  'ACEKOPRT',
  'ACELMNOT',
  'AEFLNPST',
  'AEILMORS',
  'ABEIOPRT',
  'ACEKLNOP',
  'AEFHLMST',
  'AEILNPST',
  'ABCEOPRT',
  'AEKLORST',
  'ACEILMST',
  'AEILNOPT',
  'ABCENPRT',
  'ACEKLORT',
  'ADELMOST',
  'AEFILPRT',
  'AEGLNPST',
  'ACELNORT',
  'AEILMOST',
  'ABEILPRT',
  'AEIKLNPS',
  'ACEFLORT',
  'AEGLMOST',
  'AEIOPRST',
  'ACEKLNPS',
  'ACELMOPR',
  'ABELMNST',
  'AEFOPRST',
  'AEILNPRT',
  'ACELMNOS',
  'ABELMORT',
  'AEKLOPST',
  'ACEIOPRT',
  'AEILMNPS',
  'ADELMORT',
  'AEFLOPST',
  'ACELNOPR',
  'ABEILMPS',
  'AEKLMORT',
  'ADELOPST',
  'ACEILOPR',
  'AEFLMNPS',
  'AEILMORT',
  'AEGLOPST',
  'ACEHOPRT',
  'ADELMNPS',
  'AEFLMORT',
  'AEILOPST',
  'ACELOPRS',
  'AEKLMNPS',
  'AELMNORT',
  'AEILPRST',
  'ADELOPRS',
  'AEFKLMPS',
  'ACELMORT',
  'AENOPRST',
  'ADELMRST',
  'AEILMOPS',
  'AEKLOPRS',
  'AEFLNOPT',
  'ABELMRST',
  'ACEILMPS',
  'AEGLORST',
  'AEINOPRT',
  'AEFLMOST',
  'AEKLNPST',
  'ACELMPRS',
  'ABENOPRT',
  'AEHLMOST',
  'ACELNOPS',
  'AEKLMOPR',
  'AEGNOPRT',
  'ADELMNST',
  'ACELOPST',
  'AEILMNPT',
  'AEFLORST',
  'AEGKLMST',
  'ADELPRST',
  'AELMNOPS',
  'ACELOPRT',
  'AEKLMNST',
  'AEFLPRST',
  'ADELMOPS',
  'AEILOPRT',
  'AELMNOST',
  'AEKLPRST',
  'AEFLMNPT',
  'AELNOPRS',
  'ACELMOST',
  'AEKLOPRT',
  'AEILMPST',
  'ADELNPST',
  'ABELMOPS',
  'AEFLOPRT',
  'AEILMOPT',
  'AELNOPST',
  'AEKLMRST',
  'ABELOPRT',
  'AEILMPRT',
  'AEHLOPST',
  'ABELMNPS',
  'AELMORST',
  'ADELMPRT',
  'ABELOPST',
  'AELMNPRS',
  'AEKLMOST',
  'AEFLMPRT',
  'AELOPRST',
  'ABELMPRT',
  'AEILMRST',
  'AELMNOPT',
  'AEMOPRST',
  'AEKLMOPS',
  'AEFLMRST',
  'ABELMOPT',
  'AELNPRST',
  'AELMOPRS',
  'ADELMPST',
  'AEFLMOPT',
  'ACELMPRT',
  'AEGLMOPS',
  'AEKLMPST',
  'ADELMOPT',
  'AELMOPRT',
  'AEHLMOPS',
  'AEFLMPST',
  'AEKLMOPT',
  'AEJLOPST',
  'ACELMOPS',
  'AELMNPST',
  'AEGLMOPT',
  'AELOPQST',
  'AEFLMOPS',
  'ABELMPST',
  'ACELMOPT',
  'AEHLMPST',
  'AEJLMOST',
  'AELMPRST',
  'AELMOPST',
  'AEHLMOPT',
  'AEGLMPST',
  'ACELMPST',
  'AELMOQST',
  'AEJLMPST',
  'AELMPQST'
];

// FOODIE level (~1020 words, no wine/bar) — 10-30 valid words per combo
export const PUZZLE_COMBOS_FOODIE: string[] = [
'ABCENOR',
  'AEKLPST',
  'AIKOPRT',
  'ADELMOS',
  'ABCHNOR',
  'ACEINPR',
  'AIOPRST',
  'ABELMST',
  'ABCLNOR',
  'ACEKNPR',
  'AINOPST',
  'AEFKLST',
  'ABCIORT',
  'ADELMPS',
  'ACENOPR',
  'AILOPST',
  'ABINORT',
  'ADELMST',
  'ACEKOPR',
  'AEIKLPT',
  'ABNORST',
  'AEILMOS',
  'ABCENPR',
  'AEFKLPT',
  'ACNORTU',
  'ABELMOS',
  'ABEINPR',
  'ADEOPST',
  'ACEKORT',
  'AEKLMST',
  'ABINORS',
  'ACELNPR',
  'ACIOPRT',
  'AEFLMST',
  'ABCINOR',
  'AEKLOPR',
  'AINOPRT',
  'AEILMST',
  'ABCNORS',
  'ACELOPR',
  'AEIKPRT',
  'AELMOST',
  'ABCKNOR',
  'AEILNOP',
  'ACEIPRT',
  'AELMORS',
  'ABCMNOR',
  'AEFLMPT',
  'ACENPRT',
  'AEGLMOS',
  'ABCKORT',
  'AEFILPT',
  'ABNOPST',
  'AELMNOS',
  'ABCORTU',
  'AEILMPT',
  'AEOPRST',
  'ACELMOS',
  'ABCNOPR',
  'AEILNPS',
  'AEKOPRT',
  'ABELMOT',
  'ABCNORT',
  'AEILMPS',
  'AEINPRT',
  'AEMOPST',
  'ABNORTU',
  'ADELPST',
  'ABEIPRT',
  'AELMOPS',
  'ABCORST',
  'AEFLNPT',
  'AEIOPRT',
  'AELMPST',
  'ABIORST',
  'ACNOPRT',
  'AELOPRS',
  'AEFLPST',
  'ABMORST',
  'ACENORT',
  'ABENPRT',
  'AEILPST',
  'AELMOPT',
  'ACELORT',
  'ABEORTU',
  'AELMNPS',
  'AELOPST',
  'ACEOPRT',
  'ABENORT',
  'AEILNPT',
  'AELORST',
  'ADELPRT',
  'ABCEORT',
  'AELNPST',
  'AELMORT',
  'AEILPRT',
  'ABEORST',
  'AENOPRT',
  'AELPRST',
  'AEFLPRT',
  'ABEOPRT',
  'AELMPRT',
  'ACELPRT',
  'AEKLPRT',
  'AELOPRT'
];

// FOODIE 21+ level (1239 words) — 10-35 valid words per combo
export const PUZZLE_COMBOS_FOODIE21: string[] = [
'ACELNOP',
  'AILORST',
  'ABEINOR',
  'AEIKLMT',
  'ACEKNPR',
  'ACIORST',
  'ABEGNOR',
  'AEFKLST',
  'ACEINPR',
  'ACIOPST',
  'ABIKORT',
  'ADEKLST',
  'AEINPRS',
  'AILMOPS',
  'ABCEKOR',
  'AEFLMOT',
  'ACENPRT',
  'AILOPST',
  'ABCINOR',
  'ADEILMS',
  'AEIKPRT',
  'AOPRSTU',
  'ABCDNOR',
  'AELMORS',
  'AEIKLPR',
  'AIOPRST',
  'ABCNORU',
  'ADELMST',
  'ACELNPR',
  'AINOPST',
  'ABCKNOR',
  'AEKLMST',
  'ACEIPRT',
  'AILNOPS',
  'ABCENOR',
  'ADELMOS',
  'AEFIPRT',
  'AILNOPT',
  'ABCLNOR',
  'AEKLMOS',
  'AEIPRST',
  'AEGNORT',
  'ABCHNOR',
  'AEILMOS',
  'AEFILPT',
  'AEMNORT',
  'ABCNOPR',
  'AEGLMOS',
  'AEIKLPT',
  'ACEKORT',
  'ABCENPR',
  'AILMOST',
  'AEFKLPT',
  'ACNORTU',
  'ABEKNOR',
  'ALMOPST',
  'AEIKLMP',
  'ACINORT',
  'ABENPRY',
  'AIMOPST',
  'ADELORS',
  'ABCKORT',
  'ABEINPR',
  'AEMOPST',
  'AEGLORS',
  'ABCORTU',
  'AEFILNP',
  'ADEOPST',
  'AEILMST',
  'ABCMNOR',
  'AEINOPR',
  'AEGOPST',
  'AEFLMST',
  'ABCIORT',
  'ACENOPR',
  'AEIOPST',
  'ABELMST',
  'ABNORTU',
  'ACEKLOR',
  'AEINPST',
  'ADELMPS',
  'ABORSTU',
  'ACEKOPR',
  'AEINOPT',
  'AEKLMPS',
  'ABIORST',
  'ACELNOR',
  'ABENRTU',
  'AEHLMPS',
  'ABNOPST',
  'ACELMOR',
  'ABEIPRT',
  'AEGLMST',
  'ABINORS',
  'ACNOPRT',
  'ADEILMP',
  'AELMSTY',
  'ABEKLOR',
  'ACIOPRT',
  'AEILNPS',
  'AELMSTU',
  'ABELMOR',
  'AEOPRST',
  'ACINOPT',
  'AEILMPS',
  'ABELNOR',
  'AEMORST',
  'ACENOPT',
  'AEKLPST',
  'ABCNORS',
  'ALMORST',
  'AEINPRT',
  'AEILMOT',
  'ABCELOR',
  'AEGLMPS',
  'AINOPRT',
  'AEKLOST',
  'ABCEOPR',
  'ABELMPS',
  'ACENORT',
  'AEKLORS',
  'ABENOPR',
  'AEILMPT',
  'AMOPRST',
  'ACELORS',
  'ABEINRT',
  'AEFLMPT',
  'ABMORST',
  'ACELOPR',
  'ABEFNRT',
  'AEHLMST',
  'ABIOPRT',
  'AELOPRS',
  'AENOPST',
  'ACELMOT',
  'ABEORTU',
  'AELMPRS',
  'ABENOPT',
  'AEGLOST',
  'ABEMORT',
  'ACELMOS',
  'AEILNOP',
  'AEFLPST',
  'ABEKORT',
  'AELMOSY',
  'ABCNORT',
  'AEILNPT',
  'AEKOPRT',
  'AELMOSU',
  'ABINORT',
  'AEFLNPT',
  'ACEOPRT',
  'AELMNOS',
  'ABKNORT',
  'AEKLMPT',
  'AEIOPRT',
  'ABELMOS',
  'ABENORT',
  'ADELMPT',
  'AEGOPRT',
  'AELMOST',
  'ABMNORT',
  'AEILPST',
  'AENOPRT',
  'AELMOPS',
  'ABCORST',
  'ABELMOT',
  'ABENPRT',
  'ADELPST',
  'ABCOPRT',
  'AELMNOT',
  'ABELORS',
  'AELMNPS',
  'AEFOPRT',
  'ACELORT',
  'ABNORST',
  'AELMNST',
  'AEILOPT',
  'ABCEORT',
  'ABELNPR',
  'AELMRST',
  'AELOPST',
  'ABEIORT',
  'ADELPRT',
  'AELMNPT',
  'AELORST',
  'ABEORTY',
  'AEHOPRT',
  'AELMPST',
  'AELNOPT',
  'ABEORST',
  'AEKLPRT',
  'AELMORT',
  'AELNPST',
  'ABOPRST',
  'ACELPRT',
  'ABELMPT',
  'AEGLPST',
  'ABNOPRT',
  'ABELOPR',
  'AELMOPT',
  'AELPRST',
  'ABEFORT',
  'AEKLOPT',
  'AEMOPRT',
  'AEILPRT',
  'ABELORT',
  'AEFLOPT',
  'AELMPRT',
  'AEGLPRT'
];

// Legacy alias kept for any external code that referenced PUZZLE_COMBOS
export const PUZZLE_COMBOS = PUZZLE_COMBOS_USDA;

// Get the right combo list for a given level
function getPuzzleCombos(level: GameLevel): string[] {
  switch (level) {
    case 'foodie21': return PUZZLE_COMBOS_FOODIE21;
    case 'foodie':   return PUZZLE_COMBOS_FOODIE;
    default:         return PUZZLE_COMBOS_USDA;
  }
}

// Starting offsets spread the three levels across their combo rings.
//   USDA      45 combos -> offset   0
//   FOODIE   105 combos -> offset  35  (approx 105/3)
//   FOODIE21 210 combos -> offset  70  (approx 210/3)
function getLevelOffset(level: GameLevel): number {
  switch (level) {
    case 'foodie':   return 35;
    case 'foodie21': return 70;
    default:         return 0;
  }
}

// Get days since the game epoch (2025-01-01), giving a unique sequential
// integer per calendar day. This is the puzzle index — no arithmetic collisions.
function daysSinceEpoch(date: Date): number {
  const epoch = Date.UTC(2025, 0, 1);
  const d = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((d - epoch) / 86400000);
}

// Per-level minimum word counts.
// USDA caps at ~24 words per 7-letter combo (796-word dict), so 15 is the
// practical floor that still gives 86/420 qualifying combos (avg scan ≈ 5).
// FOODIE / FOODIE21 have larger dictionaries and can hit 20 consistently.
const MIN_WORDS: Record<GameLevel, number> = { usda: 22, foodie: 20, foodie21: 20 };

// Resolve a puzzle for a given date + level, enforcing:
//   1. Minimum word count per level (see MIN_WORDS above)
//   2. Strict cross-level exclusion (cascade):
//      USDA:     picks the first combo (from base index) with enough words
//      FOODIE:   picks the first combo with enough words AND zero overlap
//                with that day's USDA word set
//      FOODIE21: picks the first combo with enough words AND zero overlap
//                with the UNION of USDA + FOODIE resolved word sets
//
// If no combo satisfies both constraints, falls back to the combo
// that has the fewest overlaps (still respecting the word-count floor).
// In the pathological case where no combo meets the word-count floor,
// returns the combo with the most words as a last resort.
function resolvePuzzle(date: Date, level: GameLevel): { letters: string[]; validWords: string[] } {
  const dayIdx = daysSinceEpoch(date);
  const combos = getPuzzleCombos(level);
  const baseIdx = (dayIdx + getLevelOffset(level)) % combos.length;

  if (level === 'usda') {
    // No exclusion needed — scan forward for first combo meeting the word-count floor
    let lastResort: { letters: string[]; validWords: string[] } | null = null;
    for (let i = 0; i < combos.length; i++) {
      const letters = combos[(baseIdx + i) % combos.length].toLowerCase().split('');
      const validWords = getValidWords(new Set(letters), 'usda');
      if (validWords.length >= MIN_WORDS['usda']) return { letters, validWords };
      if (!lastResort || validWords.length > lastResort.validWords.length) lastResort = { letters, validWords };
    }
    return lastResort!;
  }

  // Cascade: build the exclusion set for this level.
  // FOODIE:   must not repeat any USDA words
  // FOODIE21: must not repeat any USDA *or* FOODIE words — both are excluded
  //           (a word in USDA but not FOODIE, like 'eel', still can't appear
  //            in FOODIE21 since the player may be comparing across all levels)
  let excludeWords: Set<string>;
  if (level === 'foodie') {
    excludeWords = new Set(resolvePuzzle(date, 'usda').validWords);
  } else {
    // foodie21: union of USDA + FOODIE resolved word sets
    const usdaWords = resolvePuzzle(date, 'usda').validWords;
    const foodieWords = resolvePuzzle(date, 'foodie').validWords;
    excludeWords = new Set([...usdaWords, ...foodieWords]);
  }

  // Walk forward: find the best combo where (validWords minus excludeWords) >= MIN_WORDS[level].
  // We ALWAYS strip excludeWords from the returned validWords so shared words (like 'eel') can
  // never bleed across levels, even in the fallback case.
  let best: { letters: string[]; validWords: string[]; netCount: number } | null = null;
  let lastResort: { letters: string[]; validWords: string[] } | null = null;
  for (let i = 0; i < combos.length; i++) {
    const letters = combos[(baseIdx + i) % combos.length].toLowerCase().split('');
    const allWords = getValidWords(new Set(letters), level);
    const netWords = allWords.filter(w => !excludeWords.has(w));
    if (netWords.length >= MIN_WORDS[level]) {
      // Perfect: enough words remain after exclusion — take the first one found
      if (!best || netWords.length > best.netCount) best = { letters, validWords: netWords, netCount: netWords.length };
      if (best) break; // take the first qualifying combo (greedy, minimises scan distance)
    }
    if (!lastResort || allWords.length > lastResort.validWords.length) lastResort = { letters, validWords: allWords };
  }

  // Return best (words already filtered), or last resort (filter what we can)
  if (best) return { letters: best.letters, validWords: best.validWords };
  if (lastResort) return { letters: lastResort.letters, validWords: lastResort.validWords.filter(w => !excludeWords.has(w)) };
  return { letters: [], validWords: [] };
}

// Get today's puzzle based on date and level.
export function getTodaysPuzzle(level: GameLevel = 'usda'): { letters: string[]; validWords: string[]; date: string; level: GameLevel } {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
  const { letters, validWords } = resolvePuzzle(today, level);
  return { letters, validWords, date: dateStr, level };
}

// Get puzzle for a specific date (for testing/archives)
export function getPuzzleForDate(date: Date, level: GameLevel = 'usda'): { letters: string[]; validWords: string[]; date: string; level: GameLevel } {
  const dateStr = date.toISOString().split('T')[0];
  const { letters, validWords } = resolvePuzzle(date, level);
  return { letters, validWords, date: dateStr, level };
}


// Group display info for classification phase
export const FOOD_GROUP_INFO: Record<FoodGroup, { emoji: string; label: string; hint: string }> = {
  vegetable: { emoji: '🥬', label: 'Vegetable', hint: 'Leafy greens, roots, stems' },
  fruit: { emoji: '🍎', label: 'Fruit', hint: 'Sweet produce with seeds' },
  grain: { emoji: '🌾', label: 'Grain', hint: 'Wheat, rice, oats, bread' },
  protein: { emoji: '🥩', label: 'Protein', hint: 'Meat, fish, poultry, eggs' },
  dairy: { emoji: '🥛', label: 'Dairy', hint: 'Milk, cheese, yogurt' },
  legume: { emoji: '🫘', label: 'Legume', hint: 'Beans, lentils, peas in pods' },
  nuts: { emoji: '🥜', label: 'Nuts & Seeds', hint: 'Tree nuts, seeds' },
  fats: { emoji: '🧈', label: 'Fats & Oils', hint: 'Butter, oil, lard' },
  spice: { emoji: '🌿', label: 'Spices & Condiments', hint: 'Basil, pepper, cinnamon, ketchup, mayo' },
  prepared: { emoji: '🍳', label: 'Prepared', hint: 'Cooked dishes, lasagna, casseroles' },
  condiment: { emoji: '🌿', label: 'Spices & Condiments', hint: 'Basil, pepper, cinnamon, ketchup, mayo' },
  beverage: { emoji: '🍵', label: 'Beverage', hint: 'Drinks, tea, coffee' },
  wine: { emoji: '🍷', label: 'Wine', hint: 'Red, white, sparkling wines' },
  bar: { emoji: '🍸', label: 'Bar', hint: 'Spirits, cocktails, beer' }
};
