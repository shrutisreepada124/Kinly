import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Heart, 
  Activity, 
  UtensilsCrossed, 
  Camera, 
  ArrowRight, 
  AlertOctagon, 
  PhoneCall, 
  Droplets, 
  Flame, 
  Sparkles,
  Users,
  Clock,
  ChevronRight,
  Check
} from 'lucide-react';
import { FamilyProfile, FamilyMemberId, CareTask, ScanSafetyResult, RecipeMeal } from '../types/family';

interface DashboardProps {
  profiles: FamilyProfile[];
  activeProfileId: FamilyMemberId;
  onSelectProfile: (id: FamilyMemberId) => void;
  careTasks: CareTask[];
  onToggleCareTask: (taskId: string) => void;
  recentScans: ScanSafetyResult[];
  onNavigateTab: (tab: 'scanner' | 'meals' | 'care') => void;
  featuredMeal: RecipeMeal;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  careTasks,
  onToggleCareTask,
  recentScans,
  onNavigateTab,
  featuredMeal
}) => {
  // Compute overall household task completion
  const totalTasks = careTasks.length;
  const completedTasks = careTasks.filter((t) => t.completed).length;
  const taskCompletionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  // Individual task stats
  const getMemberTaskStats = (memberId: 'mom' | 'son' | 'grandma') => {
    const memberTasks = careTasks.filter((t) => t.memberId === memberId);
    const completed = memberTasks.filter((t) => t.completed).length;
    const total = memberTasks.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 100;
    return { completed, total, pct };
  };

  const sonStats = getMemberTaskStats('son');
  const grandmaStats = getMemberTaskStats('grandma');
  const momStats = getMemberTaskStats('mom');

  // Filter tasks if specific profile selected
  const displayTasks =
    activeProfileId === 'all'
      ? careTasks
      : careTasks.filter((t) => t.memberId === activeProfileId);

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Hero Household Health & Safety Status Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white p-6 sm:p-8 shadow-xl shadow-emerald-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-emerald-100 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
              <span>Active Household Shield: All 3 Members Monitored</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {activeProfileId === 'all'
                ? 'Household Health & Allergy Overview'
                : `Active Profile Focus: ${activeProfile?.name}`}
            </h1>

            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Real-time allergen barrier active for Son (Leo). Sodium and glucose guardrails engaged for Grandma (Rose). Keto macro tracking set for Mom (Elena).
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <button
                onClick={() => onNavigateTab('scanner')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-emerald-900 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition shadow-md shadow-emerald-900/20 active:scale-95"
              >
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Scan Food Label Now</span>
              </button>

              <button
                onClick={() => onNavigateTab('meals')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/30 hover:bg-emerald-500/40 border border-white/20 text-white font-semibold text-xs sm:text-sm transition"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Tonight&apos;s Unified Meal</span>
              </button>
            </div>
          </div>

          {/* Overall Care Progress Ring */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 flex items-center gap-5 shrink-0 self-start md:self-auto">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-white transition-all duration-1000 ease-out"
                  strokeDasharray={`${taskCompletionPct}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl sm:text-2xl font-black">{taskCompletionPct}%</span>
                <span className="text-[9px] uppercase tracking-wider text-emerald-200">Daily Care</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-white">Today&apos;s Checkpoints</div>
              <p className="text-[11px] text-emerald-100">
                {completedTasks} of {totalTasks} tasks verified
              </p>
              <div className="text-[10px] text-emerald-200/90 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>EpiPen &amp; Vitals logged</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Family Profile Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Son (Leo) - Severe Allergy Card */}
        <div
          onClick={() => onSelectProfile('son')}
          className={`cursor-pointer rounded-3xl p-5 border transition-all relative overflow-hidden group ${
            activeProfileId === 'son'
              ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-400 shadow-md'
              : 'bg-white border-slate-200/80 hover:border-rose-200 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <img
                src={profiles.find((p) => p.id === 'son')?.avatarImage}
                alt="Son"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-200"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-700">
                  Son (Leo)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  Severe Anaphylaxis Risk
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-slate-800 font-mono">
                {sonStats.completed}/{sonStats.total}
              </span>
              <p className="text-[10px] text-slate-400">Tasks</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 flex items-start gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-900">Zero-Tolerance:</span>
                <span className="text-rose-800 ml-1">Peanuts, Tree Nuts, Soy Sauce/Lecithin</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-slate-600">
              <span className="text-[11px] font-medium">EpiPen 0.3mg Kit:</span>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Active
              </span>
            </div>
          </div>
        </div>

        {/* Grandma (Rose) - Cardiac & Diabetic Card */}
        <div
          onClick={() => onSelectProfile('grandma')}
          className={`cursor-pointer rounded-3xl p-5 border transition-all relative overflow-hidden group ${
            activeProfileId === 'grandma'
              ? 'bg-teal-50/80 border-teal-300 ring-2 ring-teal-400 shadow-md'
              : 'bg-white border-slate-200/80 hover:border-teal-200 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <img
                src={profiles.find((p) => p.id === 'grandma')?.avatarImage}
                alt="Grandma"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-200"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700">
                  Grandma (Rose)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  Low-Sodium &amp; Diabetic
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-slate-800 font-mono">
                {grandmaStats.completed}/{grandmaStats.total}
              </span>
              <p className="text-[10px] text-slate-400">Tasks</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-100 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Blood Pressure:</span>
              <span className="font-bold text-slate-800">118/76 mmHg (Target)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-slate-600">
              <span className="text-[11px] font-medium">Fasting Glucose:</span>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                104 mg/dL
              </span>
            </div>
          </div>
        </div>

        {/* Mom (Elena) - Keto Card */}
        <div
          onClick={() => onSelectProfile('mom')}
          className={`cursor-pointer rounded-3xl p-5 border transition-all relative overflow-hidden group ${
            activeProfileId === 'mom'
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400 shadow-md'
              : 'bg-white border-slate-200/80 hover:border-emerald-200 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <img
                src={profiles.find((p) => p.id === 'mom')?.avatarImage}
                alt="Mom"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-200"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                  Mom (Elena)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Keto / Low-Carb
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-slate-800 font-mono">
                {momStats.completed}/{momStats.total}
              </span>
              <p className="text-[10px] text-slate-400">Tasks</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Carb Budget:</span>
              <span className="font-bold text-emerald-800">12g / 20g net max</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-slate-600">
              <span className="text-[11px] font-medium">Hydration:</span>
              <span className="text-[11px] font-bold text-slate-800">
                1.95L / 2.5L
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Emergency Anaphylaxis Protocol Card (Always visible for Son) */}
      <div className="rounded-3xl bg-rose-50 border border-rose-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-600/30">
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-rose-950 uppercase tracking-wide">
                  Leo&apos;s Anaphylaxis Action Card
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-rose-200 text-rose-900">
                  CRITICAL
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-0.5">
                Location: Kitchen Drawer #2 &amp; School Pouch. Inject EpiPen immediately upon hives + wheezing, then call 911.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="tel:911"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 911</span>
            </a>
            <div className="text-xs text-slate-600 px-3 py-2 bg-white rounded-xl border border-rose-200 font-medium">
              Pediatrician: +1 (555) 438-2947
            </div>
          </div>
        </div>
      </div>

      {/* 4. Split Section: Featured Unified Meal & Daily Care Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Tonight's Conflict-Free Meal Teaser */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tonight&apos;s Conflict-Free Meal
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab('meals')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>View Full Recipe &amp; Platings</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <img
                src={featuredMeal.imageUrl}
                alt={featuredMeal.title}
                className="w-full sm:w-36 h-28 object-cover rounded-2xl border border-slate-100 shadow-xs"
              />
              <div className="space-y-1">
                <div className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  {featuredMeal.category} • {featuredMeal.cookTimeMins} mins
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {featuredMeal.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {featuredMeal.description}
                </p>
              </div>
            </div>

            {/* Individual Custom Plating Summary Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              {featuredMeal.customPlatings.map((plating) => (
                <div
                  key={plating.memberId}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{plating.memberName.split(' ')[0]}</span>
                    <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Safe
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {plating.swapNotes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Prepared on 1 shared skillet with separate safe plating</span>
            <button
              onClick={() => onNavigateTab('meals')}
              className="text-emerald-600 font-bold hover:underline"
            >
              Generate More Meals →
            </button>
          </div>
        </div>

        {/* Right Column: Daily Care Tracker Checklist */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Care &amp; Med Schedule
                </h2>
              </div>
              <span className="text-[11px] font-bold text-slate-400 font-mono">
                {completedTasks}/{totalTasks} done
              </span>
            </div>

            <div className="space-y-2.5">
              {displayTasks.slice(0, 4).map((task) => {
                const member = profiles.find((p) => p.id === task.memberId);
                return (
                  <div
                    key={task.id}
                    onClick={() => onToggleCareTask(task.id)}
                    className={`flex items-start gap-3 p-2.5 rounded-2xl border transition cursor-pointer ${
                      task.completed
                        ? 'bg-emerald-50/50 border-emerald-200/60 text-slate-600'
                        : 'bg-white border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white hover:border-emerald-500'
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {task.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-1">
                          {task.timeLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                          task.memberId === 'son'
                            ? 'bg-rose-100 text-rose-700'
                            : task.memberId === 'mom'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-teal-100 text-teal-700'
                        }`}>
                          {member?.name.split(' ')[0]}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate">
                          {task.dosageOrDetail}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('care')}
              className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <span>Open Full Care Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
