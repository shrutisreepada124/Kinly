/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Camera, 
  UtensilsCrossed, 
  Activity, 
  ShieldCheck, 
  AlertTriangle,
  Users
} from 'lucide-react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ScannerTab } from './components/ScannerTab';
import { MealPlannerTab } from './components/MealPlannerTab';
import { CareTrackerTab } from './components/CareTrackerTab';
import { FamilyProfilesModal } from './components/FamilyProfilesModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { 
  FamilyProfile, 
  FamilyMemberId, 
  CareTask, 
  ScanSafetyResult, 
  RecipeMeal 
} from './types/family';
import { 
  INITIAL_PROFILES, 
  INITIAL_CARE_TASKS, 
  UNIFIED_MEALS,
  PRESET_SAMPLES 
} from './data/mockData';
import { analyzeIngredients } from './services/allergenEngine';

export default function App() {
  // Profiles state
  const [profiles, setProfiles] = useState<FamilyProfile[]>(INITIAL_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<FamilyMemberId>('all');
  const [isProfilesModalOpen, setIsProfilesModalOpen] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scanner' | 'meals' | 'care'>('dashboard');

  // Care tasks state
  const [careTasks, setCareTasks] = useState<CareTask[]>(INITIAL_CARE_TASKS);

  // Recent scans state
  const [recentScans, setRecentScans] = useState<ScanSafetyResult[]>(() => {
    // Seed with initial realistic scans for immediate user immersion
    const initial1 = analyzeIngredients(
      PRESET_SAMPLES[1].rawIngredients,
      INITIAL_PROFILES,
      PRESET_SAMPLES[1].name
    );
    const initial2 = analyzeIngredients(
      PRESET_SAMPLES[0].rawIngredients,
      INITIAL_PROFILES,
      PRESET_SAMPLES[0].name
    );
    return [initial1, initial2];
  });

  // Unified meals state
  const [meals, setMeals] = useState<RecipeMeal[]>(UNIFIED_MEALS);

  // Handlers
  const handleToggleCareTask = (taskId: string) => {
    setCareTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleAddNewTask = (newTask: CareTask) => {
    setCareTasks((prev) => [newTask, ...prev]);
  };

  const handleScanCompleted = (result: ScanSafetyResult) => {
    setRecentScans((prev) => [result, ...prev.slice(0, 9)]);
  };

  const handleAddCustomMeal = (newMeal: RecipeMeal) => {
    setMeals((prev) => [newMeal, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* 1. Header with Family Profile Switcher */}
      <Header
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={(id) => setActiveProfileId(id)}
        onOpenManageProfiles={() => setIsProfilesModalOpen(true)}
      />

      {/* 2. Main Content Canvas */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-5 pb-24 md:pb-12">
        {activeTab === 'dashboard' && (
          <Dashboard
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSelectProfile={(id) => setActiveProfileId(id)}
            careTasks={careTasks}
            onToggleCareTask={handleToggleCareTask}
            recentScans={recentScans}
            onNavigateTab={(tab) => setActiveTab(tab)}
            featuredMeal={meals[0]}
          />
        )}

        {activeTab === 'scanner' && (
          <ScannerTab
            profiles={profiles}
            activeProfileId={activeProfileId}
            onScanCompleted={handleScanCompleted}
            recentScans={recentScans}
          />
        )}

        {activeTab === 'meals' && (
          <MealPlannerTab
            meals={meals}
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSelectMeal={() => {}}
            onAddCustomMeal={handleAddCustomMeal}
          />
        )}

        {activeTab === 'care' && (
          <CareTrackerTab
            tasks={careTasks}
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSelectProfile={(id) => setActiveProfileId(id)}
            onToggleTask={handleToggleCareTask}
            onAddTask={handleAddNewTask}
          />
        )}
      </main>

      {/* 3. Mobile / Desktop Floating Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg md:max-w-xl md:mx-auto md:bottom-4 md:rounded-full md:border md:shadow-2xl">
        <div className="flex items-center justify-around px-2 py-2 sm:py-2.5">
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-1.5 rounded-2xl transition ${
              activeTab === 'dashboard'
                ? 'text-emerald-700 bg-emerald-50/80 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[11px] sm:text-xs">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-1.5 rounded-2xl transition relative ${
              activeTab === 'scanner'
                ? 'text-emerald-700 bg-emerald-50/80 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Camera className="w-5 h-5 text-emerald-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            </div>
            <span className="text-[11px] sm:text-xs">Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('meals')}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-1.5 rounded-2xl transition ${
              activeTab === 'meals'
                ? 'text-emerald-700 bg-emerald-50/80 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span className="text-[11px] sm:text-xs">Meal Planner</span>
          </button>

          <button
            onClick={() => setActiveTab('care')}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-1.5 rounded-2xl transition ${
              activeTab === 'care'
                ? 'text-emerald-700 bg-emerald-50/80 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[11px] sm:text-xs">Care &amp; Meds</span>
          </button>

        </div>
      </nav>

      {/* 4. Family Profiles Management Modal */}
      <FamilyProfilesModal
        isOpen={isProfilesModalOpen}
        onClose={() => setIsProfilesModalOpen(false)}
        profiles={profiles}
        onUpdateProfiles={(updated) => setProfiles(updated)}
      />

      {/* 5. Offline Connectivity Indicator (PWA Requirement) */}
      <OfflineIndicator />

    </div>
  );
}
