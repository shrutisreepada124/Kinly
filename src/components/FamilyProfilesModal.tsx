import React, { useState } from 'react';
import { 
  X, 
  Users, 
  ShieldAlert, 
  Heart, 
  PhoneCall, 
  Plus, 
  Trash2, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { FamilyProfile } from '../types/family';

interface FamilyProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: FamilyProfile[];
  onUpdateProfiles: (updated: FamilyProfile[]) => void;
}

export const FamilyProfilesModal: React.FC<FamilyProfilesModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onUpdateProfiles
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<'mom' | 'son' | 'grandma'>('son');
  const [newAllergenKeyword, setNewAllergenKeyword] = useState('');

  if (!isOpen) return null;

  const activeProfile = profiles.find((p) => p.id === selectedMemberId) || profiles[0];

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergenKeyword.trim()) return;

    const updated = profiles.map((p) => {
      if (p.id === selectedMemberId) {
        if (p.allergies.length > 0) {
          const newAllergies = [...p.allergies];
          newAllergies[0].keywords.push(newAllergenKeyword.trim().toLowerCase());
          return { ...p, allergies: newAllergies };
        } else if (p.dietaryGoals.length > 0) {
          const newGoals = [...p.dietaryGoals];
          newGoals[0].restrictedKeywords.push(newAllergenKeyword.trim().toLowerCase());
          return { ...p, dietaryGoals: newGoals };
        }
      }
      return p;
    });

    onUpdateProfiles(updated);
    setNewAllergenKeyword('');
  };

  const handleRemoveKeyword = (keyword: string) => {
    const updated = profiles.map((p) => {
      if (p.id === selectedMemberId) {
        const newAllergies = p.allergies.map((a) => ({
          ...a,
          keywords: a.keywords.filter((k) => k !== keyword)
        }));
        const newGoals = p.dietaryGoals.map((g) => ({
          ...g,
          restrictedKeywords: g.restrictedKeywords.filter((k) => k !== keyword)
        }));
        return { ...p, allergies: newAllergies, dietaryGoals: newGoals };
      }
      return p;
    });

    onUpdateProfiles(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Family Profiles &amp; Safety Parameters
              </h2>
              <p className="text-xs text-slate-500">
                Custom allergies, medical emergency cards, and nutritional constraints
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Select Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-2 gap-2">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedMemberId(p.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition ${
                selectedMemberId === p.id
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <img
                src={p.avatarImage}
                alt={p.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>{p.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Member Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Profile Overview Card */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
            <img
              src={activeProfile.avatarImage}
              alt={activeProfile.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{activeProfile.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {activeProfile.primaryDietBadge}
                </span>
              </div>
              <p className="text-slate-500">{activeProfile.roleTitle}</p>
              <p className="text-slate-600 italic mt-1 font-serif">
                &ldquo;{activeProfile.specialInstructions}&rdquo;
              </p>
            </div>
          </div>

          {/* Emergency Contact If Present */}
          {activeProfile.emergencyContact && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <p className="font-bold">{activeProfile.emergencyContact.name}</p>
                  <p className="text-[11px] text-rose-800">{activeProfile.emergencyContact.relation}</p>
                </div>
              </div>
              <a
                href={`tel:${activeProfile.emergencyContact.phone}`}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700"
              >
                {activeProfile.emergencyContact.phone}
              </a>
            </div>
          )}

          {/* Allergy / Restrictive Keywords Manager */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider">
                Active Scan Trigger Keywords ({activeProfile.name.split(' ')[0]})
              </h4>
              <span className="text-slate-400 text-[11px]">
                Scanner will instantly flag any match
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {activeProfile.allergies.flatMap((a) => a.keywords).map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-100 text-rose-800 font-semibold border border-rose-200"
                >
                  <span>{kw}</span>
                  <button
                    onClick={() => handleRemoveKeyword(kw)}
                    className="hover:text-rose-950 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {activeProfile.dietaryGoals.flatMap((g) => g.restrictedKeywords).map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200"
                >
                  <span>{kw}</span>
                  <button
                    onClick={() => handleRemoveKeyword(kw)}
                    className="hover:text-emerald-950 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Custom Word */}
            <form onSubmit={handleAddKeyword} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newAllergenKeyword}
                onChange={(e) => setNewAllergenKeyword(e.target.value)}
                placeholder="Add custom keyword (e.g. sesame, cashews, dextrose)"
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Rule</span>
              </button>
            </form>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
