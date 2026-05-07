<script lang="ts">
  import { playerStore } from '$lib/stores/playerStore';
  import { getMemberTargets, type MemberProfile, type DRIRow } from '$lib/data/dri';
  import { micronutrientTotals, nutrientTotals, type FoodMicros } from '$lib/stores/gameStore';
  import { getMicrosForGrams } from '$lib/data/food-micros';
  import { browser } from '$app/environment';

  type Props = { onClose: () => void; memberProfile?: MemberProfile | null };
  let { onClose, memberProfile = null }: Props = $props();

  const driRow = $derived(memberProfile ? (getMemberTargets(memberProfile)?.driRow ?? null) : null);

  // Live micronutrient totals from today's plate (per FoodMicros, per 100g-scaled)
  const microTotals = $derived(browser ? $micronutrientTotals : {} as FoodMicros);

  // Helper: get a DRI target value with optional unit-scale conversion.
  // Returns null when no member profile is available.
  function dt(key: keyof DRIRow, scale = 1): number | null {
    if (!driRow) return null;
    const v = driRow[key];
    return typeof v === 'number' ? v * scale : null;
  }

  let activeTab: 'trends' | 'nutrient' | 'food' = $state('trends');
  let rangeDays: 7 | 14 | 30 = $state(30);
  let expandedFood    = $state<string | null>(null);
  let expandedNutrOcc = $state<string | null>(null);

  // ── Date navigation ──────────────────────────────────────────────────────
  const _today = new Date(); _today.setHours(0, 0, 0, 0);
  function _isoStr(d: Date): string { return d.toISOString().slice(0, 10); }
  function _addDays(d: Date, n: number): Date { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
  const todayIso     = _isoStr(_today);
  const yesterdayIso = _isoStr(_addDays(_today, -1));
  const minDateIso   = _isoStr(_addDays(_today, -29));
  const maxDateIso   = _isoStr(_addDays(_today, 14));  // 14-day planning horizon
  function isFuture(dateStr: string): boolean { return dateStr > todayIso; }

  let viewMode: 'range' | 'day' = $state('range');
  let selectedDate: string = $state(todayIso);
  function selectToday()           { viewMode = 'day'; selectedDate = todayIso; }
  function selectYesterday()       { viewMode = 'day'; selectedDate = yesterdayIso; }

  // macroTotals / mc: return today's live data when viewing today or a range (which includes today),
  // or zeros for past/future dates that have no stored history yet.
  const macroTotals = $derived(
    browser && (viewMode === 'range' || selectedDate === todayIso)
      ? $nutrientTotals
      : { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, water: 0, sugar: 0 }
  );

  // Returns 0 for any specific date other than today (no historical data yet).
  function mc(key: keyof FoodMicros, dec = 1): number {
    const isShowingToday = viewMode === 'range' || selectedDate === todayIso;
    const v = isShowingToday ? ((microTotals as Record<string, number>)[key as string] ?? 0) : 0;
    return parseFloat(v.toFixed(dec));
  }
  function selectPick(v: string)   { if (v) { viewMode = 'day'; selectedDate = v; } }
  function toggleExpand(symptom: string, foodName: string) {
    const key = `${symptom}:${foodName}`;
    expandedFood = expandedFood === key ? null : key;
  }

  // ── Tier gate ────────────────────────────────────────────────────────────────
  // TODO: remove DEV_BYPASS before release
  const DEV_BYPASS = false;
  let isAllin = $derived(DEV_BYPASS || ['allin', 'moderator'].includes($playerStore.tier));

  // ── Per-symptom food correlation data ──────────────────────────────────────
  // For each unique symptom, foods eaten in the LAG_DAYS-day window before each
  // occurrence. inNofM = how many occurrences had this food in that window.
  // TODO: replace with real API — aggregate daily_meal_log joined to daily_notes
  const LAG_DAYS = 3;

  // ── Symptom trigger watch-list ─────────────────────────────────────────────
  type TriggerEntry = {
    label: string;
    ndbId?: number;
    note: string;
    unit?: string;
    nutrientKey?: string;
    inferred?: string;
  };

  const SYMPTOM_TRIGGERS: Record<string, TriggerEntry[]> = {
    // ── Other Symptoms ──────────────────────────────────────────────────────
    'Bloated after Meals': [
      { label: 'Lactose',   ndbId: 213, note: 'Dairy intolerance trigger',           nutrientKey: 'lactose',  unit: 'g'  },
      { label: 'Sugar',     ndbId: 269, note: 'Fructose malabsorption',              nutrientKey: 'sugar',    unit: 'g'  },
      { label: 'Fiber',     ndbId: 291, note: 'Ferments in gut (FODMAPs)',           nutrientKey: 'fiber',    unit: 'g'  },
      { label: 'Sodium',    ndbId: 307, note: 'Water retention and bloating',        nutrientKey: 'sodium',   unit: 'mg' },
      { label: 'Gluten',                note: 'Wheat/rye/barley sensitivity',        inferred: 'gluten'                  },
    ],
    'Headache/migraine': [
      { label: 'Caffeine',  ndbId: 262, note: 'Vasodilation or withdrawal trigger',  nutrientKey: 'caffeine', unit: 'mg' },
      { label: 'Tyramine',              note: 'Aged cheese, red wine, fermented',    inferred: 'tyramine'                },
      { label: 'Histamine',             note: 'Wine, cured meats, leftovers',        inferred: 'histamine'               },
      { label: 'Sodium',    ndbId: 307, note: 'Blood pressure / dehydration',        nutrientKey: 'sodium',   unit: 'mg' },
    ],
    'Migraine episode': [
      { label: 'Caffeine',  ndbId: 262, note: 'Withdrawal or excess — common trigger', nutrientKey: 'caffeine', unit: 'mg' },
      { label: 'Tyramine',              note: 'Aged cheese, red wine, fermented',    inferred: 'tyramine'                },
      { label: 'Histamine',             note: 'Wine, cured meats, leftovers',        inferred: 'histamine'               },
      { label: 'Sodium',    ndbId: 307, note: 'Dehydration and BP spikes',           nutrientKey: 'sodium',   unit: 'mg' },
    ],
    'Nausea/stomach upset': [
      { label: 'Alcohol',               note: 'Direct gastrointestinal irritant'                                        },
      { label: 'Caffeine',  ndbId: 262, note: 'Acidic — especially on empty stomach', nutrientKey: 'caffeine', unit: 'mg' },
      { label: 'Lactose',   ndbId: 213, note: 'Dairy intolerance reaction',           nutrientKey: 'lactose',  unit: 'g'  },
      { label: 'Gluten',                note: 'NCGS / sensitivity reaction',          inferred: 'gluten'                  },
      { label: 'Histamine',             note: 'Fermented/aged foods reaction',        inferred: 'histamine'               },
    ],
    'Diarrhea': [
      { label: 'Lactose',   ndbId: 213, note: 'Dairy intolerance — most common',     nutrientKey: 'lactose',  unit: 'g'  },
      { label: 'Gluten',                note: 'Celiac disease trigger',              inferred: 'gluten'                  },
      { label: 'Sugar',     ndbId: 269, note: 'Fructose malabsorption',              nutrientKey: 'sugar',    unit: 'g'  },
      { label: 'Caffeine',  ndbId: 262, note: 'Stimulates gut motility',             nutrientKey: 'caffeine', unit: 'mg' },
      { label: 'Alcohol',               note: 'Gut irritant and motility disruptor'                                      },
    ],
    'Constipation': [
      { label: 'Fiber',     ndbId: 291, note: 'Low intake reduces motility',         nutrientKey: 'fiber',    unit: 'g'  },
      { label: 'Sodium',    ndbId: 307, note: 'High sodium causes dehydration',      nutrientKey: 'sodium',   unit: 'mg' },
      { label: 'Lactose',   ndbId: 213, note: 'Dairy can slow motility in some',     nutrientKey: 'lactose',  unit: 'g'  },
    ],
    'Abdominal Pain': [
      { label: 'Fat',       ndbId: 204, note: 'High fat slows digestion, causes cramping', nutrientKey: 'fat',   unit: 'g'  },
      { label: 'Fiber',     ndbId: 291, note: 'Excess fermentable fiber causes gas pain',  nutrientKey: 'fiber', unit: 'g'  },
      { label: 'Sodium',    ndbId: 307, note: 'High sodium linked to gut inflammation',    nutrientKey: 'sodium', unit: 'mg' },
      { label: 'Lactose',   ndbId: 213, note: 'Dairy intolerance — cramping and pain',     nutrientKey: 'lactose', unit: 'g' },
      { label: 'Gluten',                note: 'Celiac / NCGS — common abdominal trigger', inferred: 'gluten'     },
    ],
    'Heartburn/Acid Reflux': [
      { label: 'Fat',       ndbId: 204, note: 'High fat relaxes lower oesophageal sphincter', nutrientKey: 'fat',  unit: 'g'  },
      { label: 'Carbs',     ndbId: 205, note: 'Refined carbs worsen reflux symptoms',       nutrientKey: 'carbohydrate', unit: 'g' },
      { label: 'Sodium',    ndbId: 307, note: 'High-salt diets associated with reflux',      nutrientKey: 'sodium', unit: 'mg' },
      { label: 'Caffeine',  ndbId: 262, note: 'Relaxes sphincter, increases acid production', nutrientKey: 'caffeine', unit: 'mg' },
      { label: 'Histamine',             note: 'Tomatoes, wine, fermented foods',            inferred: 'histamine'  },
    ],
    'Dizziness': [
      { label: 'Sugar',     ndbId: 269, note: 'Hypoglycaemia (low blood sugar)',     nutrientKey: 'sugar',    unit: 'g'  },
      { label: 'Sodium',    ndbId: 307, note: 'Low sodium → orthostatic hypotension', nutrientKey: 'sodium',  unit: 'mg' },
      { label: 'Iron',      ndbId: 303, note: 'Anaemia-related dizziness',           nutrientKey: 'iron',     unit: 'mg' },
      { label: 'Caffeine',  ndbId: 262, note: 'Blood pressure fluctuations',         nutrientKey: 'caffeine', unit: 'mg' },
    ],
    'Gout': [
      { label: 'Alcohol',               note: 'Beer especially raises uric acid'                                         },
      { label: 'Sugar',     ndbId: 269, note: 'Fructose drives uric acid spike',     nutrientKey: 'sugar',    unit: 'g'  },
      { label: 'Purines',               note: 'Organ meats, shellfish, red meat'                                         },
    ],
    'Rash': [
      { label: 'Histamine',             note: 'Wine, aged foods, fermented items',   inferred: 'histamine'               },
      { label: 'Gluten',                note: 'Dermatitis herpetiformis (celiac)',   inferred: 'gluten'                  },
      { label: 'Sulfites',              note: 'Wine, dried fruit, preservatives',    inferred: 'histamine'               },
    ],
    'Food reaction/allergy': [
      { label: 'Histamine',             note: 'Wine, aged foods, fermented items',   inferred: 'histamine'               },
      { label: 'Gluten',                note: 'Wheat allergy / celiac',              inferred: 'gluten'                  },
      { label: 'Lactose',   ndbId: 213, note: 'Dairy intolerance reaction',          nutrientKey: 'lactose',  unit: 'g'  },
      { label: 'Tyramine',              note: 'Aged/fermented food sensitivity',     inferred: 'tyramine'                },
    ],
    'Heart palpitations': [
      { label: 'Caffeine',  ndbId: 262, note: 'Stimulant — main dietary trigger',   nutrientKey: 'caffeine', unit: 'mg' },
      { label: 'Alcohol',               note: 'Arrhythmia trigger'                                                       },
      { label: 'Sugar',     ndbId: 269, note: 'Glucose spike can trigger episodes', nutrientKey: 'sugar',    unit: 'g'  },
      { label: 'Tyramine',              note: 'Stimulant amines from aged foods',   inferred: 'tyramine'                },
      { label: 'Sodium',    ndbId: 307, note: 'Affects blood pressure rhythm',      nutrientKey: 'sodium',   unit: 'mg' },
    ],
    'Blood pressure issue': [
      { label: 'Sodium',    ndbId: 307, note: 'Primary dietary driver of high BP',  nutrientKey: 'sodium',   unit: 'mg' },
      { label: 'Caffeine',  ndbId: 262, note: 'Transient BP spike',                 nutrientKey: 'caffeine', unit: 'mg' },
      { label: 'Alcohol',               note: 'Chronic intake raises blood pressure'                                     },
      { label: 'Sugar',     ndbId: 269, note: 'Metabolic syndrome link',            nutrientKey: 'sugar',    unit: 'g'  },
    ],
    'Autoimmune flare': [
      { label: 'Gluten',                note: 'Autoimmune trigger — celiac / NCGS', inferred: 'gluten'                  },
      { label: 'Sugar',     ndbId: 269, note: 'Pro-inflammatory foods',             nutrientKey: 'sugar',    unit: 'g'  },
      { label: 'Histamine',             note: 'Mast cell activation',               inferred: 'histamine'               },
    ],
    'Back pain': [
      { label: 'Sugar',     ndbId: 269, note: 'Systemic inflammation',              nutrientKey: 'sugar',    unit: 'g'  },
      { label: 'Alcohol',               note: 'Inflammatory and muscle tension'                                          },
      { label: 'Sodium',    ndbId: 307, note: 'Water retention adds pressure',      nutrientKey: 'sodium',   unit: 'mg' },
    ],
    'Breathing difficulties': [
      { label: 'Histamine',             note: 'Histamine intolerance / allergy',    inferred: 'histamine'               },
      { label: 'Sulfites',              note: 'Wine, dried fruit, preservatives',   inferred: 'histamine'               },
      { label: 'Gluten',                note: 'Wheat allergy — respiratory form',   inferred: 'gluten'                  },
    ],
    'Chest pain': [
      { label: 'Caffeine',  ndbId: 262, note: 'Can trigger GERD or angina',         nutrientKey: 'caffeine', unit: 'mg' },
      { label: 'Alcohol',               note: 'Arrhythmia / acid reflux trigger'                                        },
      { label: 'Tyramine',              note: 'Vasopressor effect',                 inferred: 'tyramine'                },
    ],
    'Cough': [
      { label: 'Lactose',   ndbId: 213, note: 'Increases mucus production in some', nutrientKey: 'lactose',  unit: 'g'  },
      { label: 'Histamine',             note: 'Wine, aged/fermented foods',         inferred: 'histamine'               },
      { label: 'Caffeine',  ndbId: 262, note: 'Acid reflux irritation',             nutrientKey: 'caffeine', unit: 'mg' },
    ],
    'Hearing issues': [
      { label: 'Sodium',    ndbId: 307, note: "Ménière's disease — fluid retention", nutrientKey: 'sodium',  unit: 'mg' },
      { label: 'Caffeine',  ndbId: 262, note: 'Tinnitus associated with excess',    nutrientKey: 'caffeine', unit: 'mg' },
      { label: 'Alcohol',               note: 'Ototoxic in excess'                                                       },
    ],
    'Joint/muscle pain': [
      { label: 'Sugar',     ndbId: 269, note: 'Pro-inflammatory',                   nutrientKey: 'sugar',    unit: 'g'  },
      { label: 'Gluten',                note: 'Inflammatory cascade in sensitive',  inferred: 'gluten'                  },
      { label: 'Alcohol',               note: 'Inflammatory effect'                                                      },
      { label: 'Sodium',    ndbId: 307, note: 'Fluid retention → pressure on joints', nutrientKey: 'sodium', unit: 'mg' },
    ],
    'Swollen joints/hands': [
      { label: 'Sodium',    ndbId: 307, note: 'Water retention and swelling',       nutrientKey: 'sodium',   unit: 'mg' },
      { label: 'Sugar',     ndbId: 269, note: 'Pro-inflammatory',                   nutrientKey: 'sugar',    unit: 'g'  },
      { label: 'Gluten',                note: 'Autoimmune/inflammatory trigger',    inferred: 'gluten'                  },
      { label: 'Alcohol',               note: 'Inflammatory effect'                                                      },
    ],
    'Vision problems': [
      { label: 'Sugar',     ndbId: 269, note: 'High glucose affects retinal vessels', nutrientKey: 'sugar',  unit: 'g'  },
      { label: 'Sodium',    ndbId: 307, note: 'Blood pressure effect on vision',    nutrientKey: 'sodium',   unit: 'mg' },
      { label: 'Alcohol',               note: 'Optic nerve toxicity in excess'                                           },
    ],
    'Weakness': [
      { label: 'Iron',      ndbId: 303, note: 'Anaemia — most common dietary cause', nutrientKey: 'iron',    unit: 'mg' },
      { label: 'Sugar',     ndbId: 269, note: 'Hypoglycaemia — low blood sugar',    nutrientKey: 'sugar',    unit: 'g'  },
      { label: 'Sodium',    ndbId: 307, note: 'Hyponatremia (very low sodium)',     nutrientKey: 'sodium',   unit: 'mg' },
      { label: 'Protein',               note: 'Insufficient calorie/protein intake'                                      },
    ],
    // ── Health & Mood ────────────────────────────────────────────────────────
    'Anxious/worried': [
      { label: 'Caffeine',  ndbId: 262, note: 'Simulates and exacerbates anxiety',  nutrientKey: 'caffeine', unit: 'mg' },
      { label: 'Sugar',     ndbId: 269, note: 'Blood sugar swings → anxiety spikes', nutrientKey: 'sugar',   unit: 'g'  },
      { label: 'Alcohol',               note: 'Rebound anxiety post-consumption'                                         },
      { label: 'Tyramine',              note: 'Stimulant amines in aged foods',     inferred: 'tyramine'                },
    ],
    'Brain fog': [
      { label: 'Sugar',     ndbId: 269, note: 'Glucose crash impairs cognition',    nutrientKey: 'sugar',    unit: 'g'  },
      { label: 'Gluten',                note: 'Neurological symptom in NCGS/celiac', inferred: 'gluten'                 },
      { label: 'Alcohol',               note: 'Direct neurotoxic effect'                                                 },
      { label: 'Histamine',             note: 'Histamine intolerance — cognitive',  inferred: 'histamine'               },
    ],
    'Irritable/angry': [
      { label: 'Sugar',     ndbId: 269, note: 'Glucose swings affect mood',         nutrientKey: 'sugar',    unit: 'g'  },
      { label: 'Caffeine',  ndbId: 262, note: 'Over-stimulation',                   nutrientKey: 'caffeine', unit: 'mg' },
      { label: 'Alcohol',               note: 'Disinhibition and hangover rebound'                                       },
    ],
    'Mood swings': [
      { label: 'Sugar',     ndbId: 269, note: 'Glycaemic swings drive mood changes', nutrientKey: 'sugar',   unit: 'g'  },
      { label: 'Caffeine',  ndbId: 262, note: 'Stimulant highs and lows',            nutrientKey: 'caffeine', unit: 'mg' },
      { label: 'Alcohol',               note: 'Depressant rebound effect'                                                },
      { label: 'Gluten',                note: 'Gut-brain axis in celiac/NCGS',      inferred: 'gluten'                  },
    ],
    'Sad/depressed': [
      { label: 'Sugar',     ndbId: 269, note: 'Inflammatory — affects neurotransmitters', nutrientKey: 'sugar', unit: 'g' },
      { label: 'Alcohol',               note: 'CNS depressant'                                                           },
      { label: 'Gluten',                note: 'Gut-brain axis in sensitive',        inferred: 'gluten'                  },
    ],
    'Drowsy/sluggish': [
      { label: 'Sugar',     ndbId: 269, note: 'Post-meal glucose crash',            nutrientKey: 'sugar',    unit: 'g'  },
      { label: 'Alcohol',               note: 'Sedative effect'                                                          },
    ],
    // ── Sleep & Energy ───────────────────────────────────────────────────────
    'Daytime fatigue': [
      { label: 'Sugar',     ndbId: 269, note: 'Glucose spike/crash cycle',          nutrientKey: 'sugar',    unit: 'g'  },
      { label: 'Iron',      ndbId: 303, note: 'Iron deficiency anaemia',            nutrientKey: 'iron',     unit: 'mg' },
      { label: 'Gluten',                note: 'Celiac / NCGS energy drain',         inferred: 'gluten'                  },
      { label: 'Alcohol',               note: 'Disrupts sleep quality'                                                   },
    ],
    'Low energy': [
      { label: 'Sugar',     ndbId: 269, note: 'Glucose spike/crash',                nutrientKey: 'sugar',    unit: 'g'  },
      { label: 'Iron',      ndbId: 303, note: 'Iron deficiency fatigue',            nutrientKey: 'iron',     unit: 'mg' },
      { label: 'Gluten',                note: 'Celiac / NCGS symptom',              inferred: 'gluten'                  },
    ],
    'Insomnia': [
      { label: 'Caffeine',  ndbId: 262, note: 'Stimulant — timing is critical',     nutrientKey: 'caffeine', unit: 'mg' },
      { label: 'Alcohol',               note: 'Disrupts sleep architecture'                                              },
      { label: 'Sugar',     ndbId: 269, note: 'Blood sugar spikes disrupt sleep',   nutrientKey: 'sugar',    unit: 'g'  },
      { label: 'Tyramine',              note: 'Stimulant amines delay sleep onset', inferred: 'tyramine'                },
    ],
    'Poor sleep': [
      { label: 'Caffeine',  ndbId: 262, note: 'Stimulant — avoid after 2 pm',       nutrientKey: 'caffeine', unit: 'mg' },
      { label: 'Alcohol',               note: 'Reduces REM sleep'                                                        },
      { label: 'Sugar',     ndbId: 269, note: 'Glycaemic fluctuations at night',    nutrientKey: 'sugar',    unit: 'g'  },
    ],
    'Sleep issues': [
      { label: 'Caffeine',  ndbId: 262, note: 'Stimulant — timing critical',        nutrientKey: 'caffeine', unit: 'mg' },
      { label: 'Alcohol',               note: 'Disrupts sleep stages'                                                    },
      { label: 'Sugar',     ndbId: 269, note: 'Evening glucose spikes',             nutrientKey: 'sugar',    unit: 'g'  },
    ],
    'Night sweats': [
      { label: 'Alcohol',               note: 'Vasodilator — raises body temperature'                                    },
      { label: 'Caffeine',  ndbId: 262, note: 'Stimulant effect',                   nutrientKey: 'caffeine', unit: 'mg' },
      { label: 'Sugar',     ndbId: 269, note: 'Glycaemic swings affect temperature', nutrientKey: 'sugar',   unit: 'g'  },
    ],
  };

  // ── Nutrient-deviation tab state ───────────────────────────────────────────
  let expandedNutrSig = $state<string | null>(null);
  let expandedOtherSignals = $state<string | null>(null);
  let showNormalInfo  = $state(false);
  let viewingNotes: string | null = $state(null);

  // ── Real notes history ───────────────────────────────────────────────────────
  type NoteRow = {
    id: number;
    note_date: string;
    note_content: string;
    sentiment_flag: string | null;
    symptoms: string | null;
    updated_at: string;
  };
  type StoredSymptom = { id: string; name: string; severity: number; category: string; notes: string };

  let notesLoading = $state(false);
  let realNotesHistory = $state<NoteRow[]>([]);

  $effect(() => {
    if (!browser || !$playerStore.id || !isAllin) return;
    notesLoading = true;
    fetch(`/api/notes?user_id=${$playerStore.id}&history=true&limit=90`)
      .then(r => r.ok ? r.json() : [])
      .then((rows: NoteRow[]) => { realNotesHistory = rows; })
      .catch(() => {})
      .finally(() => { notesLoading = false; });
  });

  // Build symptom name → [{isoDate, date, text}] from notes where at least one symptom has severity > 0
  // Filtered to match the current date range selection (Today / Yesterday / picker / Past Nd)
  const symptomNotes = $derived.by(() => {
    const map: Record<string, { isoDate: string; date: string; text: string }[]> = {};
    // Compute ISO cutoff for range mode; for day mode use the exact selected date
    const cutoff = viewMode === 'range'
      ? _isoStr(_addDays(_today, -(rangeDays - 1)))
      : selectedDate;
    for (const note of realNotesHistory) {
      const nd = note.note_date;
      if (viewMode === 'day' ? nd !== selectedDate : nd < cutoff) continue;
      let parsed: StoredSymptom[] = [];
      try { parsed = note.symptoms ? JSON.parse(note.symptoms as string) : []; } catch { /* skip */ }
      const rated = parsed.filter(s => s.severity > 0);
      if (rated.length === 0) continue;
      const dateLabel = new Date(nd + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      for (const s of rated) {
        (map[s.name] ??= []).push({ isoDate: nd, date: dateLabel, text: note.note_content ?? '' });
      }
    }
    return map;
  });

  // ── Meal log per date (fetched lazily when an occurrence is expanded) ─────
  type MealRow = {
    meal_date: string; meal_category: string; food_id: string; food_name: string;
    quantity_grams: number; kcal: number;
    protein: number; carbohydrate: number; fat: number;
    sugar: number; fiber: number; sodium: number; water: number;
  };
  let mealsByDate = $state<Record<string, MealRow[]>>({});
  let mealLoading = $state<Record<string, boolean>>({});
  let mealError  = $state<Record<string, string>>({});

  async function loadMealsForDate(isoDate: string) {
    if (mealLoading[isoDate]) return;
    mealLoading = { ...mealLoading, [isoDate]: true };
    mealError   = { ...mealError,   [isoDate]: '' };
    const uid = $playerStore.id;
    const url = `/api/meal-log?user_id=${uid}&date=${isoDate}`;
    console.log('[Reports] fetching meals', url);
    try {
      const r = await fetch(url);
      if (!r.ok) {
        const msg = `HTTP ${r.status}`;
        console.error('[Reports] meal-log error', msg);
        mealError   = { ...mealError,   [isoDate]: msg };
        mealsByDate = { ...mealsByDate, [isoDate]: [] };
      } else {
        const data = await r.json();
        console.log('[Reports] meal-log rows', data.rows?.length ?? 0, data.rows);
        mealsByDate = { ...mealsByDate, [isoDate]: (data.rows ?? []) as MealRow[] };
      }
    } catch (e) {
      const msg = String(e);
      console.error('[Reports] meal-log fetch threw', msg);
      mealError   = { ...mealError,   [isoDate]: msg };
      mealsByDate = { ...mealsByDate, [isoDate]: [] };
    } finally {
      mealLoading = { ...mealLoading, [isoDate]: false };
    }
  }

  // Derive per-symptom food-correlation entries (occurrences from real notes;
  // correlatedFoods requires meal-log join — empty until that API is built)
  const perSymptomCorrelations = $derived.by<SymptomCorr[]>(() =>
    Object.entries(symptomNotes)
      .map(([symptom, notes]) => ({ symptom, occurrences: notes.length, correlatedFoods: [] }))
      .sort((a, b) => b.occurrences - a.occurrences)
  );

  // ── Nutrient display metadata ─────────────────────────────────────────────
  const NUTR_META: Record<string, { label: string; unit: string }> = {
    kcal:         { label: 'Calories',     unit: 'kcal' },
    protein:      { label: 'Protein',      unit: 'g' },
    carbohydrate: { label: 'Carbohydrate', unit: 'g' },
    fat:          { label: 'Fat',          unit: 'g' },
    sugar:        { label: 'Sugar',        unit: 'g' },
    fiber:        { label: 'Fiber',        unit: 'g' },
    sodium:       { label: 'Sodium',       unit: 'mg' },
    water:        { label: 'Water',        unit: 'g' },
  };

  const SYMPTOM_NUTRIENT_WATCHLIST: Record<string, string[]> = {
    'Bloated after Meals':    ['fiber', 'sugar', 'carbohydrate', 'sodium'],
    'Headache/migraine':      ['sodium', 'water', 'sugar'],
    'Migraine episode':       ['sodium', 'water', 'protein'],
    'Nausea/stomach upset':   ['fat', 'fiber', 'sugar'],
    'Diarrhea':               ['fat', 'sugar', 'fiber'],
    'Constipation':           ['fiber', 'water'],
    'Abdominal Pain':         ['fat', 'fiber', 'sodium', 'sugar'],
    'Heartburn/Acid Reflux':  ['fat', 'carbohydrate', 'sodium'],
    'Dizziness':              ['sodium', 'water', 'carbohydrate'],
    'Gout':                   ['protein', 'fat'],
    'Rash':                   ['sugar', 'fat'],
    'Food reaction/allergy':  ['protein', 'sodium'],
    'Heart palpitations':     ['sodium', 'sugar', 'carbohydrate'],
    'Blood pressure issue':   ['sodium', 'water'],
    'Autoimmune flare':       ['fat', 'sugar', 'carbohydrate'],
    'Back pain':              ['sodium', 'fiber'],
    'Breathing difficulties': ['sodium', 'water', 'fat'],
    'Chest pain':             ['fat', 'sodium'],
    'Cough':                  ['sodium'],
    'Hearing issues':         ['sodium', 'water'],
    'Joint/muscle pain':      ['protein', 'sodium', 'fat'],
    'Swollen joints/hands':   ['sodium', 'water'],
    'Vision problems':        ['fat', 'sodium'],
    'Weakness':               ['carbohydrate', 'protein', 'water'],
    'Anxious/worried':        ['sugar', 'carbohydrate', 'protein'],
    'Brain fog':              ['sugar', 'fat', 'protein', 'water'],
    'Irritable/angry':        ['sugar', 'carbohydrate'],
    'Mood swings':            ['sugar', 'carbohydrate', 'protein'],
    'Sad/depressed':          ['protein', 'fat', 'sugar'],
    'Drowsy/sluggish':        ['carbohydrate', 'sugar', 'fat'],
    'Daytime fatigue':        ['carbohydrate', 'sugar', 'protein', 'water'],
    'Low energy':             ['carbohydrate', 'protein', 'fat'],
    'Insomnia':               ['sugar', 'carbohydrate', 'protein'],
    'Poor sleep':             ['sugar', 'carbohydrate', 'fat'],
    'Sleep issues':           ['sugar', 'carbohydrate'],
    'Night sweats':           ['sugar', 'sodium', 'carbohydrate'],
  };

  function nutrientTotalsForDate(isoDate: string): Record<string, number> {
    const rows = mealsByDate[isoDate] ?? [];
    return {
      kcal:         rows.reduce((s, r) => s + (r.kcal         ?? 0), 0),
      protein:      rows.reduce((s, r) => s + (r.protein      ?? 0), 0),
      carbohydrate: rows.reduce((s, r) => s + (r.carbohydrate ?? 0), 0),
      fat:          rows.reduce((s, r) => s + (r.fat          ?? 0), 0),
      sugar:        rows.reduce((s, r) => s + (r.sugar        ?? 0), 0),
      fiber:        rows.reduce((s, r) => s + (r.fiber        ?? 0), 0),
      sodium:       rows.reduce((s, r) => s + (r.sodium       ?? 0), 0),
      water:        rows.reduce((s, r) => s + (r.water        ?? 0), 0),
    };
  }

  // ── Full nutrient list — all macros + micros, sorted by % DRI ─────────────
  type NutrEntry = { key: string; label: string; unit: string; driKey?: keyof DRIRow; driScale?: number; isMacro?: boolean };
  const ALL_NUTRIENTS: NutrEntry[] = [
    // Macros (read from MealRow DB columns)
    { key: 'kcal',               label: 'Calories',           unit: 'kcal', driKey: 'kcal',                 driScale: 1,    isMacro: true },
    { key: 'protein',            label: 'Protein',             unit: 'g',    driKey: 'protein',              driScale: 1,    isMacro: true },
    { key: 'carbohydrate',       label: 'Carbohydrate',        unit: 'g',    driKey: 'carbohydrate',         driScale: 1,    isMacro: true },
    { key: 'fat',                label: 'Fat',                 unit: 'g',    driKey: 'fat',                  driScale: 1,    isMacro: true },
    { key: 'fiber',              label: 'Fiber',               unit: 'g',    driKey: 'fiber',                driScale: 1,    isMacro: true },
    { key: 'sugar',              label: 'Sugar',               unit: 'g',                                                    isMacro: true },
    { key: 'water',              label: 'Water',               unit: 'g',    driKey: 'water',                driScale: 1000, isMacro: true },
    { key: 'sodium',             label: 'Sodium',              unit: 'mg',   driKey: 'sodium',               driScale: 1000, isMacro: true },
    // Vitamins (from food-micros)
    { key: 'vitamin_d',          label: 'Vitamin D',           unit: 'mcg', driKey: 'vitamin_d',        driScale: 1 },
    { key: 'vitamin_b12',        label: 'Vitamin B12',         unit: 'mcg', driKey: 'vitamin_b12',      driScale: 1 },
    { key: 'vitamin_a_rae',      label: 'Vitamin A',           unit: 'mcg', driKey: 'vitamin_a_rae',    driScale: 1 },
    { key: 'vitamin_e',          label: 'Vitamin E',           unit: 'mg',  driKey: 'vitamin_e',        driScale: 1 },
    { key: 'vitamin_k',          label: 'Vitamin K1',          unit: 'mcg', driKey: 'vitamin_k',        driScale: 1 },
    { key: 'vitamin_c',          label: 'Vitamin C',           unit: 'mg',  driKey: 'vitamin_c',        driScale: 1 },
    { key: 'thiamin',            label: 'Thiamin (B1)',        unit: 'mg',  driKey: 'thiamin',          driScale: 1 },
    { key: 'riboflavin',         label: 'Riboflavin (B2)',     unit: 'mg',  driKey: 'riboflavin',       driScale: 1 },
    { key: 'niacin',             label: 'Niacin (B3)',         unit: 'mg',  driKey: 'niacin',           driScale: 1 },
    { key: 'pantothenic_acid',   label: 'Pant. Acid (B5)',     unit: 'mg',  driKey: 'pantothenic_acid', driScale: 1 },
    { key: 'vitamin_b6',         label: 'Vitamin B6',          unit: 'mg',  driKey: 'vitamin_b6',       driScale: 1 },
    { key: 'folate',             label: 'Folate (B9)',         unit: 'mcg', driKey: 'folate',           driScale: 1 },
    { key: 'choline',            label: 'Choline',             unit: 'mg',  driKey: 'choline',          driScale: 1 },
    // Minerals (from food-micros)
    { key: 'phosphorus',         label: 'Phosphorus',          unit: 'mg',  driKey: 'phosphorus', driScale: 1    },
    { key: 'selenium',           label: 'Selenium',            unit: 'mcg', driKey: 'selenium',   driScale: 1    },
    { key: 'potassium',          label: 'Potassium',           unit: 'mg',  driKey: 'potassium',  driScale: 1000 },
    { key: 'magnesium',          label: 'Magnesium',           unit: 'mg',  driKey: 'magnesium',  driScale: 1    },
    { key: 'zinc',               label: 'Zinc',                unit: 'mg',  driKey: 'zinc',       driScale: 1    },
    { key: 'iron',               label: 'Iron',                unit: 'mg',  driKey: 'iron',       driScale: 1    },
    { key: 'calcium',            label: 'Calcium',             unit: 'mg',  driKey: 'calcium',    driScale: 1    },
    { key: 'copper',             label: 'Copper',              unit: 'mg',  driKey: 'copper',     driScale: 0.001 },
    { key: 'manganese',          label: 'Manganese',           unit: 'mg',  driKey: 'manganese',  driScale: 1    },
    { key: 'iodine',             label: 'Iodine',              unit: 'mcg', driKey: 'iodine',     driScale: 1    },
    { key: 'fluoride',           label: 'Fluoride',            unit: 'mg',  driKey: 'fluoride',   driScale: 1    },
    // Fatty acids (from food-micros)
    { key: 'omega3_total',       label: 'Omega-3 Total',       unit: 'g' },
    { key: 'epa',                label: 'EPA (Ω3)',            unit: 'g' },
    { key: 'dha',                label: 'DHA (Ω3)',            unit: 'g' },
    { key: 'linoleic_acid',      label: 'Linoleic (Ω6)',       unit: 'g',   driKey: 'linoleic_acid',        driScale: 1 },
    { key: 'alpha_linolenic_acid', label: 'α-Linolenic (Ω3)', unit: 'g',   driKey: 'alpha_linolenic_acid', driScale: 1 },
    { key: 'saturated_fat',      label: 'Saturated Fat',       unit: 'g' },
    { key: 'monounsaturated_fat',label: 'Monounsaturated Fat', unit: 'g' },
    { key: 'polyunsaturated_fat',label: 'Polyunsaturated Fat', unit: 'g' },
    { key: 'cholesterol',        label: 'Cholesterol',         unit: 'mg' },
  ];

  type NutrResult = { key: string; label: string; unit: string; amount: number; pctDRI: number | null };

  function allNutrientTotalsForDate(isoDate: string, dri: DRIRow | null): NutrResult[] {
    const rows = mealsByDate[isoDate] ?? [];
    // Sum macro columns from DB rows
    const macroSums: Record<string, number> = {
      kcal:         rows.reduce((s, r) => s + (r.kcal         ?? 0), 0),
      protein:      rows.reduce((s, r) => s + (r.protein      ?? 0), 0),
      carbohydrate: rows.reduce((s, r) => s + (r.carbohydrate ?? 0), 0),
      fat:          rows.reduce((s, r) => s + (r.fat          ?? 0), 0),
      fiber:        rows.reduce((s, r) => s + (r.fiber        ?? 0), 0),
      sugar:        rows.reduce((s, r) => s + (r.sugar        ?? 0), 0),
      water:        rows.reduce((s, r) => s + (r.water        ?? 0), 0),
      sodium:       rows.reduce((s, r) => s + (r.sodium       ?? 0), 0),
    };
    // Sum micronutrients from food-micros using food_id + quantity_grams
    const microSums: Record<string, number> = {};
    for (const row of rows) {
      const micros = getMicrosForGrams(row.food_id, row.quantity_grams);
      if (!micros) continue;
      for (const [k, v] of Object.entries(micros)) {
        if (typeof v === 'number') microSums[k] = (microSums[k] ?? 0) + v;
      }
    }
    // Build result with % DRI
    const results: NutrResult[] = [];
    for (const n of ALL_NUTRIENTS) {
      const amount = n.isMacro ? (macroSums[n.key] ?? 0) : (microSums[n.key] ?? 0);
      if (amount < 0.0005) continue; // skip truly zero - means no data
      let pctDRI: number | null = null;
      if (n.driKey && dri) {
        const driVal = dri[n.driKey];
        if (typeof driVal === 'number' && driVal > 0) {
          pctDRI = Math.round((amount / (driVal * (n.driScale ?? 1))) * 100);
        }
      }
      results.push({ key: n.key, label: n.label, unit: n.unit, amount, pctDRI });
    }
    // Sort: DRI-tracked nutrients first by % descending, then no-DRI by amount descending
    return results.sort((a, b) => {
      if (a.pctDRI !== null && b.pctDRI !== null) return b.pctDRI - a.pctDRI;
      if (a.pctDRI !== null) return -1;
      if (b.pctDRI !== null) return 1;
      return b.amount - a.amount;
    });
  }

  function fmtNutr(amount: number): string {
    if (amount >= 100) return Math.round(amount).toString();
    if (amount >= 10)  return amount.toFixed(1);
    if (amount >= 1)   return amount.toFixed(2);
    return amount.toFixed(3);
  }

  // Derive per-symptom nutrient-deviation entries (empty signals until meal-log API)
  const perSymptomNutrientCorrelations = $derived.by<SymptomNutrientCorr[]>(() =>
    Object.entries(symptomNotes)
      .map(([symptom, notes]) => ({ symptom, occurrences: notes.length, signals: [], otherSignals: [] }))
      .sort((a, b) => b.occurrences - a.occurrences)
  );

  function toggleNutrSig(symptom: string, label: string) {
    const key = `${symptom}:${label}`;
    expandedNutrSig = expandedNutrSig === key ? null : key;
  }

  type OccDetail   = { date: string; qtyG: number; kcal: number; protein: number; fat: number; carbs: number; sugar: number; water: number };
  type FoodCorr    = { name: string; inNofM: number; total: number; avgQtyG: number; occurrenceDetail: OccDetail[] };
  type SymptomCorr = { symptom: string; occurrences: number; correlatedFoods: FoodCorr[] };

  // ── Per-symptom nutrient deviation types ─────────────────────────────────
  // (Data derived from real notes — see perSymptomNutrientCorrelations above)
  type NutrientSignal = {
    label: string;
    unit: string;
    pct: number;                  // % deviation: positive = higher before symptoms
    avgWindowVal: string;         // formatted avg in 3-day pre-symptom window
    avgNormalVal: string;         // formatted avg on normal days
    isWatchList: boolean;
    watchListNote?: string;
    occurrencesWithSignal: number;
    total: number;
    occurrenceDetail: { date: string; val: string; normalAvg: string }[];
  };
  type SymptomNutrientCorr = {
    symptom: string;
    occurrences: number;
    signals: NutrientSignal[];       // watch-list nutrients (any deviation)
    otherSignals: NutrientSignal[];  // non-watch-list with |pct| >= 10
  };


  type NutrientKey = 'kcal' | 'pro' | 'fat' | 'carbs' | 'fib';
  const NUTRIENTS: { key: NutrientKey; label: string; unit: string; color: string }[] = [
    { key: 'kcal',  label: 'Calories', unit: 'kcal', color: '#f59e0b' },
    { key: 'pro',   label: 'Protein',  unit: 'g',    color: '#3b82f6' },
    { key: 'fat',   label: 'Fat',      unit: 'g',    color: '#ef4444' },
    { key: 'carbs', label: 'Carbs',    unit: 'g',    color: '#8b5cf6' },
    { key: 'fib',   label: 'Fibre',    unit: 'g',    color: '#10b981' },
  ];

  // ── Derived ──────────────────────────────────────────────────────────────────
  let dayDisplayLabel = $derived(
    selectedDate === todayIso     ? 'Today'
    : selectedDate === yesterdayIso ? 'Yesterday'
    : new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );

  function corrColor(pct: number): string {
    if (pct >= 20)  return '#ef4444';
    if (pct >= 10)  return '#f97316';
    if (pct >=  5)  return '#f59e0b';
    if (pct <= -15) return '#10b981';
    if (pct <=  -5) return '#6ee7b7';
    return '#9ca3af';
  }

  function corrSignal(pct: number): string {
    if (pct >= 20)  return 'Strong ↑';
    if (pct >= 10)  return 'Moderate ↑';
    if (pct >=  5)  return 'Weak ↑';
    if (pct <= -15) return 'Protective';
    if (pct <=  -5) return 'Slight ↓';
    return '—';
  }

  // Real logged-day and symptom-day counts from actual notes + meal data
  let loggedCount = $derived.by(() => {
    if (viewMode === 'day') return (mealsByDate[selectedDate]?.length ?? 0) > 0 ? 1 : 0;
    const cutoff = _isoStr(_addDays(_today, -(rangeDays - 1)));
    return Object.entries(mealsByDate).filter(([d, rows]) => d >= cutoff && rows.length > 0).length;
  });

  let symptomCount = $derived.by(() => {
    if (viewMode === 'day') {
      // true if selected date has at least one symptom with severity > 0
      const note = realNotesHistory.find(n => n.note_date === selectedDate);
      if (!note?.symptoms) return 0;
      try {
        const s = JSON.parse(note.symptoms as string) as StoredSymptom[];
        return s.some(x => x.severity > 0) ? 1 : 0;
      } catch { return 0; }
    }
    const cutoff = _isoStr(_addDays(_today, -(rangeDays - 1)));
    return realNotesHistory.filter(n => {
      if (n.note_date < cutoff) return false;
      try {
        const s = JSON.parse(n.symptoms as string ?? '[]') as StoredSymptom[];
        return s.some(x => x.severity > 0);
      } catch { return false; }
    }).length;
  });

  // Day-of-week labels for x-axis (7-day view)
  const DAY_ABBR = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  function dayLabel(idx: number): string {
    return DAY_ABBR[idx % 7];
  }

  // ── Nutrients tab — compact row data ──────────────────────────────────────
  let nutrientSubTab: 'vitamins' | 'minerals' = $state('vitamins');

  type NutrientRow = {
    key: string;
    label: string;
    current: number;
    target: number | null;
    unit: string;
  };

  type NutrientSection = {
    heading: string;
    isSubcategory?: boolean;
    rows: NutrientRow[];
  };

  function statusColor(pct: number): string {
    if (pct > 110) return '#f59e0b';   // amber — excess / over target
    if (pct >= 80)  return '#10b981';   // green  — optimal
    if (pct >= 50)  return '#f97316';   // orange — marginal
    return '#ef4444';                   // red    — deficient
  }

  const VITAMINS_MACROS_SECTIONS = $derived.by((): NutrientSection[] => [
    {
      heading: 'Vitamins',
      rows: [
        { key: 'vitamin_a_rae',    label: 'Vit A (RAE)',     current: mc('vitamin_a_rae', 0),    target: dt('vitamin_a_rae'),    unit: 'mcg' },
        { key: 'vitamin_d',        label: 'Vit D',            current: mc('vitamin_d', 1),        target: dt('vitamin_d'),        unit: 'mcg' },
        { key: 'vitamin_e',        label: 'Vit E',            current: mc('vitamin_e', 1),        target: dt('vitamin_e'),        unit: 'mg'  },
        { key: 'vitamin_k',        label: 'Vit K1',           current: mc('vitamin_k', 0),        target: dt('vitamin_k'),        unit: 'mcg' },
        { key: 'vitamin_k2',       label: 'Vit K2',           current: mc('vitamin_k2', 0),       target: null,                   unit: 'mcg' },
        { key: 'vitamin_c',        label: 'Vit C',            current: mc('vitamin_c', 0),        target: dt('vitamin_c'),        unit: 'mg'  },
        { key: 'thiamin',          label: 'Thiamin (B1)',      current: mc('thiamin', 2),          target: dt('thiamin'),          unit: 'mg'  },
        { key: 'riboflavin',       label: 'Riboflavin (B2)',   current: mc('riboflavin', 2),       target: dt('riboflavin'),       unit: 'mg'  },
        { key: 'niacin',           label: 'Niacin (B3)',       current: mc('niacin', 1),           target: dt('niacin'),           unit: 'mg'  },
        { key: 'pantothenic_acid', label: 'Pant. Acid (B5)',   current: mc('pantothenic_acid', 1), target: dt('pantothenic_acid'), unit: 'mg'  },
        { key: 'vitamin_b6',       label: 'Vit B6',            current: mc('vitamin_b6', 2),       target: dt('vitamin_b6'),       unit: 'mg'  },
        { key: 'folate',           label: 'Folate (B9)',        current: mc('folate', 0),           target: dt('folate'),           unit: 'mcg' },
        { key: 'vitamin_b12',      label: 'Vit B12',           current: mc('vitamin_b12', 2),      target: dt('vitamin_b12'),      unit: 'mcg' },
        { key: 'choline',          label: 'Choline',           current: mc('choline', 0),          target: dt('choline'),          unit: 'mg'  },
      ],
    },
    {
      heading: 'Macros',
      rows: [
        { key: 'fiber',       label: 'Fiber',       current: parseFloat(macroTotals.fiber.toFixed(1)),                          target: dt('fiber'), unit: 'g'  },
        { key: 'sugar',       label: 'Sugar',       current: parseFloat(macroTotals.sugar.toFixed(1)),                          target: null,        unit: 'g'  },
        { key: 'net_carbs',   label: 'Net Carbs',   current: Math.round(macroTotals.carbs - macroTotals.fiber),                 target: null,        unit: 'g'  },
        { key: 'cholesterol', label: 'Cholesterol', current: mc('cholesterol', 0),                                              target: null,        unit: 'mg' },
      ],
    },
    {
      heading: 'Fats Breakdown',
      isSubcategory: true,
      rows: [
        { key: 'saturated_fat',       label: 'Saturated Fat',   current: mc('saturated_fat', 1),        target: null,                         unit: 'g'  },
        { key: 'trans_fat',           label: 'Trans Fat',        current: mc('trans_fat', 2),            target: null,                         unit: 'g'  },
        { key: 'monounsaturated_fat', label: 'Mono Fat',         current: mc('monounsaturated_fat', 1),  target: null,                         unit: 'g'  },
        { key: 'polyunsaturated_fat', label: 'Poly Fat',         current: mc('polyunsaturated_fat', 1),  target: null,                         unit: 'g'  },
        { key: 'linoleic_acid',       label: 'Linoleic (Ω6)',    current: mc('linoleic_acid', 1),        target: dt('linoleic_acid'),           unit: 'g'  },
        { key: 'alpha_linolenic',     label: 'α-Linolenic (Ω3)', current: mc('alpha_linolenic_acid', 2), target: dt('alpha_linolenic_acid'),    unit: 'g'  },
        { key: 'omega3_total',        label: 'Omega-3 Total',    current: mc('omega3_total', 2),         target: null,                         unit: 'g'  },
        { key: 'omega6_total',        label: 'Omega-6 Total',    current: mc('omega6_total', 1),         target: null,                         unit: 'g'  },
      ],
    },
    {
      heading: 'Nutrients without Target Values',
      rows: [],
    },
    {
      heading: 'Detailed Fatty Acids',
      isSubcategory: true,
      rows: [
        { key: 'epa',             label: 'EPA',             current: mc('epa', 3),             target: null, unit: 'g'  },
        { key: 'dpa',             label: 'DPA',             current: mc('dpa', 3),             target: null, unit: 'g'  },
        { key: 'dha',             label: 'DHA',             current: mc('dha', 3),             target: null, unit: 'g'  },
        { key: 'gla',             label: 'GLA',             current: mc('gla', 3),             target: null, unit: 'g'  },
        { key: 'arachidonic',     label: 'Arachidonic',     current: mc('arachidonic', 3),     target: null, unit: 'g'  },
        { key: 'trans_monoenoic', label: 'Trans-monoenoic', current: mc('trans_monoenoic', 3), target: null, unit: 'g'  },
      ],
    },
    {
      heading: 'Essential Amino Acids',
      isSubcategory: true,
      rows: [
        { key: 'tryptophan',    label: 'Tryptophan',    current: mc('tryptophan', 2),    target: null, unit: 'g'  },
        { key: 'threonine',     label: 'Threonine',     current: mc('threonine', 2),     target: null, unit: 'g'  },
        { key: 'isoleucine',    label: 'Isoleucine',    current: mc('isoleucine', 2),    target: null, unit: 'g'  },
        { key: 'leucine',       label: 'Leucine',       current: mc('leucine', 2),       target: null, unit: 'g'  },
        { key: 'lysine',        label: 'Lysine',        current: mc('lysine', 2),        target: null, unit: 'g'  },
        { key: 'methionine',    label: 'Methionine',    current: mc('methionine', 2),    target: null, unit: 'g'  },
        { key: 'phenylalanine', label: 'Phenylalanine', current: mc('phenylalanine', 2), target: null, unit: 'g'  },
        { key: 'valine',        label: 'Valine',        current: mc('valine', 2),        target: null, unit: 'g'  },
        { key: 'histidine',     label: 'Histidine',     current: mc('histidine', 2),     target: null, unit: 'g'  },
      ],
    },
    {
      heading: 'Non-Essential Amino Acids',
      isSubcategory: true,
      rows: [
        { key: 'arginine',      label: 'Arginine',       current: mc('arginine', 2),      target: null, unit: 'g'  },
        { key: 'alanine',       label: 'Alanine',        current: mc('alanine', 2),       target: null, unit: 'g'  },
        { key: 'aspartic_acid', label: 'Aspartic Acid',  current: mc('aspartic_acid', 2), target: null, unit: 'g'  },
        { key: 'glutamic_acid', label: 'Glutamic Acid',  current: mc('glutamic_acid', 2), target: null, unit: 'g'  },
        { key: 'glycine',       label: 'Glycine',        current: mc('glycine', 2),       target: null, unit: 'g'  },
        { key: 'proline',       label: 'Proline',        current: mc('proline', 2),       target: null, unit: 'g'  },
        { key: 'serine',        label: 'Serine',         current: mc('serine', 2),        target: null, unit: 'g'  },
      ],
    },
    {
      heading: 'Sugars & Glycemic',
      isSubcategory: true,
      rows: [
        { key: 'starch',   label: 'Starch',   current: mc('starch', 1),   target: null, unit: 'g'  },
        { key: 'sucrose',  label: 'Sucrose',  current: mc('sucrose', 1),  target: null, unit: 'g'  },
        { key: 'glucose',  label: 'Glucose',  current: mc('glucose', 1),  target: null, unit: 'g'  },
        { key: 'fructose', label: 'Fructose', current: mc('fructose', 1), target: null, unit: 'g'  },
        { key: 'lactose',  label: 'Lactose',  current: mc('lactose', 1),  target: null, unit: 'g'  },
        { key: 'maltose',  label: 'Maltose',  current: mc('maltose', 1),  target: null, unit: 'g'  },
        { key: 'galactose',label: 'Galactose',current: mc('galactose', 1),target: null, unit: 'g'  },
      ],
    },
    {
      heading: 'Other Nutrients',
      isSubcategory: true,
      rows: [
        { key: 'alcohol',     label: 'Alcohol',     current: mc('alcohol', 1),     target: null, unit: 'g'   },
        { key: 'caffeine',    label: 'Caffeine',    current: mc('caffeine', 0),    target: null, unit: 'mg'  },
        { key: 'theobromine', label: 'Theobromine', current: mc('theobromine', 0), target: null, unit: 'mg'  },
        { key: 'betaine',     label: 'Betaine',     current: mc('betaine', 0),     target: null, unit: 'mg'  },
        { key: 'ash',         label: 'Ash',         current: mc('ash', 1),         target: null, unit: 'g'   },
      ],
    },
  ]);

  const MINERALS = $derived([
    { key: 'calcium',    label: 'Calcium',    current: mc('calcium', 0),    target: dt('calcium'),               unit: 'mg'  },
    { key: 'copper',     label: 'Copper',     current: mc('copper', 2),     target: dt('copper',     0.001),     unit: 'mg'  },
    { key: 'fluoride',   label: 'Fluoride',   current: mc('fluoride', 1),   target: dt('fluoride'),              unit: 'mg'  },
    { key: 'iodine',     label: 'Iodine',     current: mc('iodine', 0),     target: dt('iodine'),                unit: 'mcg' },
    { key: 'iron',       label: 'Iron',       current: mc('iron', 1),       target: dt('iron'),                  unit: 'mg'  },
    { key: 'magnesium',  label: 'Magnesium',  current: mc('magnesium', 0),  target: dt('magnesium'),             unit: 'mg'  },
    { key: 'manganese',  label: 'Manganese',  current: mc('manganese', 2),  target: dt('manganese'),             unit: 'mg'  },
    { key: 'phosphorus', label: 'Phosphorus', current: mc('phosphorus', 0), target: dt('phosphorus'),            unit: 'mg'  },
    { key: 'potassium',  label: 'Potassium',  current: mc('potassium', 0),  target: dt('potassium',  1000),      unit: 'mg'  },
    { key: 'selenium',   label: 'Selenium',   current: mc('selenium', 1),   target: dt('selenium'),              unit: 'mcg' },
    { key: 'sodium',     label: 'Sodium',     current: mc('sodium', 0),     target: dt('sodium',     1000),      unit: 'mg'  },
    { key: 'zinc',       label: 'Zinc',       current: mc('zinc', 1),       target: dt('zinc'),                  unit: 'mg'  },
  ] satisfies NutrientRow[]);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div class="modal-backdrop" onclick={onClose}>
  <div class="reports-modal" onclick={(e) => e.stopPropagation()}>

    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div class="reports-header">
      <h3>📊 Reports</h3>
      {#if isAllin}
        <div class="reports-tabs">
          <button
            class="reports-tab"
            class:active={activeTab === 'trends'}
            onclick={() => activeTab = 'trends'}
          >Trends</button>
          <button
            class="reports-tab"
            class:active={activeTab === 'nutrient'}
            onclick={() => activeTab = 'nutrient'}
          >Nutrients</button>
          <button
            class="reports-tab"
            class:active={activeTab === 'food'}
            onclick={() => activeTab = 'food'}
          >Foods</button>
        </div>
      {/if}
    </div>

    {#if !isAllin}
      <!-- ── Upgrade prompt ────────────────────────────────────────────────── -->
      <div class="reports-upgrade">
        <div class="upgrade-icon">📊</div>
        <h4>Reports is an ALL·IN feature</h4>
        <p>See how your symptom days correlate with what you eat —</p>
        <ul class="upgrade-features">
          <li class="upgrade-feature">📈 30-day macro trends</li>
          <li class="upgrade-feature">🔴 Symptom–nutrient correlation</li>
          <li class="upgrade-feature">🍽 Food pattern analysis</li>
          <li class="upgrade-feature">💡 Plain-language insights</li>
        </ul>
        <button class="upgrade-cta">Upgrade to ALL·IN — $14.95/mo</button>
        <button class="upgrade-skip" onclick={onClose}>Maybe later</button>
      </div>

    {:else}
      <!-- ── Date range selector ───────────────────────────────────────────── -->
      <div class="range-row">
        <button
          class="range-pill"
          class:active={viewMode === 'day' && selectedDate === todayIso}
          onclick={selectToday}
        >Today</button>
        <button
          class="range-pill"
          class:active={viewMode === 'day' && selectedDate === yesterdayIso}
          onclick={selectYesterday}
        >Yest.</button>
        <input
          type="date"
          class="date-pick"
          class:active={viewMode === 'day' && selectedDate !== todayIso && selectedDate !== yesterdayIso}
          value={selectedDate}
          min={minDateIso}
          max={maxDateIso}
          onchange={(e) => selectPick(e.currentTarget.value)}
        />
        <span class="range-sep"></span>
        <span class="range-label">Past</span>
        {#each ([7, 14, 30] as const) as n}
          <button
            class="range-pill"
            class:active={viewMode === 'range' && rangeDays === n}
            onclick={() => { viewMode = 'range'; rangeDays = n; }}
          >{n}d</button>
        {/each}
        <span class="range-summary">
          {#if viewMode === 'day'}
            <span class="day-label">{dayDisplayLabel}</span>
            {#if isFuture(selectedDate)}
              · <span class="planned-label">📅 planned</span>
            {:else if symptomCount > 0}
              · <span class="sym-label">● symptom day</span>
            {/if}
          {:else}
            {loggedCount} days logged
            {#if symptomCount > 0}
              · <span class="sym-label">● {symptomCount} symptom {symptomCount === 1 ? 'day' : 'days'}</span>
            {/if}
          {/if}
        </span>
      </div>

      <div class="reports-content">

        {#if activeTab === 'trends'}
          <!-- ── Trends tab ──────────────────────────────────────────────────── -->

          <!-- Inner sub-tabs: Vitamins/Macros | Minerals -->
          <div class="nutri-subtabs">
            <button
              class="nutri-subtab"
              class:active={nutrientSubTab === 'vitamins'}
              onclick={() => nutrientSubTab = 'vitamins'}
            >Vitamins / Macros</button>
            <button
              class="nutri-subtab"
              class:active={nutrientSubTab === 'minerals'}
              onclick={() => nutrientSubTab = 'minerals'}
            >Minerals</button>
          </div>

          {#if nutrientSubTab === 'vitamins'}
            {#each VITAMINS_MACROS_SECTIONS as sec}
              {#if sec.isSubcategory}
                <div class="nutri-sub-head">{sec.heading}</div>
              {:else}
                <div class="nutri-section-head">
                  <div class="nsec-line"></div>
                  <span class="nsec-title">{sec.heading}</span>
                  <div class="nsec-line"></div>
                </div>
              {/if}
              {#each sec.rows as row}
                <div class="nutri-row">
                  <span class="nr-name">{row.label}</span>
                  {#if row.target !== null}
                    {@const pct = Math.min(Math.round((row.current / row.target) * 100), 120)}
                    <div class="nr-bar-track">
                      <div class="nr-bar" style="width:{Math.min(pct, 100)}%; background:{statusColor(pct)}"></div>
                    </div>
                    <span class="nr-vals">{row.current}/{row.target}{row.unit}</span>
                    <span class="nr-pct" style="color:{statusColor(pct)}">{pct}%</span>
                  {:else}
                    <div class="nr-bar-track nr-no-target"></div>
                    <span class="nr-vals" style="color:#9ca3af">{row.current} {row.unit}</span>
                    <span class="nr-pct" style="color:#9ca3af">—</span>
                  {/if}
                </div>
              {/each}
            {/each}
          {:else}
            <div class="nutri-section-head">
              <div class="nsec-line"></div>
              <span class="nsec-title">Minerals</span>
              <div class="nsec-line"></div>
            </div>
            {#each MINERALS as row}
              {@const pct = Math.min(Math.round((row.current / row.target!) * 100), 120)}
              <div class="nutri-row">
                <span class="nr-name">{row.label}</span>
                <div class="nr-bar-track">
                  <div class="nr-bar" style="width:{Math.min(pct, 100)}%; background:{statusColor(pct)}"></div>
                </div>
                <span class="nr-vals">{row.current}/{row.target}{row.unit}</span>
                <span class="nr-pct" style="color:{statusColor(pct)}">{pct}%</span>
              </div>
            {/each}
          {/if}

        {:else if activeTab === 'nutrient'}
          <!-- ── Nutrient tab ───────────────────────────────────────────────── -->
          <p class="food-tab-note">
            Nutrients consumed on each symptom day. Watch-list nutrients for that symptom appear first and are highlighted.
          </p>

          {#if notesLoading}
            <p class="food-tab-note">Loading symptom data…</p>
          {:else if perSymptomNutrientCorrelations.length === 0}
            <p class="no-symptoms-yet">No rated symptoms logged yet. Use the Notes feature to log a symptom with a severity score — it will appear here.</p>
          {:else}
            {#each perSymptomNutrientCorrelations as s}
              <div class="symptom-card">
                <div class="symp-card-header">
                  <span class="symp-name">🔴 {s.symptom} · {s.occurrences} {s.occurrences === 1 ? 'occurrence' : 'occurrences'}</span>
                </div>
                {#each (symptomNotes[s.symptom] ?? []) as note}
                  {@const occKey = `n:${s.symptom}:${note.isoDate}`}
                  <div class="symp-occ-row-wrap">
                    <button class="symp-occ-date-row"
                      onclick={() => { const wasOpen = expandedNutrOcc === occKey; expandedNutrOcc = wasOpen ? null : occKey; if (!wasOpen) loadMealsForDate(note.isoDate); }}
                      aria-expanded={expandedNutrOcc === occKey}>
                      <span class="occ-date">{note.date}</span>
                      {#if note.text}<span class="symp-occ-note-preview">{note.text.slice(0, 80)}{note.text.length > 80 ? '…' : ''}</span>{/if}
                      <span class="symp-food-chevron">{expandedNutrOcc === occKey ? '▾' : '▸'}</span>
                    </button>
                    {#if expandedNutrOcc === occKey}
                      <div class="symp-occ-detail">
                        {#if note.text}<p class="symp-occ-full-note">{note.text}</p>{/if}
                        {#if (SYMPTOM_NUTRIENT_WATCHLIST[s.symptom] ?? []).length > 0}
                          <div class="occ-watch-section">
                            <span class="occ-watch-title">⚠️ Watch-list nutrients for {s.symptom}</span>
                            {#each (SYMPTOM_NUTRIENT_WATCHLIST[s.symptom] ?? []) as key}
                              {@const meta = NUTR_META[key]}
                              {#if meta}
                                <div class="occ-trigger-row">
                                  <span class="occ-trigger-name">{meta.label}</span>
                                  {#if mealsByDate[note.isoDate]?.length}
                                    <span class="occ-trigger-reason">{(nutrientTotalsForDate(note.isoDate)[key] ?? 0).toFixed(key === 'kcal' ? 0 : 1)} {meta.unit} logged</span>
                                  {/if}
                                </div>
                              {/if}
                            {/each}
                          </div>
                        {/if}
                        <div class="symp-day-foods">
                          <span class="symp-day-foods-title">📊 Nutrients logged on {note.date}{driRow ? '' : ' (no DRI profile — % not shown)'}</span>
                          {#if mealLoading[note.isoDate]}
                            <p class="symp-no-data">Loading…</p>
                          {:else if mealError[note.isoDate]}
                            <p class="symp-no-data" style="color:var(--color-warning,#f59e0b)">⚠️ Error fetching data ({mealError[note.isoDate]}) — check console</p>
                          {:else if !mealsByDate[note.isoDate] || mealsByDate[note.isoDate].length === 0}
                            <p class="symp-no-data">No Balance-game meals found for {note.isoDate}.</p>
                          {:else}
                            {@const allNutrs = allNutrientTotalsForDate(note.isoDate, driRow)}
                            {#each allNutrs as n}
                              <div class="symp-day-food-row">
                                <span class="symp-day-food-name">{n.label}</span>
                                <span class="symp-day-food-qty">{fmtNutr(n.amount)} {n.unit}</span>
                                {#if n.pctDRI !== null}
                                  <span class="nutr-pct-badge" class:nutr-pct-high={n.pctDRI >= 50}>{n.pctDRI}%</span>
                                {/if}
                              </div>
                            {/each}
                          {/if}
                        </div>
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            {/each}
          {/if}

          <p class="food-data-note">
            ⓘ Only meals logged in the Balance game are included. Watch-list nutrients are those research-associated with this symptom.
          </p>

        {:else}
          <!-- ── Food tab ─────────────────────────────────────────────────── -->
          <p class="food-tab-note">
            Foods eaten in the {LAG_DAYS} days before each symptom.
            A food appearing before multiple occurrences of the same symptom is a candidate trigger.
          </p>

          {#if notesLoading}
            <p class="food-tab-note">Loading symptom data…</p>
          {:else if perSymptomCorrelations.length === 0}
            <p class="no-symptoms-yet">No rated symptoms logged yet. Use the Notes feature to log a symptom with a severity score — it will appear here.</p>
          {:else}
            {#each perSymptomCorrelations as s}
              <div class="symptom-card">
                <div class="symp-card-header">
                  <span class="symp-name">🔴 {s.symptom} · {s.occurrences} {s.occurrences === 1 ? 'occurrence' : 'occurrences'}</span>
                </div>

                <!-- Each occurrence date as an expandable row -->
                {#each (symptomNotes[s.symptom] ?? []) as note}
                  {@const occKey = `${s.symptom}:${note.isoDate}`}
                  {@const occOpen = expandedFood === occKey}
                  <div class="symp-occ-row-wrap">
                    <button class="symp-occ-date-row" onclick={() => { const wasOpen = expandedFood === occKey; expandedFood = wasOpen ? null : occKey; if (!wasOpen) loadMealsForDate(note.isoDate); }} aria-expanded={occOpen}>
                      <span class="occ-date">{note.date}</span>
                      {#if note.text}
                        <span class="symp-occ-note-preview">{note.text.length > 60 ? note.text.slice(0, 60) + '…' : note.text}</span>
                      {:else}
                        <span class="symp-occ-note-preview symp-note-empty">No note text</span>
                      {/if}
                      <span class="symp-food-chevron">{occOpen ? '▾' : '▸'}</span>
                    </button>
                    {#if occOpen}
                      <div class="symp-occ-detail">
                        {#if note.text}
                          <p class="symp-occ-full-note">{note.text}</p>
                        {/if}
                        {#if (SYMPTOM_TRIGGERS[s.symptom] ?? []).length > 0}
                          <div class="occ-watch-section">
                            <span class="occ-watch-title">⚠️ Known dietary triggers to review for {s.symptom}</span>
                            {#each (SYMPTOM_TRIGGERS[s.symptom] ?? []) as trigger}
                              <div class="occ-trigger-row">
                                <span class="trigger-label">{trigger.label}</span>
                                <span class="trigger-note">{trigger.note}</span>
                              </div>
                            {/each}
                          </div>
                        {/if}
                        <!-- Foods eaten that day -->
                        <div class="symp-day-foods">
                          <span class="symp-day-foods-title">🍽️ Foods logged on {note.date}</span>
                          {#if mealLoading[note.isoDate]}
                            <p class="symp-no-data">Loading…</p>
                          {:else if mealError[note.isoDate]}
                            <p class="symp-no-data" style="color:var(--color-warning,#f59e0b)">⚠️ Error fetching meals ({mealError[note.isoDate]}) — check console</p>
                          {:else if !mealsByDate[note.isoDate] || mealsByDate[note.isoDate].length === 0}
                            <p class="symp-no-data">No Balance-game meals found for {note.isoDate}.</p>
                          {:else}
                            {#each mealsByDate[note.isoDate] as meal}
                              <div class="symp-day-food-row">
                                <span class="symp-day-food-cat">{meal.meal_category}</span>
                                <span class="symp-day-food-name">{meal.food_name}</span>
                                <span class="symp-day-food-qty">{meal.quantity_grams}g</span>
                                <span class="symp-day-food-kcal">{meal.kcal} kcal</span>
                              </div>
                            {/each}
                          {/if}
                        </div>
                      </div>
                    {/if}
                  </div>
                {/each}

                {#if s.correlatedFoods.length > 0}
                  <p class="symp-occ">Foods found in the {LAG_DAYS}-day window</p>
                  {#each s.correlatedFoods as f}
                    {@const key = `${s.symptom}:${f.name}`}
                    {@const pct = Math.round((f.inNofM / LAG_DAYS) * 100)}
                    {@const isOpen = expandedFood === key}
                    <div class="symp-food-item">
                      <button class="symp-food-row" onclick={() => toggleExpand(s.symptom, f.name)} aria-expanded={isOpen}>
                        <span class="symp-food-name">{f.name}</span>
                        <div class="symp-food-bar-track">
                          <div class="symp-food-bar" style="width:{pct}%; background:{pct === 100 ? '#ef4444' : pct >= 67 ? '#f97316' : '#f59e0b'}"></div>
                        </div>
                        <span class="symp-food-frac" style="color:{pct === 100 ? '#ef4444' : pct >= 67 ? '#f97316' : '#9ca3af'}">{f.inNofM}/{LAG_DAYS}</span>
                        <span class="symp-food-avg">avg {f.avgQtyG}g</span>
                        <span class="symp-food-chevron">{isOpen ? '▾' : '▸'}</span>
                      </button>
                      {#if isOpen}
                        <div class="symp-food-detail">
                          {#each f.occurrenceDetail as occ}
                            <div class="symp-occ-row">
                              <span class="occ-date">{occ.date}</span>
                              <span class="occ-qty">{occ.qtyG}g</span>
                              <span class="occ-nutrients">{occ.kcal} kcal · pro {occ.protein}g · fat {occ.fat}g · carbs {occ.carbs}g · sugar {occ.sugar}g · water {occ.water}ml</span>
                            </div>
                          {/each}
                        </div>
                      {/if}
                    </div>
                  {/each}
                {/if}
              </div>
            {/each}
          {/if}

          <p class="food-data-note">
            ⓘ Only meals logged in the Balance game are counted. Food correlation is observational, not causal.
            Only symptoms with a severity rating in your daily notes appear here — general observations are excluded.
          </p>
        {/if}

      </div>
    {/if}

    <button class="modal-close-btn" onclick={onClose}>Close</button>
  </div>
</div>

<style>
  /* ── Modal shell ─────────────────────────────────────────────────────────── */
  .reports-modal {
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    width: min(660px, 95vw);
    max-height: calc(100vh - 5.5rem);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }

  /* ── Header ─────────────────────────────────────────────────────────────── */
  .reports-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    flex-shrink: 0;
  }

  .reports-header h3 {
    margin: 0;
    color: #7c3aed;
  }

  .reports-tabs {
    display: flex;
    gap: 0.25rem;
    background: #f3f4f6;
    border-radius: 0.5rem;
    padding: 0.2rem;
  }

  .reports-tab {
    padding: 0.25rem 0.75rem;
    border: none;
    border-radius: 0.375rem;
    background: transparent;
    font-size: 0.85rem;
    cursor: pointer;
    color: #6b7280;
  }

  .reports-tab.active {
    background: white;
    color: #111827;
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  /* ── Upgrade prompt ─────────────────────────────────────────────────────── */
  .reports-upgrade {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.5rem 1rem;
    gap: 0.75rem;
    flex: 1;
  }

  .upgrade-icon {
    font-size: 3rem;
    line-height: 1;
  }

  .reports-upgrade h4 {
    margin: 0;
    font-size: 1.1rem;
    color: #111827;
  }

  .reports-upgrade p {
    margin: 0;
    font-size: 0.9rem;
    color: #6b7280;
    max-width: 380px;
    line-height: 1.5;
  }

  .upgrade-features {
    list-style: none;
    margin: 0.25rem 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    width: 100%;
    max-width: 320px;
  }

  .upgrade-feature {
    background: #f3f4f6;
    border-radius: 0.5rem;
    padding: 0.4rem 0.85rem;
    font-size: 0.87rem;
    color: #374151;
    text-align: left;
  }

  .upgrade-cta {
    background: #7c3aed;
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 0.65rem 1.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .upgrade-cta:hover {
    background: #6d28d9;
  }

  .upgrade-skip {
    background: none;
    border: none;
    color: #9ca3af;
    font-size: 0.85rem;
    cursor: pointer;
    padding: 0.25rem;
  }

  .upgrade-skip:hover {
    color: #6b7280;
  }

  /* ── Range selector ─────────────────────────────────────────────────────── */
  .range-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.75rem;
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .range-label {
    font-size: 0.82rem;
    color: #6b7280;
  }

  .range-pill {
    padding: 0.15rem 0.6rem;
    border: 1.5px solid #d1d5db;
    border-radius: 999px;
    background: white;
    font-size: 0.82rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .range-pill.active {
    background: #7c3aed;
    border-color: #7c3aed;
    color: white;
    font-weight: 600;
  }

  .range-pill:hover:not(.active) {
    border-color: #7c3aed;
    color: #7c3aed;
  }

  .date-pick {
    padding: 0.1rem 0.45rem;
    border: 1.5px solid #d1d5db;
    border-radius: 999px;
    background: white;
    font-size: 0.78rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.15s;
    height: 1.65rem;
    box-sizing: border-box;
    outline: none;
  }

  .date-pick:hover {
    border-color: #7c3aed;
    color: #7c3aed;
  }

  .date-pick.active {
    border-color: #7c3aed;
    background: #7c3aed;
    color: white;
  }

  .range-sep {
    width: 1px;
    height: 1.25rem;
    background: #d1d5db;
    flex-shrink: 0;
    align-self: center;
    margin: 0 0.15rem;
  }

  .range-summary {
    margin-left: auto;
    font-size: 0.8rem;
    color: #9ca3af;
  }

  .day-label {
    color: #374151;
    font-weight: 600;
  }

  .sym-label {
    color: #ef4444;
    font-weight: 500;
  }

  .planned-label {
    color: #7c3aed;
    font-weight: 500;
  }



  /* ── Content scroll area ────────────────────────────────────────────────── */
  .reports-content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    padding-right: 0.25rem;
  }



  /* ── Food tab ───────────────────────────────────────────────────────────── */
  .food-tab-note {
    margin: 0 0 0.75rem;
    font-size: 0.82rem;
    color: #6b7280;
    line-height: 1.5;
  }

  .food-data-note {
    margin: 0.75rem 0 0;
    font-size: 0.75rem;
    color: #9ca3af;
    line-height: 1.5;
  }

  /* ── Per-symptom cards ──────────────────────────────────────────────────── */
  .symptom-card {
    border: 1px solid #e5e7eb;
    border-radius: 0.625rem;
    padding: 0.75rem 0.9rem;
    margin-bottom: 0.65rem;
  }

  .symp-card-header {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.15rem;
  }

  .symp-name {
    font-size: 0.88rem;
    font-weight: 700;
    color: #111827;
  }

  .symp-view-link {
    background: none;
    border: none;
    padding: 0;
    font-size: 0.75rem;
    font-weight: 600;
    color: #7c3aed;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
    flex-shrink: 0;
  }
  .symp-view-link:hover { color: #5b21b6; }

  .symp-notes-list {
    margin: 0 0 0.6rem;
    border-left: 2px solid #e9d5ff;
    padding-left: 0.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .symp-note-item {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
    font-size: 0.78rem;
  }

  .symp-note-date {
    flex-shrink: 0;
    font-weight: 600;
    color: #374151;
    min-width: 3.8rem;
  }

  .symp-note-text {
    color: #4b5563;
    line-height: 1.4;
  }

  .symp-note-empty {
    color: #9ca3af;
    font-style: italic;
  }

  .symp-occ {
    margin: 0 0 0.55rem;
    font-size: 0.75rem;
    color: #9ca3af;
  }

  .symp-single-note {
    margin: 0;
    font-size: 0.8rem;
    color: #9ca3af;
    font-style: italic;
  }

  .no-symptoms-yet {
    font-size: 0.85rem;
    color: #6b7280;
    padding: 1rem 0;
    text-align: center;
    font-style: italic;
  }

  .symp-no-data {
    font-size: 0.8rem;
    color: #9ca3af;
    font-style: italic;
    padding: 0.5rem 0;
  }

  .symp-day-foods {
    border-top: 1px solid #f3f4f6;
    padding-top: 0.4rem;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .symp-day-foods-title {
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    color: #374151;
    margin-bottom: 0.2rem;
  }

  .symp-day-food-row {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    font-size: 0.75rem;
    padding: 0.07rem 0;
  }

  .nutr-wl-row {
    background: #fefce8;
    border-left: 2px solid #f59e0b;
    padding-left: 0.35rem;
    border-radius: 0 0.2rem 0.2rem 0;
    margin-bottom: 0.05rem;
  }

  .nutr-wl-row .symp-day-food-name {
    color: #92400e;
    font-weight: 600;
  }

  .nutr-wl-row .symp-day-food-qty {
    color: #b45309;
    font-weight: 600;
  }

  .symp-day-food-cat {
    font-size: 0.65rem;
    color: #9ca3af;
    text-transform: capitalize;
    min-width: 4.5rem;
    flex-shrink: 0;
  }

  .symp-day-food-name {
    flex: 1;
    color: #111827;
  }

  .symp-day-food-qty {
    color: #6b7280;
    flex-shrink: 0;
  }

  .nutr-pct-badge {
    font-size: 0.65rem;
    color: #9ca3af;
    flex-shrink: 0;
    min-width: 2.8rem;
    text-align: right;
  }

  .nutr-pct-badge.nutr-pct-high {
    color: #d97706;
    font-weight: 600;
  }

  .symp-day-food-kcal {
    color: #f97316;
    font-weight: 600;
    flex-shrink: 0;
    min-width: 4rem;
    text-align: right;
  }

  .symp-occ-row-wrap {
    border: 1px solid #e5e7eb;
    border-radius: 0.4rem;
    margin-bottom: 0.35rem;
    overflow: hidden;
  }

  .symp-occ-date-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.45rem 0.6rem;
    background: #f9fafb;
    border: none;
    cursor: pointer;
    text-align: left;
    font-size: 0.82rem;
  }

  .symp-occ-date-row:hover {
    background: #f3f4f6;
  }

  .symp-occ-note-preview {
    flex: 1;
    color: #6b7280;
    font-size: 0.78rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .symp-occ-detail {
    padding: 0.5rem 0.65rem 0.65rem;
    background: white;
    border-top: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .symp-occ-full-note {
    margin: 0 0 0.3rem;
    font-size: 0.82rem;
    color: #374151;
    font-style: italic;
  }

  .symp-foods {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .symp-food-item {
    display: flex;
    flex-direction: column;
  }

  .symp-food-row {
    display: grid;
    grid-template-columns: 8rem 1fr 2.5rem 3.5rem 1.25rem;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.82rem;
    background: none;
    border: none;
    padding: 0.1rem 0;
    cursor: pointer;
    width: 100%;
    text-align: left;
    border-radius: 0.25rem;
  }

  .symp-food-row:hover {
    background: #f9fafb;
  }

  .symp-food-avg {
    font-size: 0.72rem;
    color: #6b7280;
    text-align: right;
    white-space: nowrap;
  }

  .symp-food-chevron {
    font-size: 0.68rem;
    color: #9ca3af;
    text-align: center;
  }

  .symp-food-detail {
    background: #f9fafb;
    border-left: 2px solid #e5e7eb;
    margin: 0.15rem 0 0.25rem 0.75rem;
    padding: 0.3rem 0.5rem;
    border-radius: 0 0.25rem 0.25rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .symp-occ-row {
    display: flex;
    gap: 0.55rem;
    font-size: 0.75rem;
    align-items: baseline;
    flex-wrap: wrap;
  }

  .occ-date {
    color: #6b7280;
    min-width: 3.5rem;
    flex-shrink: 0;
  }

  .occ-qty {
    font-weight: 600;
    color: #374151;
    min-width: 2.5rem;
    flex-shrink: 0;
  }

  .occ-nutrients {
    color: #9ca3af;
  }

  .occ-more-link {
    background: none;
    border: none;
    padding: 0;
    font-size: inherit;
    color: #6b7280;
    text-decoration: underline;
    cursor: pointer;
  }

  .occ-more-link:hover {
    color: #374151;
  }

  /* ── "More" trigger panel ────────────────────────────────────────────────── */
  .occ-more-panel {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    margin: 0.15rem 0 0.3rem;
    overflow: hidden;
  }

  .occ-watch-section {
    padding: 0.45rem 0.65rem;
    background: #fffbeb;
    border-bottom: 1px solid #fde68a;
  }

  .occ-watch-title {
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    color: #92400e;
    margin-bottom: 0.3rem;
    letter-spacing: 0.01em;
  }

  .occ-trigger-row {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
    font-size: 0.72rem;
    padding: 0.07rem 0;
  }

  .trigger-label {
    min-width: 5rem;
    flex-shrink: 0;
    color: #374151;
    font-weight: 600;
  }

  .trigger-val {
    min-width: 4rem;
    flex-shrink: 0;
    color: #374151;
    font-weight: 500;
    text-align: right;
  }

  .trigger-val.inferred {
    min-width: unset;
    color: #6b7280;
    font-style: italic;
    font-weight: 400;
    text-align: left;
  }

  .trigger-val.present {
    color: #ef4444;
    font-weight: 600;
  }

  .trigger-note {
    color: #9ca3af;
    font-size: 0.67rem;
    flex: 1;
  }

  .occ-full-section {
    padding: 0.4rem 0.65rem 0.45rem;
  }

  .occ-full-title {
    display: block;
    font-size: 0.68rem;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.25rem;
  }

  .occ-full-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 0.75rem;
  }

  .occ-full-item {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 0.7rem;
    padding: 0.05rem 0;
    gap: 0.2rem;
  }

  .nutri-name {
    color: #9ca3af;
    flex: 1;
  }

  .nutri-val {
    color: #374151;
    font-weight: 500;
    text-align: right;
    white-space: nowrap;
  }

  .symp-food-name {
    color: #374151;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .symp-food-bar-track {
    background: #f3f4f6;
    border-radius: 3px;
    height: 9px;
    overflow: hidden;
  }

  .symp-food-bar {
    height: 100%;
    border-radius: 3px;
    transition: width 0.2s;
  }

  .symp-food-frac {
    font-size: 0.75rem;
    font-weight: 700;
    text-align: right;
    white-space: nowrap;
  }

  /* ── Close button ───────────────────────────────────────────────────────── */
  .modal-close-btn {
    margin-top: 1rem;
    padding: 0.5rem 1.25rem;
    background: #f3f4f6;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;
    align-self: flex-end;
    flex-shrink: 0;
  }

  .modal-close-btn:hover {
    background: #e5e7eb;
  }

  /* ── Nutrient sub-tabs ──────────────────────────────────────────────────── */
  .nutri-subtabs {
    display: flex;
    gap: 0.25rem;
    background: #f3f4f6;
    border-radius: 0.5rem;
    padding: 0.2rem;
    margin: 0.5rem 0 0.75rem;
  }

  .nutri-subtab {
    flex: 1;
    padding: 0.3rem 0;
    border: none;
    border-radius: 0.375rem;
    background: transparent;
    font-size: 0.82rem;
    cursor: pointer;
    color: #6b7280;
    text-align: center;
  }

  .nutri-subtab.active {
    background: white;
    color: #111827;
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  /* ── Section heading (gradient-line style matching Jetcool) ─────────────── */
  .nutri-section-head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.65rem 0 0.25rem;
  }

  .nsec-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #d1d5db, transparent);
  }

  .nsec-title {
    font-size: 0.7rem;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ── Subcategory heading ─────────────────────────────────────────────────── */
  .nutri-sub-head {
    font-size: 0.67rem;
    font-weight: 600;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.35rem 0 0.1rem 0.5rem;
  }

  /* ── Compact nutrient row ────────────────────────────────────────────────── */
  .nutri-row {
    display: grid;
    grid-template-columns: 9rem 1fr 5.5rem 2.75rem;
    align-items: center;
    gap: 0.35rem;
    height: 2rem;
  }

  .nr-name {
    font-size: 0.78rem;
    color: #374151;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nr-bar-track {
    background: #f3f4f6;
    border-radius: 3px;
    height: 8px;
    overflow: hidden;
  }

  .nr-no-target {
    background: #f9fafb;
  }

  .nr-bar {
    height: 100%;
    border-radius: 3px;
    transition: width 0.2s;
  }

  .nr-vals {
    font-size: 0.7rem;
    color: #374151;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nr-pct {
    font-size: 0.7rem;
    font-weight: 600;
    text-align: right;
    white-space: nowrap;
  }



  /* ── Nutrient deviation rows ────────────────────────────────────────────── */
  .nutr-signal-row {
    display: grid;
    grid-template-columns: 5rem 1fr 3rem 5.5rem 1.25rem;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.82rem;
    background: none;
    border: none;
    padding: 0.1rem 0;
    cursor: pointer;
    width: 100%;
    text-align: left;
    border-radius: 0.25rem;
  }

  .nutr-signal-row:hover {
    background: #f9fafb;
  }

  .nutr-signal-name {
    color: #374151;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .nutr-signal-pct {
    font-size: 0.75rem;
    font-weight: 700;
    text-align: right;
    white-space: nowrap;
  }

  .nutr-signal-sig {
    font-size: 0.73rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nutr-sig-meta {
    font-size: 0.73rem;
    color: #6b7280;
    margin-bottom: 0.2rem;
    line-height: 1.4;
  }

  .nutr-sig-note {
    color: #92400e;
    font-weight: 500;
  }

  .nutr-sig-avg {
    color: #9ca3af;
  }

  .other-signals-toggle {
    background: none;
    border: none;
    font-size: 0.78rem;
    color: #9ca3af;
    cursor: pointer;
    padding: 0.2rem 0;
    text-align: left;
    margin-top: 0.1rem;
  }

  .other-signals-toggle:hover {
    color: #6b7280;
  }

  .other-signals-section {
    padding-left: 0.6rem;
    border-left: 2px dashed #e5e7eb;
    margin-top: 0.15rem;
  }

  /* ── "Normal" info popup ─────────────────────────────────────────────────── */
  .normal-link {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    font-size: inherit;
    color: #7c3aed;
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
  }

  .normal-link:hover {
    color: #6d28d9;
  }

  .normal-info-popup {
    position: relative;
    background: #f5f3ff;
    border: 1px solid #ddd6fe;
    border-radius: 0.625rem;
    padding: 0.75rem 2rem 0.75rem 0.85rem;
    margin: 0 0 0.75rem;
    font-size: 0.82rem;
    color: #374151;
    line-height: 1.55;
  }

  .normal-info-close {
    position: absolute;
    top: 0.5rem;
    right: 0.6rem;
    background: none;
    border: none;
    font-size: 0.75rem;
    color: #9ca3af;
    cursor: pointer;
    padding: 0.1rem 0.25rem;
    line-height: 1;
  }

  .normal-info-close:hover {
    color: #374151;
  }

  .normal-info-title {
    margin: 0 0 0.4rem;
    font-weight: 700;
    color: #7c3aed;
    font-size: 0.83rem;
  }

  .normal-info-body {
    margin: 0 0 0.4rem;
  }

  .normal-info-tip {
    margin: 0;
    color: #6b7280;
    font-size: 0.78rem;
  }

  /* ── Mobile ─────────────────────────────────────────────────────────────── */
  @media (max-width: 480px) {
    .reports-modal {
      padding: 1rem;
    }

    .range-summary {
      display: none;
    }
  }
</style>
