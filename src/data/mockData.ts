import { FamilyProfile, RecipeMeal, CareTask } from '../types/family';

export const INITIAL_PROFILES: FamilyProfile[] = [
  {
    id: 'mom',
    name: 'Mom (Elena)',
    relation: 'Mother',
    roleTitle: 'Elena • Keto & Low-Carb',
    age: 38,
    avatarColor: 'emerald',
    avatarBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    avatarImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
    primaryDietBadge: 'Keto / Low-Carb',
    allergies: [],
    dietaryGoals: [
      {
        id: 'keto_macro',
        name: 'Ketogenic Nutrition',
        type: 'keto',
        restrictedKeywords: ['cane sugar', 'corn syrup', 'wheat flour', 'dextrose', 'maltodextrin', 'rice flour', 'potatoes', 'oats'],
        cautionKeywords: ['honey', 'tapioca', 'high starch'],
        maxCarbsPerServingG: 10,
        maxSugarPerServingG: 3,
        notes: 'Target < 20g net carbs/day. Focus on healthy fats, avocado, leafy greens, electrolytes.'
      }
    ],
    specialInstructions: 'Watch out for sneaky maltodextrin and starches in spice rubs. Requires daily electrolyte replenishment.',
    todayStats: {
      hydrationMl: 1950,
      targetHydrationMl: 2500,
      primaryMetricLabel: 'Net Carbs Today',
      primaryMetricValue: '12g / 20g max',
      primaryMetricStatus: 'optimal'
    }
  },
  {
    id: 'son',
    name: 'Son (Leo)',
    relation: 'Son',
    roleTitle: 'Leo (Age 8) • Severe Peanut & Soy Allergy',
    age: 8,
    avatarColor: 'rose',
    avatarBg: 'bg-rose-100 text-rose-800 border-rose-300',
    avatarImage: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=160&q=80',
    primaryDietBadge: 'Severe Peanut & Soy Allergy',
    allergies: [
      {
        id: 'peanut_severe',
        name: 'Peanuts & Groundnuts',
        severity: 'severe_anaphylactic',
        keywords: ['peanut', 'peanuts', 'peanut butter', 'peanut oil', 'arachis', 'groundnut'],
        notes: 'Strict zero-tolerance. Carry EpiPen 0.3mg auto-injector everywhere.'
      },
      {
        id: 'tree_nut_severe',
        name: 'Tree Nuts',
        severity: 'severe_anaphylactic',
        keywords: ['almond', 'walnut', 'cashew', 'pecan', 'pistachio', 'hazelnut', 'macadamia'],
        notes: 'Avoid shared bakery facilities and unverified seed mixes.'
      },
      {
        id: 'soy_severe',
        name: 'Soybeans & Derivatives',
        severity: 'severe_anaphylactic',
        keywords: ['soy', 'soybean', 'soy sauce', 'soy lecithin', 'tofu', 'tamari', 'edamame'],
        notes: 'Triggers asthma and severe facial swelling. Strictly avoid soy lecithin.'
      }
    ],
    dietaryGoals: [],
    emergencyContact: {
      name: 'Dr. Sarah Lin (Pediatric Allergist)',
      phone: '+1 (555) 438-2947',
      relation: 'Children’s Hospital Allergy Clinic'
    },
    specialInstructions: 'EpiPen is stored in Kitchen First-Aid Box (Shelf 1) & Leo’s School Backpack.',
    todayStats: {
      hydrationMl: 1400,
      targetHydrationMl: 1800,
      primaryMetricLabel: 'EpiPen Status',
      primaryMetricValue: 'Verified Active (Nov 2026)',
      primaryMetricStatus: 'optimal'
    }
  },
  {
    id: 'grandma',
    name: 'Grandma (Rose)',
    relation: 'Grandmother',
    roleTitle: 'Rose (Age 71) • Low-Sodium & Diabetic',
    age: 71,
    avatarColor: 'teal',
    avatarBg: 'bg-teal-100 text-teal-800 border-teal-300',
    avatarImage: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=160&q=80',
    primaryDietBadge: 'Low-Sodium & Type 2 Diabetic',
    allergies: [],
    dietaryGoals: [
      {
        id: 'low_sodium',
        name: 'Cardiac Low-Sodium',
        type: 'low_sodium',
        restrictedKeywords: ['monosodium glutamate', 'msg', 'sodium nitrate', 'disodium phosphate', 'cured salt', 'brine'],
        cautionKeywords: ['sea salt', 'baking soda'],
        maxSodiumPerServingMg: 200,
        notes: 'Daily limit < 1500mg. Serving limit < 140mg for strict low sodium claim.'
      },
      {
        id: 'diabetic_glycemic',
        name: 'Type 2 Blood Glucose Control',
        type: 'diabetic',
        restrictedKeywords: ['high fructose corn syrup', 'corn syrup', 'dextrose', 'maltodextrin', 'white sugar', 'tapioca syrup'],
        cautionKeywords: ['honey', 'molasses', 'fruit juice concentrate'],
        maxSugarPerServingG: 4,
        notes: 'Prevent glycemic spikes. Target post-prandial glucose < 140 mg/dL.'
      }
    ],
    emergencyContact: {
      name: 'Heart & Vascular Care - Dr. Patel',
      phone: '+1 (555) 892-1204',
      relation: 'Cardiologist'
    },
    specialInstructions: 'Check blood pressure twice daily. Season food with lemon, garlic, and fresh herbs instead of salt.',
    todayStats: {
      hydrationMl: 1650,
      targetHydrationMl: 2000,
      primaryMetricLabel: 'Blood Pressure Today',
      primaryMetricValue: '118/76 mmHg (Normal)',
      primaryMetricStatus: 'optimal'
    }
  }
];

export interface PresetSample {
  id: string;
  name: string;
  label: string;
  category: string;
  iconName: string;
  expectedResult: 'critical' | 'caution' | 'safe';
  badgeLabel: string;
  rawIngredients: string;
}

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: 'sample_peanut_bar',
    name: 'Peanut Butter Crunch Energy Bar',
    label: 'Peanut Granola Bar',
    category: 'Snacks & Bars',
    iconName: 'AlertTriangle',
    expectedResult: 'critical',
    badgeLabel: 'CRITICAL ALERT for Son',
    rawIngredients: `INGREDIENTS: Whole grain rolled oats, roasted peanuts, brown rice syrup, peanut butter (dry roasted peanuts, palm oil, salt), soy lecithin, cane sugar, sea salt, natural vanilla flavor. CONTAINS: PEANUTS, SOY. MAY CONTAIN TRACES OF TREE NUTS. Sodium: 180mg. Total Carbohydrate: 26g. Sugars: 12g.`
  },
  {
    id: 'sample_low_sodium_soup',
    name: 'Garden Harvest Low-Sodium Veggie Soup',
    label: 'Low-Sodium Soup',
    category: 'Prepared Meals',
    iconName: 'CheckCircle',
    expectedResult: 'safe',
    badgeLabel: 'SAFE FOR ALL',
    rawIngredients: `INGREDIENTS: Filtered water, organic carrots, organic celery, organic zucchini, organic diced tomatoes, organic olive oil, garlic powder, onion powder, thyme, rosemary, black pepper, sea salt (Sodium: 110mg). Total Carbohydrate: 6g. Sugars: 2g. Net Carbs: 4g. Allergen statement: Produced in a certified peanut-free and soy-free facility.`
  },
  {
    id: 'sample_soy_dumplings',
    name: 'Traditional Pork & Cabbage Dumplings',
    label: 'Asian Soy Dumplings',
    category: 'Frozen Foods',
    iconName: 'Flame',
    expectedResult: 'critical',
    badgeLabel: 'CRITICAL: Soy + Sodium',
    rawIngredients: `INGREDIENTS: Filling: Pork, cabbage, soy sauce (water, soybeans, wheat, salt), green onions, sesame oil, hydrolyzed soy protein, monosodium glutamate (MSG), ginger, salt (Sodium: 890mg). Wrapper: Enriched wheat flour, water, cornstarch. CONTAINS: WHEAT, SOY.`
  },
  {
    id: 'sample_keto_almond_cup',
    name: 'Artisan Dark Chocolate Almond Butter Cup',
    label: 'Keto Almond Cup',
    category: 'Treats',
    iconName: 'ShieldAlert',
    expectedResult: 'critical',
    badgeLabel: 'ALERT: Tree Nuts (Son)',
    rawIngredients: `INGREDIENTS: Organic cocoa butter, organic roasted almond butter (almonds), erythritol, monk fruit extract, organic coconut oil, pink Himalayan sea salt, vanilla bean powder. Net Carbs: 2g. Sugars: 0g. Sodium: 85mg. CONTAINS: ALMONDS (TREE NUTS).`
  },
  {
    id: 'sample_oat_milk',
    name: 'Creamy Nut-Free Barista Oat Milk',
    label: 'Certified Nut-Free Oat Milk',
    category: 'Beverages',
    iconName: 'HeartHandshake',
    expectedResult: 'safe',
    badgeLabel: 'SAFE FOR ALL',
    rawIngredients: `INGREDIENTS: Filtered water, certified gluten-free whole oats, cold-pressed sunflower oil, sea salt (Sodium: 90mg), calcium carbonate, potassium citrate. 100% Free from Peanuts, Tree Nuts, Dairy, and Soy. Total Carbohydrate: 7g. Sugars: 1g.`
  },
  {
    id: 'sample_cauli_stirfry',
    name: 'Green Goddess Cauliflower Stir-Fry Base',
    label: 'Diabetic & Keto Cauli Stir-Fry',
    category: 'Produce & Meal Kits',
    iconName: 'Sparkles',
    expectedResult: 'safe',
    badgeLabel: 'SAFE FOR ALL',
    rawIngredients: `INGREDIENTS: Riced cauliflower, organic broccoli florets, baby spinach, organic cold-pressed avocado oil, organic coconut aminos (low sodium, soy-free), fresh garlic, ginger, toasted sesame seeds, lemon juice. Sodium: 120mg. Total Carbohydrate: 4g. Fiber: 2g. Net Carbs: 2g. Sugars: 1g.`
  }
];

export const UNIFIED_MEALS: RecipeMeal[] = [
  {
    id: 'meal_med_salmon',
    title: 'Citrus Herb Wild Salmon with Roasted Tuscan Greens',
    category: 'Dinner',
    cookTimeMins: 22,
    prepTimeMins: 12,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
    description: 'A harmonious family dinner designed from a single cooking sheet, accommodating keto macros, strict allergen safety, and cardiac low-sodium targets.',
    sharedBase: [
      '4 Wild Alaskan Salmon fillets (approx 6 oz each)',
      '1 lb tender fresh asparagus spears, trimmed',
      '2 medium zucchini, halved and sliced into half-moons',
      'Fresh lemon wheels, crushed garlic, and fresh rosemary sprigs',
      'Extra virgin olive oil (certified pure, single-origin)'
    ],
    sharedInstructions: [
      'Preheat oven to 400°F (200°C). Arrange salmon and tossed vegetables onto parchment-lined baking sheet.',
      'Drizzle all fillets with fresh squeezed lemon juice and rub gently with crushed fresh garlic and rosemary.',
      'Divide into custom seasoning zones before placing into oven for 16-18 minutes until salmon flakes cleanly with a fork.'
    ],
    customPlatings: [
      {
        memberId: 'mom',
        memberName: 'Mom (Elena)',
        dietTag: 'Keto / Low-Carb',
        swapNotes: 'Double avocado oil drizzle; plated with extra asparagus spears and roasted garlic herb butter.',
        platingTip: 'Top salmon with 1 tbsp whipped grass-fed garlic butter. Keep carbs minimal (Net 3.5g).',
        carbCountG: 3.5,
        sodiumMg: 190,
        allergenSafeConfirmed: true
      },
      {
        memberId: 'son',
        memberName: 'Son (Leo)',
        dietTag: 'Severe Nut & Soy Free',
        swapNotes: 'Prepared on dedicated allergen-safe sheet parchment. Certified nut-free olive oil only. Side of roasted potatoes.',
        platingTip: 'Served with roasted cubed golden baby potatoes and crunchy zucchini chips with sweet lemon drizzle.',
        carbCountG: 24,
        sodiumMg: 210,
        allergenSafeConfirmed: true
      },
      {
        memberId: 'grandma',
        memberName: 'Grandma (Rose)',
        dietTag: 'Low-Sodium & Diabetic',
        swapNotes: 'Zero added salt zone. Seasoned generously with fresh dill, lemon zest, potassium-rich herbs, and nutritional yeast.',
        platingTip: 'Plated with high-fiber zucchini and asparagus. Delicious natural sweetness from roasted lemon slices (< 95mg sodium total).',
        carbCountG: 6,
        sodiumMg: 92,
        allergenSafeConfirmed: true
      }
    ],
    totalSafetyScore: 100,
    tags: ['Heart-Healthy', 'Keto-Friendly', 'Allergen-Free', 'High-Omega-3']
  },
  {
    id: 'meal_taco_night',
    title: 'Fiesta Turkey & Cilantro-Lime Family Bowls',
    category: 'Dinner',
    cookTimeMins: 20,
    prepTimeMins: 15,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=600&q=80',
    description: 'Build-your-own bowl station using lean ground turkey seasoned with homemade allergen-safe cumin & smoked paprika.',
    sharedBase: [
      '1.25 lbs lean ground turkey breast (93/7)',
      'Homemade taco spice (cumin, smoked paprika, oregano, onion powder, garlic powder)',
      'Crisp romaine lettuce shreds & diced Roma tomatoes',
      'Fresh lime wedges & chopped fresh cilantro',
      'Homemade guacamole (fresh Hass avocados, lime, red onion, zero salt added)'
    ],
    sharedInstructions: [
      'Brown turkey in large cast-iron skillet over medium heat with diced onions and garlic.',
      'Stir in homemade spice blend (avoid store-bought packets which often contain soy protein or maltodextrin).',
      'Simmer with 1/3 cup bone broth for 5 minutes until rich and fragrant. Set up assembly line for individual plating.'
    ],
    customPlatings: [
      {
        memberId: 'mom',
        memberName: 'Mom (Elena)',
        dietTag: 'Keto / Low-Carb',
        swapNotes: 'Keto Bowl: Base of shredded crisp romaine, turkey, generous avocado guacamole, and full-fat sour cream.',
        platingTip: 'Zero tortillas or beans. Net carbs: 4g. High satiety healthy fats.',
        carbCountG: 4,
        sodiumMg: 180,
        allergenSafeConfirmed: true
      },
      {
        memberId: 'son',
        memberName: 'Son (Leo)',
        dietTag: 'Severe Nut & Soy Free',
        swapNotes: 'Certified 100% nut-free corn tortilla shells, warm turkey, fresh mild salsa, and shredded cheddar.',
        platingTip: 'Kid-friendly crispy hard shell taco trio. 100% peanut and soy safe guarantee.',
        carbCountG: 28,
        sodiumMg: 240,
        allergenSafeConfirmed: true
      },
      {
        memberId: 'grandma',
        memberName: 'Grandma (Rose)',
        dietTag: 'Low-Sodium & Diabetic',
        swapNotes: 'Cauliflower rice & black bean fiber bowl. Turkey seasoned separately with zero salt; topped with fresh lime and cilantro.',
        platingTip: 'Rich in soluble fiber from black beans (1/4 cup) and antioxidants. Low glycemic index; only 115mg sodium.',
        carbCountG: 14,
        sodiumMg: 115,
        allergenSafeConfirmed: true
      }
    ],
    totalSafetyScore: 100,
    tags: ['Custom Bowls', 'Family Favorite', 'Low-GI', 'Soy-Free']
  },
  {
    id: 'meal_tuscan_chicken',
    title: 'Golden Garlic & Rosemary Skillet Chicken Breast',
    category: 'Lunch',
    cookTimeMins: 25,
    prepTimeMins: 10,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
    description: 'Juicy seared chicken breast infused with caramelized shallots, sun-ripened cherry tomatoes, and garden fresh basil.',
    sharedBase: [
      '4 organic free-range chicken cutlets',
      '2 cups multi-colored cherry tomatoes',
      '4 cloves garlic, slivered',
      'Fresh rosemary and Italian sweet basil leaves',
      'Cold-pressed olive oil'
    ],
    sharedInstructions: [
      'Sear chicken breast in large skillet with 1 tbsp olive oil for 5 minutes per side until golden.',
      'Add cherry tomatoes, slivered garlic, and rosemary to the skillet; cover and simmer gently until tomatoes blister.',
      'Finish with fresh basil ribbons and prepare individual plate variations.'
    ],
    customPlatings: [
      {
        memberId: 'mom',
        memberName: 'Mom (Elena)',
        dietTag: 'Keto / Low-Carb',
        swapNotes: 'Plated over bed of sautéed spinach with 2 tbsp grated Parmigiano-Reggiano and extra olive oil drizzle.',
        platingTip: 'High protein, dense greens, net carbs under 3g.',
        carbCountG: 2.8,
        sodiumMg: 160,
        allergenSafeConfirmed: true
      },
      {
        memberId: 'son',
        memberName: 'Son (Leo)',
        dietTag: 'Severe Nut & Soy Free',
        swapNotes: 'Served with allergen-safe penne pasta tossed in tomato basil juices and mild garlic butter.',
        platingTip: 'Guaranteed safe pasta made in dedicated nut-free facility.',
        carbCountG: 32,
        sodiumMg: 140,
        allergenSafeConfirmed: true
      },
      {
        memberId: 'grandma',
        memberName: 'Grandma (Rose)',
        dietTag: 'Low-Sodium & Diabetic',
        swapNotes: 'Plated over steamed broccoli florets and quinoa. Sweet roasted tomato pan sauce provides robust flavor without salt.',
        platingTip: 'Potassium from tomatoes and broccoli balances vascular health. Under 110mg sodium.',
        carbCountG: 12,
        sodiumMg: 108,
        allergenSafeConfirmed: true
      }
    ],
    totalSafetyScore: 100,
    tags: ['Quick 30-min', 'Gluten-Free Base', 'Nut-Free', 'Low Sodium']
  }
];

export const INITIAL_CARE_TASKS: CareTask[] = [
  // Son (Leo)
  {
    id: 'task_leo_epipen',
    memberId: 'son',
    title: 'EpiPen Backpack & Expiry Check',
    type: 'allergy_kit',
    dosageOrDetail: 'Ensure two 0.3mg auto-injectors are in side pouch with trainer',
    timeSlot: 'morning',
    timeLabel: '7:45 AM',
    completed: true,
    completedAt: '07:48 AM',
    criticalSafety: true
  },
  {
    id: 'task_leo_allergy_med',
    memberId: 'son',
    title: 'Daily Cetirizine (Allergy Defense)',
    type: 'medication',
    dosageOrDetail: '5mg chewable tablet with water',
    timeSlot: 'morning',
    timeLabel: '8:00 AM',
    completed: true,
    completedAt: '08:05 AM'
  },
  {
    id: 'task_leo_snack_check',
    memberId: 'son',
    title: 'School Safe Snack Audit',
    type: 'allergy_kit',
    dosageOrDetail: 'Inspect afternoon lunchbox treats for nut-free certification seal',
    timeSlot: 'afternoon',
    timeLabel: '1:30 PM',
    completed: false
  },

  // Grandma (Rose)
  {
    id: 'task_rose_glucose_am',
    memberId: 'grandma',
    title: 'Fasting Blood Glucose Test',
    type: 'vital_check',
    dosageOrDetail: 'Target 90-115 mg/dL (Logged 104 mg/dL today)',
    timeSlot: 'morning',
    timeLabel: '7:30 AM',
    completed: true,
    completedAt: '07:32 AM',
    criticalSafety: true
  },
  {
    id: 'task_rose_metformin',
    memberId: 'grandma',
    title: 'Metformin HCl (Glycemic Control)',
    type: 'medication',
    dosageOrDetail: '500mg extended-release with breakfast',
    timeSlot: 'morning',
    timeLabel: '8:30 AM',
    completed: true,
    completedAt: '08:35 AM'
  },
  {
    id: 'task_rose_bp_check',
    memberId: 'grandma',
    title: 'Resting Blood Pressure Log',
    type: 'vital_check',
    dosageOrDetail: 'Omron arm cuff: recorded 118/76 mmHg',
    timeSlot: 'afternoon',
    timeLabel: '2:00 PM',
    completed: true,
    completedAt: '02:04 PM'
  },
  {
    id: 'task_rose_lisinopril',
    memberId: 'grandma',
    title: 'Lisinopril (Blood Pressure Support)',
    type: 'medication',
    dosageOrDetail: '10mg oral tablet with full glass of water',
    timeSlot: 'evening',
    timeLabel: '8:00 PM',
    completed: false
  },
  {
    id: 'task_rose_evening_walk',
    memberId: 'grandma',
    title: 'Gentle 15-Minute Garden Walk',
    type: 'vital_check',
    dosageOrDetail: 'Post-dinner insulin sensitivity boost',
    timeSlot: 'evening',
    timeLabel: '7:00 PM',
    completed: false
  },

  // Mom (Elena)
  {
    id: 'task_elena_electrolytes',
    memberId: 'mom',
    title: 'Keto Mineral Electrolyte Drops',
    type: 'hydration_nutrition',
    dosageOrDetail: 'Potassium 300mg + Magnesium glycinate 200mg in water',
    timeSlot: 'morning',
    timeLabel: '7:00 AM',
    completed: true,
    completedAt: '07:15 AM'
  },
  {
    id: 'task_elena_omega3',
    memberId: 'mom',
    title: 'Triple Strength Omega-3 Fish Oil',
    type: 'medication',
    dosageOrDetail: '1200mg EPA/DHA with healthy breakfast fat',
    timeSlot: 'morning',
    timeLabel: '8:15 AM',
    completed: true,
    completedAt: '08:20 AM'
  },
  {
    id: 'task_elena_water_tracker',
    memberId: 'mom',
    title: 'Afternoon Hydration Milestone',
    type: 'hydration_nutrition',
    dosageOrDetail: 'Reach 1.8 Liters filtered water benchmark',
    timeSlot: 'afternoon',
    timeLabel: '3:00 PM',
    completed: true,
    completedAt: '03:12 PM'
  },
  {
    id: 'task_elena_magnesium_night',
    memberId: 'mom',
    title: 'Magnesium L-Threonate & Sleep Tea',
    type: 'hydration_nutrition',
    dosageOrDetail: '144mg elemental magnesium for muscle relaxation & deep sleep',
    timeSlot: 'evening',
    timeLabel: '9:30 PM',
    completed: false
  }
];
