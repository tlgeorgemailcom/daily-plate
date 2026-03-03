import fs from 'fs';

const usdaCsv = fs.readFileSync('src/lib/data/scrambled-words.csv', 'utf8');
const combinedCsv = fs.readFileSync('src/lib/data/scrambled-words-combined.csv', 'utf8');

function parseCsv(csv) {
  const lines = csv.trim().split('\n');
  return lines.slice(1).map(line => {
    const [word, groupsStr] = line.split(',');
    return { word: word.trim(), groups: groupsStr.trim().split('|').map(g => g.trim()) };
  });
}

const ALCOHOL_GROUPS = new Set(['wine', 'bar']);
const usdaWordList = parseCsv(usdaCsv);
const combinedWordList = parseCsv(combinedCsv);
const filteredFoodie = combinedWordList.filter(entry => {
  const hasAlcohol = entry.groups.some(g => ALCOHOL_GROUPS.has(g));
  return hasAlcohol === false;
});

console.log('USDA:', usdaWordList.length);
console.log('FOODIE (combined - wine/bar):', filteredFoodie.length);
console.log('FOODIE 21+ (full combined):', combinedWordList.length);
console.log('Difference:', combinedWordList.length - filteredFoodie.length);
