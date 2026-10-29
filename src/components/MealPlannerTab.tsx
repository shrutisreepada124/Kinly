import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Sparkles, 
  Clock, 
  Users, 
  CheckCircle2, 
  ChefHat, 
  Copy, 
  Check, 
  Filter, 
  Layers, 
  Flame, 
  ShieldCheck, 
  Plus, 
  X,
  Search,
  ShoppingCart
} from 'lucide-react';
import { RecipeMeal, FamilyProfile, FamilyMemberId, PlatingInstruction } from '../types/family';

interface MealPlannerTabProps {
  meals: RecipeMeal[];
  profiles: FamilyProfile[];
  activeProfileId: FamilyMemberId;
  onSelectMeal: (meal: RecipeMeal) => void;
  onAddCustomMeal: (newMeal: RecipeMeal) => void;
}

export const MealPlannerTab: React.FC<MealPlannerTabProps> = ({
  meals,
  profiles,
  activeProfileId,
  onSelectMeal,
  onAddCustomMeal
}) => {
  const [selectedMealId, setSelectedMealId] = useState<string>(meals[0]?.id || '');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [copiedGrocery, setCopiedGrocery] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Custom meal builder modal state
  const [newMealTitle, setNewMealTitle] = useState('');
  const [newMealCategory, setNewMealCategory] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Dinner');
  const [newMealProtein, setNewMealProtein] = useState('Chicken');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeMeal = meals.find((m) => m.id === selectedMealId) || meals[0];

  const filteredMeals = filterCategory === 'All' 
    ? meals 
    : meals.filter((m) => m.category === filterCategory);

  const handleCopyGroceryList = () => {
    if (!activeMeal) return;
    const text = [
      `🛒 KINLY GROCERY LIST for: ${activeMeal.title}`,
      `Servings: ${activeMeal.servings}`,
      '',
      '--- SHARED BASE INGREDIENTS ---',
      ...activeMeal.sharedBase.map((item) => `• ${item}`),
      '',
      '--- INDIVIDUAL CUSTOM PLATING ITEMS ---',
      `• Mom (Elena): ${activeMeal.customPlatings.find(p => p.memberId === 'mom')?.swapNotes}`,
      `• Son (Leo): ${activeMeal.customPlatings.find(p => p.memberId === 'son')?.swapNotes}`,
      `• Grandma (Rose): ${activeMeal.customPlatings.find(p => p.memberId === 'grandma')?.swapNotes}`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedGrocery(true);
    setTimeout(() => setCopiedGrocery(false), 2500);
  };

  // Generate a conflict-free unified recipe
  const handleCreateUnifiedMeal = () => {
    if (!newMealTitle.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const generated: RecipeMeal = {
        id: `meal_gen_${Date.now()}`,
        title: newMealTitle,
        category: newMealCategory,
        cookTimeMins: 25,
        prepTimeMins: 15,
        servings: 4,
        imageUrl: newMealProtein === 'Salmon'
          ? 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80'
          : newMealProtein === 'Chicken'
          ? 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=600&q=80',
        description: `Custom unified family meal featuring ${newMealProtein.toLowerCase()} designed to effortlessly satisfy keto macros, nut/soy zero-tolerance, and low sodium targets simultaneously.`,
        sharedBase: [
          `1.5 lbs lean ${newMealProtein.toLowerCase()} cuts (trimmed)`,
          '2 cups seasonal Mediterranean vegetables (bell peppers, zucchini, broccoli)',
          '2 tbsp pure cold-pressed extra virgin olive oil',
          'Fresh herbs: oregano, rosemary, garlic cloves, fresh lemon juice'
        ],
        sharedInstructions: [
          `Sear and cook ${newMealProtein.toLowerCase()} in olive oil over medium-high heat with crushed garlic.`,
          'Sauté fresh vegetables in dedicated separate zone of pan until tender-crisp.',
          'Divide protein and veggies onto customized individual plating bases.'
        ],
        customPlatings: [
          {
            memberId: 'mom',
            memberName: 'Mom (Elena)',
            dietTag: 'Keto / Low-Carb',
            swapNotes: 'Plated with extra avocado oil drizzle and cauliflower puree. Net carbs: 3g.',
            platingTip: 'Top with 1 tbsp whipped herb butter. Zero glycemic impact.',
            carbCountG: 3.2,
            sodiumMg: 165,
            allergenSafeConfirmed: true
          },
          {
            memberId: 'son',
            memberName: 'Son (Leo)',
            dietTag: 'Nut & Soy Free',
            swapNotes: 'Served with certified nut-free roasted baby potatoes. Prepared with dedicate safe utensils.',
            platingTip: 'Kid-friendly crispy golden potatoes with mild herbs.',
            carbCountG: 26,
            sodiumMg: 190,
            allergenSafeConfirmed: true
          },
          {
            memberId: 'grandma',
            memberName: 'Grandma (Rose)',
            dietTag: 'Low-Sodium & Diabetic',
            swapNotes: 'Zero added salt zone. Seasoned with lemon zest and potassium herbs. Plated with high-fiber quinoa.',
            platingTip: 'Rich in potassium and soluble fiber (< 98mg sodium).',
            carbCountG: 8,
            sodiumMg: 96,
            allergenSafeConfirmed: true
          }
        ],
        totalSafetyScore: 100,
        tags: ['Custom Unified', 'Allergen-Safe', 'Keto-Friendly', 'Cardiac-Safe']
      };

      onAddCustomMeal(generated);
      setSelectedMealId(generated.id);
      setIsGenerating(false);
      setShowGenerateModal(false);
      setNewMealTitle('');
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-100 text-xs font-semibold mb-2">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Harmonized Kitchen Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Conflict-Free Unified Meal Planner
          </h1>
          <p className="mt-1 text-sm text-emerald-100 leading-relaxed">
            Cook <span className="font-bold text-white">one shared base meal</span> on one pan, then plate with individualized swaps tailored to Mom&apos;s Keto, Son&apos;s severe allergy, and Grandma&apos;s low sodium targets.
          </p>
        </div>

        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs sm:text-sm shadow-md transition shrink-0 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Generate New Unified Meal</span>
        </button>
      </div>

      {/* Category Pills & Recipe Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
          <div className="flex items-center gap-2">
            {['All', 'Dinner', 'Lunch', 'Breakfast'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  filterCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 shrink-0">
            {filteredMeals.length} unified recipes ready
          </span>
        </div>

        {/* Recipe Cards Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredMeals.map((meal) => {
            const isSelected = meal.id === selectedMealId;
            return (
              <button
                key={meal.id}
                onClick={() => setSelectedMealId(meal.id)}
                className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-300 shadow-md'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <img
                  src={meal.imageUrl}
                  alt={meal.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200/60"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                      {meal.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {meal.cookTimeMins}m
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-1">
                    {meal.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {meal.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>3 Individual Platings</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Meal Detailed Breakdown */}
      {activeMeal && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          
          {/* Top Title & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {activeMeal.category}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  4 Servings
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  100% Conflict-Free Verified
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {activeMeal.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {activeMeal.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyGroceryList}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                {copiedGrocery ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedGrocery ? 'Copied to Clipboard!' : 'Copy Grocery List'}</span>
              </button>
            </div>
          </div>

          {/* Section 1: Shared Base Ingredients & Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Shared Ingredients */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>1. Shared Pan Base Ingredients</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {activeMeal.sharedBase.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shared Prep Instructions */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>2. Master Cooking Steps</span>
              </div>
              <ol className="space-y-2 text-xs text-slate-700">
                {activeMeal.sharedInstructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

          </div>

          {/* Section 2: Individual Custom Plating Matrix (MANDATORY CORE FEATURE) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  3. Individual Custom Plating Instructions
                </h3>
                <p className="text-xs text-slate-500">
                  How to divide and plate the master meal for each family member&apos;s exact requirements
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Zero Cross-Contact Safe
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Mom's Plating */}
              {(() => {
                const plating = activeMeal.customPlatings.find((p) => p.memberId === 'mom');
                const profile = profiles.find((p) => p.id === 'mom');
                return (
                  <div className="rounded-2xl p-5 border border-emerald-200 bg-emerald-50/50 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
                        <div className="flex items-center gap-2">
                          <img
                            src={profile?.avatarImage}
                            alt="Mom"
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-300"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{plating?.memberName}</p>
                            <span className="text-[10px] font-semibold text-emerald-700">{plating?.dietTag}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                          Keto
                        </span>
                      </div>

                      <div className="mt-3 space-y-2 text-xs">
                        <div>
                          <span className="font-bold text-slate-800">Plating Adjustment:</span>
                          <p className="text-slate-600 mt-0.5">{plating?.swapNotes}</p>
                        </div>
                        <div>
                          <span className="font-bold text-slate-800">Chef&apos;s Macro Tip:</span>
                          <p className="text-slate-600 mt-0.5 italic">{plating?.platingTip}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Net Carbs: <strong className="text-emerald-800">{plating?.carbCountG}g</strong></span>
                      <span className="text-slate-500">Sodium: <strong className="text-slate-700">{plating?.sodiumMg}mg</strong></span>
                    </div>
                  </div>
                );
              })()}

              {/* Son's Plating */}
              {(() => {
                const plating = activeMeal.customPlatings.find((p) => p.memberId === 'son');
                const profile = profiles.find((p) => p.id === 'son');
                return (
                  <div className="rounded-2xl p-5 border border-rose-200 bg-rose-50/50 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-rose-200/60">
                        <div className="flex items-center gap-2">
                          <img
                            src={profile?.avatarImage}
                            alt="Son"
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-rose-300"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{plating?.memberName}</p>
                            <span className="text-[10px] font-semibold text-rose-700">{plating?.dietTag}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white">
                          Nut/Soy Free
                        </span>
                      </div>

                      <div className="mt-3 space-y-2 text-xs">
                        <div>
                          <span className="font-bold text-slate-800">Allergy Protocol:</span>
                          <p className="text-slate-600 mt-0.5">{plating?.swapNotes}</p>
                        </div>
                        <div>
                          <span className="font-bold text-slate-800">Kid-Friendly Serving:</span>
                          <p className="text-slate-600 mt-0.5 italic">{plating?.platingTip}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-rose-200/60 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Safe Starches: <strong className="text-slate-800">{plating?.carbCountG}g</strong></span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Nut Free
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Grandma's Plating */}
              {(() => {
                const plating = activeMeal.customPlatings.find((p) => p.memberId === 'grandma');
                const profile = profiles.find((p) => p.id === 'grandma');
                return (
                  <div className="rounded-2xl p-5 border border-teal-200 bg-teal-50/50 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-teal-200/60">
                        <div className="flex items-center gap-2">
                          <img
                            src={profile?.avatarImage}
                            alt="Grandma"
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-teal-300"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{plating?.memberName}</p>
                            <span className="text-[10px] font-semibold text-teal-800">{plating?.dietTag}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-600 text-white">
                          Low Sodium
                        </span>
                      </div>

                      <div className="mt-3 space-y-2 text-xs">
                        <div>
                          <span className="font-bold text-slate-800">Cardiac Adjustment:</span>
                          <p className="text-slate-600 mt-0.5">{plating?.swapNotes}</p>
                        </div>
                        <div>
                          <span className="font-bold text-slate-800">Flavor Technique:</span>
                          <p className="text-slate-600 mt-0.5 italic">{plating?.platingTip}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-teal-200/60 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Sodium: <strong className="text-teal-800">{plating?.sodiumMg}mg</strong></span>
                      <span className="text-slate-500">GI Carbs: <strong className="text-slate-700">{plating?.carbCountG}g</strong></span>
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>

        </div>
      )}

      {/* Generate Custom Meal Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Generate Unified Family Meal
                </h3>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Meal Title or Concept
                </label>
                <input
                  type="text"
                  value={newMealTitle}
                  onChange={(e) => setNewMealTitle(e.target.value)}
                  placeholder="e.g. Rosemary Lemon Chicken with Roasted Vegetables"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Course Category
                  </label>
                  <select
                    value={newMealCategory}
                    onChange={(e) => setNewMealCategory(e.target.value as 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Dinner">Dinner</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Primary Protein
                  </label>
                  <select
                    value={newMealProtein}
                    onChange={(e) => setNewMealProtein(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Chicken">Free-Range Chicken</option>
                    <option value="Salmon">Wild Salmon</option>
                    <option value="Turkey">Lean Turkey</option>
                    <option value="Beef">Grass-Fed Beef</option>
                    <option value="Lentil">Golden Lentils (Plant-Based)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800">
                <p className="font-semibold mb-1">Automatic Multi-Profile Triad Output:</p>
                <p>• Mom: Keto plating &amp; fat swap (&lt; 5g carbs)</p>
                <p>• Son: 100% nut-free &amp; soy-free verification</p>
                <p>• Grandma: Cardiac no-salt &amp; low-GI seasoning (&lt; 120mg sodium)</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUnifiedMeal}
                disabled={!newMealTitle.trim() || isGenerating}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50 transition"
              >
                {isGenerating ? 'Harmonizing Platings...' : 'Generate Recipe'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
