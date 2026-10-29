import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Check, 
  AlertTriangle, 
  Heart, 
  ShieldCheck, 
  Droplets, 
  Pill, 
  Calendar,
  X,
  Filter,
  Users
} from 'lucide-react';
import { CareTask, FamilyProfile, FamilyMemberId } from '../types/family';

interface CareTrackerTabProps {
  tasks: CareTask[];
  profiles: FamilyProfile[];
  activeProfileId: FamilyMemberId;
  onSelectProfile: (id: FamilyMemberId) => void;
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: CareTask) => void;
}

export const CareTrackerTab: React.FC<CareTrackerTabProps> = ({
  tasks,
  profiles,
  activeProfileId,
  onSelectProfile,
  onToggleTask,
  onAddTask
}) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newMemberId, setNewMemberId] = useState<'mom' | 'son' | 'grandma'>('son');
  const [newType, setNewType] = useState<'medication' | 'vital_check' | 'allergy_kit' | 'hydration_nutrition'>('medication');
  const [newDosage, setNewDosage] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [newTimeLabel, setNewTimeLabel] = useState('08:00 AM');
  const [newCritical, setNewCritical] = useState(false);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchMember = activeProfileId === 'all' || t.memberId === activeProfileId;
    const matchSlot = selectedTimeSlot === 'all' || t.timeSlot === selectedTimeSlot;
    return matchMember && matchSlot;
  });

  // Calculate stats for current filter
  const memberTasks = activeProfileId === 'all' ? tasks : tasks.filter((t) => t.memberId === activeProfileId);
  const completedCount = memberTasks.filter((t) => t.completed).length;
  const totalCount = memberTasks.length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;

  // Individual member stats
  const getStats = (mId: 'mom' | 'son' | 'grandma') => {
    const mTasks = tasks.filter((t) => t.memberId === mId);
    const comp = mTasks.filter((t) => t.completed).length;
    const tot = mTasks.length;
    const pct = tot > 0 ? Math.round((comp / tot) * 100) : 100;
    return { comp, tot, pct };
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const task: CareTask = {
      id: `task_${Date.now()}`,
      memberId: newMemberId,
      title: newTitle.trim(),
      type: newType,
      dosageOrDetail: newDosage.trim() || undefined,
      timeSlot: newTimeSlot,
      timeLabel: newTimeLabel,
      completed: false,
      criticalSafety: newCritical
    };

    onAddTask(task);
    setShowAddModal(false);
    setNewTitle('');
    setNewDosage('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-100 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Care &amp; Medication Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Daily Care &amp; Health Tracker
          </h1>
          <p className="mt-1 text-sm text-emerald-100 leading-relaxed">
            Manage daily medication routines, allergy kit safety audits, blood pressure/glucose check-ins, and electrolyte hydration milestones.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs sm:text-sm shadow-md transition shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>Add Care Task / Medication</span>
        </button>
      </div>

      {/* Progress Rings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Overall Household Ring */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-600 transition-all duration-700 ease-out"
                strokeDasharray={`${completionPct}, 100`}
                strokeLinecap="round"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black text-slate-800">
              {completionPct}%
            </span>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Household Total
            </p>
            <h4 className="text-sm font-bold text-slate-900">
              {completedCount} of {totalCount} Done
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {totalCount - completedCount} tasks remaining
            </p>
          </div>
        </div>

        {/* Son Ring */}
        {(() => {
          const s = getStats('son');
          return (
            <div
              onClick={() => onSelectProfile('son')}
              className={`rounded-3xl p-5 border transition cursor-pointer flex items-center gap-4 ${
                activeProfileId === 'son'
                  ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200'
                  : 'bg-white border-slate-200/80 hover:border-rose-200'
              }`}
            >
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-rose-600 transition-all duration-700 ease-out"
                    strokeDasharray={`${s.pct}, 100`}
                    strokeLinecap="round"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-black text-rose-800">
                  {s.pct}%
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                  Son (Leo)
                </p>
                <h4 className="text-sm font-bold text-slate-900">
                  {s.comp} of {s.tot} Tasks
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  EpiPen auto-injector active
                </p>
              </div>
            </div>
          );
        })()}

        {/* Grandma Ring */}
        {(() => {
          const g = getStats('grandma');
          return (
            <div
              onClick={() => onSelectProfile('grandma')}
              className={`rounded-3xl p-5 border transition cursor-pointer flex items-center gap-4 ${
                activeProfileId === 'grandma'
                  ? 'bg-teal-50/70 border-teal-300 ring-2 ring-teal-200'
                  : 'bg-white border-slate-200/80 hover:border-teal-200'
              }`}
            >
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-teal-600 transition-all duration-700 ease-out"
                    strokeDasharray={`${g.pct}, 100`}
                    strokeLinecap="round"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-black text-teal-800">
                  {g.pct}%
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                  Grandma (Rose)
                </p>
                <h4 className="text-sm font-bold text-slate-900">
                  {g.comp} of {g.tot} Tasks
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  BP &amp; Metformin logged
                </p>
              </div>
            </div>
          );
        })()}

        {/* Mom Ring */}
        {(() => {
          const m = getStats('mom');
          return (
            <div
              onClick={() => onSelectProfile('mom')}
              className={`rounded-3xl p-5 border transition cursor-pointer flex items-center gap-4 ${
                activeProfileId === 'mom'
                  ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-200'
                  : 'bg-white border-slate-200/80 hover:border-emerald-200'
              }`}
            >
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-600 transition-all duration-700 ease-out"
                    strokeDasharray={`${m.pct}, 100`}
                    strokeLinecap="round"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-black text-emerald-800">
                  {m.pct}%
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Mom (Elena)
                </p>
                <h4 className="text-sm font-bold text-slate-900">
                  {m.comp} of {m.tot} Tasks
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Hydration &amp; electrolytes
                </p>
              </div>
            </div>
          );
        })()}

      </div>

      {/* Main Checklist Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Filter Bar: Time Slots & Profile Filter Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'morning', 'afternoon', 'evening'] as const).map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTimeSlot(slot)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                  selectedTimeSlot === slot
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            Showing <strong className="text-slate-700">{filteredTasks.length}</strong> care items
          </div>
        </div>

        {/* Interactive Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No tasks found for this slot. Tap &ldquo;Add Care Task&rdquo; to schedule a medication or check.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const member = profiles.find((p) => p.id === task.memberId);
              return (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`flex items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-emerald-50/40 border-emerald-200/50'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-xl border mt-0.5 sm:mt-0 flex items-center justify-center shrink-0 transition ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white hover:border-emerald-500'
                      }`}
                    >
                      {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-sm font-bold truncate ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </h4>
                        {task.criticalSafety && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.2 rounded-md bg-rose-100 text-rose-700 shrink-0">
                            Safety Critical
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                            task.memberId === 'son'
                              ? 'bg-rose-100 text-rose-700'
                              : task.memberId === 'mom'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-teal-100 text-teal-700'
                          }`}
                        >
                          {member?.name}
                        </span>

                        <span>{task.dosageOrDetail}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-slate-600 block">
                      {task.timeLabel}
                    </span>
                    {task.completedAt ? (
                      <span className="text-[10px] text-emerald-600 font-medium">
                        Verified at {task.completedAt}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Pending</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Schedule Medication or Task
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Title or Action
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lisinopril Blood Pressure Med, Glucose Check..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Family Member
                  </label>
                  <select
                    value={newMemberId}
                    onChange={(e) => setNewMemberId(e.target.value as 'mom' | 'son' | 'grandma')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="son">Son (Leo - Allergy)</option>
                    <option value="grandma">Grandma (Rose - Diabetic)</option>
                    <option value="mom">Mom (Elena - Keto)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="medication">Prescription Med</option>
                    <option value="vital_check">Vital Check (BP/Glucose)</option>
                    <option value="allergy_kit">Allergy Kit (EpiPen)</option>
                    <option value="hydration_nutrition">Electrolyte / Nutrition</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Dosage or Instructions
                </label>
                <input
                  type="text"
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  placeholder="e.g. 10mg tablet with meal, or arm cuff reading"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Time Slot
                  </label>
                  <select
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value as 'morning' | 'afternoon' | 'evening')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Time Display
                  </label>
                  <input
                    type="text"
                    value={newTimeLabel}
                    onChange={(e) => setNewTimeLabel(e.target.value)}
                    placeholder="e.g. 8:00 AM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="criticalCheckbox"
                  checked={newCritical}
                  onChange={(e) => setNewCritical(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="criticalCheckbox" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Mark as High Safety Critical (e.g. EpiPen / Insulin)
                </label>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
