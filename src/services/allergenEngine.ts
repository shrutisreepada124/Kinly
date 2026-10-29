import { FamilyProfile, ScanSafetyResult, IngredientMatch } from '../types/family';

// Allergen patterns
const PEANUT_KEYWORDS = [
  'peanut', 'peanuts', 'peanut butter', 'peanut flour', 'peanut oil',
  'arachis', 'groundnut', 'groundnuts', 'monkey nuts', 'beer nuts'
];

const TREE_NUT_KEYWORDS = [
  'almond', 'almonds', 'almond butter', 'almond flour', 'almond milk',
  'walnut', 'walnuts', 'cashew', 'cashews', 'pecan', 'pecans',
  'pistachio', 'pistachios', 'hazelnut', 'hazelnuts', 'macadamia',
  'brazil nut', 'brazil nuts', 'pine nut', 'pine nuts', 'praline', 'marzipan'
];

const SOY_KEYWORDS = [
  'soy', 'soya', 'soybean', 'soybeans', 'soy lecithin', 'soy sauce',
  'soy protein', 'soy isolate', 'hydrolyzed soy', 'edamame', 'tofu',
  'tempeh', 'miso', 'tamari', 'shoyu', 'textured vegetable protein',
  'tvp', 'yuba', 'natto'
];

// Grandma: High sodium keywords & additives
const SODIUM_KEYWORDS = [
  'monosodium glutamate', 'msg', 'disodium inosinate', 'disodium guanylate',
  'sodium benzoate', 'sodium nitrate', 'sodium nitrite', 'sodium bicarbonate',
  'baking soda', 'brine', 'cured with salt', 'soy sauce', 'fish sauce',
  'cured bacon', 'bouillon', 'broth concentrate'
];

// Diabetic / High Glycemic Sugar keywords
const SUGAR_GLYCEMIC_KEYWORDS = [
  'high fructose corn syrup', 'corn syrup', 'cane sugar', 'sugar', 'brown sugar',
  'dextrose', 'maltodextrin', 'maltose', 'sucrose', 'glucose', 'inverted sugar',
  'tapioca syrup', 'rice syrup', 'agave nectar', 'molasses', 'honey',
  'caramel color', 'enriched wheat flour', 'bleached flour'
];

// Mom: Keto restriction keywords
const HIGH_CARB_KEYWORDS = [
  'cane sugar', 'sugar', 'corn syrup', 'dextrose', 'maltodextrin',
  'wheat flour', 'enriched flour', 'oats', 'rolled oats', 'rice flour',
  'tapioca starch', 'cornstarch', 'potato starch', 'potatoes', 'cassava',
  'barley', 'malt', 'honey', 'agave'
];

export function parseIngredientsText(rawText: string): string[] {
  if (!rawText || !rawText.trim()) return [];
  
  // Clean up common labels like "INGREDIENTS:", "CONTAINS:", "MAY CONTAIN:"
  let cleaned = rawText
    .replace(/^ingredients\s*[:\-]/i, '')
    .replace(/ingredients\s*listed\s*below\s*[:\-]/i, '')
    .trim();

  // Split on commas, semicolons, or newlines, while respecting nested parentheses
  const ingredients: string[] = [];
  let current = '';
  let parenDepth = 0;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (char === '(' || char === '[') parenDepth++;
    else if (char === ')' || char === ']') parenDepth = Math.max(0, parenDepth - 1);

    if ((char === ',' || char === ';' || char === '\n') && parenDepth === 0) {
      const trimmed = current.trim();
      if (trimmed) ingredients.push(trimmed);
      current = '';
    } else {
      current += char;
    }
  }

  const finalTrimmed = current.trim();
  if (finalTrimmed) ingredients.push(finalTrimmed);

  return ingredients.filter(item => item.length > 1 && !/^\d+\.?$/.test(item));
}

// Extract numeric nutrition claims if present (e.g. "Sodium: 420mg")
export function extractNutritionHighlights(text: string): {
  sodiumMg?: number;
  netCarbsG?: number;
  sugarsG?: number;
  hasCrossContaminationWarning: boolean;
} {
  const lower = text.toLowerCase();
  
  let sodiumMg: number | undefined;
  const sodiumMatch = lower.match(/sodium\s*[:\-]?\s*(\d+)\s*mg/);
  if (sodiumMatch) {
    sodiumMg = parseInt(sodiumMatch[1], 10);
  }

  let netCarbsG: number | undefined;
  const carbMatch = lower.match(/(?:total\s+carbohydrate|carbs|net\s+carbs)\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*g/);
  if (carbMatch) {
    netCarbsG = parseFloat(carbMatch[1]);
  }

  let sugarsG: number | undefined;
  const sugarMatch = lower.match(/(?:sugars?|total\s+sugars?|added\s+sugars?)\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*g/);
  if (sugarMatch) {
    sugarsG = parseFloat(sugarMatch[1]);
  }

  const hasCrossContaminationWarning = 
    lower.includes('may contain') || 
    lower.includes('processed in a facility') || 
    lower.includes('manufactured on equipment that');

  return {
    sodiumMg,
    netCarbsG,
    sugarsG,
    hasCrossContaminationWarning
  };
}

export function analyzeIngredients(
  rawText: string,
  profiles: FamilyProfile[],
  productName?: string
): ScanSafetyResult {
  const lowerText = rawText.toLowerCase();
  const parsedIngredients = parseIngredientsText(rawText);
  const nutrition = extractNutritionHighlights(rawText);

  const flaggedMatches: IngredientMatch[] = [];

  // 1. Check Son: Severe Anaphylactic Peanuts, Tree Nuts, Soy
  const sonProfile = profiles.find(p => p.id === 'son');
  let sonCritical = false;
  let sonReasons: string[] = [];

  // Check peanuts
  for (const kw of PEANUT_KEYWORDS) {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(lowerText)) {
      sonCritical = true;
      sonReasons.push(`Contains Peanuts (${kw})`);
      flaggedMatches.push({
        ingredient: kw,
        matchedRule: 'Severe Anaphylactic Peanut Allergy',
        status: 'critical_allergen',
        reason: 'CRITICAL: Severe life-threatening peanut allergen detected!',
        affectsMemberIds: ['son'],
        suggestedSwap: 'Sunflower Seed Butter (SunButter), Certified Nut-Free Tahini'
      });
      break;
    }
  }

  // Check tree nuts
  for (const kw of TREE_NUT_KEYWORDS) {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(lowerText)) {
      sonCritical = true;
      sonReasons.push(`Contains Tree Nuts (${kw})`);
      flaggedMatches.push({
        ingredient: kw,
        matchedRule: 'Tree Nut Allergy',
        status: 'critical_allergen',
        reason: `CRITICAL: Tree nut allergen (${kw}) unsafe for Son.`,
        affectsMemberIds: ['son'],
        suggestedSwap: 'Roasted pumpkin seeds, toasted sesame, certified nut-free seeds'
      });
      break;
    }
  }

  // Check soy
  for (const kw of SOY_KEYWORDS) {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(lowerText)) {
      sonCritical = true;
      sonReasons.push(`Contains Soy (${kw})`);
      flaggedMatches.push({
        ingredient: kw,
        matchedRule: 'Soy Allergy',
        status: 'critical_allergen',
        reason: `CRITICAL: Soy allergen (${kw}) triggers severe allergy for Son.`,
        affectsMemberIds: ['son'],
        suggestedSwap: 'Organic Coconut Aminos, Sunflower Lecithin, Pea Protein'
      });
      break;
    }
  }

  // Cross-contamination alert for Son
  if (nutrition.hasCrossContaminationWarning && (lowerText.includes('peanut') || lowerText.includes('nut') || lowerText.includes('soy'))) {
    sonCritical = true;
    sonReasons.push('Cross-facility allergy warning');
    flaggedMatches.push({
      ingredient: 'Facility cross-contamination notice',
      matchedRule: 'Cross-Contamination Warning',
      status: 'critical_allergen',
      reason: 'Package states facility processes peanuts or soy. High risk for severe anaphylaxis.',
      affectsMemberIds: ['son'],
      suggestedSwap: 'Look for Certified Nut-Free / Top 9 Allergen-Free Facility seal'
    });
  }

  // 2. Check Grandma: Low Sodium & Diabetic
  let grandmaCaution = false;
  let grandmaReasons: string[] = [];

  // Sodium threshold check
  if (nutrition.sodiumMg && nutrition.sodiumMg > 300) {
    grandmaCaution = true;
    const severity = nutrition.sodiumMg > 650 ? 'High' : 'Moderate';
    grandmaReasons.push(`${severity} Sodium (${nutrition.sodiumMg}mg / serving)`);
    flaggedMatches.push({
      ingredient: `Sodium content (${nutrition.sodiumMg}mg)`,
      matchedRule: 'Grandma: Low-Sodium Limit (Target < 140mg/serving)',
      status: 'caution_diet',
      reason: `Exceeds Grandma's single-serving sodium cap (< 140mg for low sodium claim).`,
      affectsMemberIds: ['grandma'],
      suggestedSwap: 'Low-sodium / No salt added version, season with lemon & nutritional yeast'
    });
  } else {
    // Check keyword sodium additives
    for (const kw of SODIUM_KEYWORDS) {
      if (new RegExp(`\\b${kw}\\b`, 'i').test(lowerText)) {
        grandmaCaution = true;
        grandmaReasons.push(`Contains ${kw}`);
        flaggedMatches.push({
          ingredient: kw,
          matchedRule: 'High Sodium Additive',
          status: 'caution_diet',
          reason: `High sodium additive (${kw}) may elevate blood pressure.`,
          affectsMemberIds: ['grandma'],
          suggestedSwap: 'Potassium salt alternative or fresh herb seasoning'
        });
        break;
      }
    }
  }

  // Sugar / High Glycemic check for Grandma
  if ((nutrition.sugarsG && nutrition.sugarsG > 5) || (nutrition.netCarbsG && nutrition.netCarbsG > 18)) {
    grandmaCaution = true;
    grandmaReasons.push(`High Sugar/Carb impact (${nutrition.sugarsG || 0}g sugar)`);
    flaggedMatches.push({
      ingredient: `High Sugar (${nutrition.sugarsG || 0}g)`,
      matchedRule: 'Diabetic Blood Glucose Control',
      status: 'caution_diet',
      reason: 'Rapid spike hazard for Type 2 blood sugar target (< 120 mg/dL).',
      affectsMemberIds: ['grandma'],
      suggestedSwap: 'Pure Stevia, Monk Fruit, Allulose'
    });
  } else {
    for (const kw of SUGAR_GLYCEMIC_KEYWORDS) {
      if (new RegExp(`\\b${kw}\\b`, 'i').test(lowerText)) {
        grandmaCaution = true;
        grandmaReasons.push(`Contains ${kw}`);
        flaggedMatches.push({
          ingredient: kw,
          matchedRule: 'High Glycemic Sugar / Additive',
          status: 'caution_diet',
          reason: `Concentrated glycemic sweetener (${kw}) poses glucose spike risk.`,
          affectsMemberIds: ['grandma'],
          suggestedSwap: 'Monk fruit or cinnamon spiced alternative'
        });
        break;
      }
    }
  }

  // 3. Check Mom: Keto / Low-Carb
  let momCaution = false;
  let momReasons: string[] = [];

  if (nutrition.netCarbsG && nutrition.netCarbsG > 10) {
    momCaution = true;
    momReasons.push(`High Net Carbs (${nutrition.netCarbsG}g)`);
    flaggedMatches.push({
      ingredient: `Net Carbs (${nutrition.netCarbsG}g)`,
      matchedRule: 'Mom: Strict Keto (< 20g net carbs/day)',
      status: 'caution_diet',
      reason: `Consumes over 50% of daily keto carbohydrate allocation.`,
      affectsMemberIds: ['mom'],
      suggestedSwap: 'Avocado, keto almond flour base, hemp hearts'
    });
  } else {
    for (const kw of HIGH_CARB_KEYWORDS) {
      if (new RegExp(`\\b${kw}\\b`, 'i').test(lowerText)) {
        momCaution = true;
        momReasons.push(`Contains ${kw}`);
        flaggedMatches.push({
          ingredient: kw,
          matchedRule: 'Keto Starch & Sugar Restriction',
          status: 'caution_diet',
          reason: `High glycemic carbohydrate (${kw}) interrupts nutritional ketosis.`,
          affectsMemberIds: ['mom'],
          suggestedSwap: 'Almond flour, chia seed pudding, or grass-fed ghee'
        });
        break;
      }
    }
  }

  // Deduplicate flagged matches
  const uniqueMatches = flaggedMatches.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.ingredient.toLowerCase() === item.ingredient.toLowerCase())
  );

  // Overall evaluation
  let overallStatus: 'safe_for_all' | 'caution' | 'critical_alert' = 'safe_for_all';
  let headline = 'SAFE FOR ALL FAMILY MEMBERS';
  let summary = 'Verified clear of allergens, severe diet conflicts, and critical cross-contaminations.';

  if (sonCritical) {
    overallStatus = 'critical_alert';
    headline = 'CRITICAL ALLERGY ALERT — UNSAFE FOR SON!';
    summary = `Contains ${sonReasons.join(', ')}. Immediate severe anaphylaxis danger. Do NOT allow Son to consume.`;
  } else if (grandmaCaution || momCaution) {
    overallStatus = 'caution';
    headline = 'CAUTION: DIETARY CONFLICTS DETECTED';
    const notes: string[] = [];
    if (grandmaCaution) notes.push(`Grandma (${grandmaReasons.join(', ')})`);
    if (momCaution) notes.push(`Mom (${momReasons.join(', ')})`);
    summary = `Allergen-free for Son, but contains dietary conflicts: ${notes.join('; ')}.`;
  }

  return {
    overallStatus,
    headline,
    summary,
    memberAssessments: [
      {
        memberId: 'son',
        memberName: 'Son (Leo)',
        status: sonCritical ? 'critical' : 'safe',
        message: sonCritical
          ? `WARNING: ${sonReasons.join(' & ')} detected! Keep EpiPen accessible.`
          : 'Safe: Free from Peanuts, Tree Nuts, and Soy allergens.',
        flaggedIngredients: uniqueMatches.filter(m => m.affectsMemberIds.includes('son'))
      },
      {
        memberId: 'grandma',
        memberName: 'Grandma (Rose)',
        status: grandmaCaution ? 'caution' : 'safe',
        message: grandmaCaution
          ? `Caution: ${grandmaReasons.join(', ')} may impact blood sugar or sodium goals.`
          : 'Safe: Complies with low-sodium and diabetic dietary guidelines.',
        flaggedIngredients: uniqueMatches.filter(m => m.affectsMemberIds.includes('grandma'))
      },
      {
        memberId: 'mom',
        memberName: 'Mom (Elena)',
        status: momCaution ? 'caution' : 'safe',
        message: momCaution
          ? `Caution: ${momReasons.join(', ')} conflicts with Keto carb threshold.`
          : 'Safe: Compatible with low-carb / keto nutritional profile.',
        flaggedIngredients: uniqueMatches.filter(m => m.affectsMemberIds.includes('mom'))
      }
    ],
    extractedIngredients: parsedIngredients.length > 0 ? parsedIngredients : [rawText.slice(0, 120)],
    nutritionalFlags: nutrition,
    productName: productName || 'Scanned Item',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
