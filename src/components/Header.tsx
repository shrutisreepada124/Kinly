import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  ChevronDown, 
  Sparkles, 
  AlertCircle, 
  Heart, 
  Plus
} from 'lucide-react';
import { FamilyMemberId, FamilyProfile } from '../types/family';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  profiles: FamilyProfile[];
  activeProfileId: FamilyMemberId;
  onSelectProfile: (id: FamilyMemberId) => void;
  onOpenManageProfiles: () => void;
  unreadAlertsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onOpenManageProfiles,
  unreadAlertsCount = 0
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                  kin<span className="text-emerald-600">ly</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Family Health & Safety
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Unified nutrition & real-time allergen defense
              </p>
            </div>
          </div>

          {/* Center/Right: Dynamic Family Profile Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Profile Segment Tabs for Tablet/Desktop */}
            <div className="hidden lg:flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60 text-xs font-medium">
              <button
                onClick={() => onSelectProfile('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                  activeProfileId === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>All Household</span>
                <span className="ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                  3
                </span>
              </button>

              {profiles.map((p) => {
                const isActive = activeProfileId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectProfile(p.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        p.id === 'son'
                          ? 'bg-rose-500'
                          : p.id === 'mom'
                          ? 'bg-emerald-500'
                          : 'bg-teal-500'
                      }`}
                    />
                    <span>{p.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Profile Selector Dropdown (Mobile & Compact View) */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition shadow-xs ${
                  activeProfileId === 'son'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-900 hover:bg-rose-100/60'
                    : activeProfileId === 'mom'
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 hover:bg-emerald-100/60'
                    : activeProfileId === 'grandma'
                    ? 'bg-teal-50/70 border-teal-200 text-teal-900 hover:bg-teal-100/60'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                {activeProfileId === 'all' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left text-xs">
                      <p className="font-bold leading-tight">Whole Family</p>
                      <p className="text-[10px] text-slate-500 hidden sm:block">All 3 Profiles</p>
                    </div>
                  </div>
                ) : activeProfile ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={activeProfile.avatarImage}
                      alt={activeProfile.name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-300"
                    />
                    <div className="text-left text-xs">
                      <p className="font-bold leading-tight">{activeProfile.name}</p>
                      <p className="text-[10px] text-slate-500 font-normal truncate max-w-[110px]">
                        {activeProfile.primaryDietBadge}
                      </p>
                    </div>
                  </div>
                ) : null}
                <ChevronDown className="w-4 h-4 text-slate-500 ml-0.5" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 z-40 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Focus Member
                    </div>

                    {/* All Family Option */}
                    <button
                      onClick={() => {
                        onSelectProfile('all');
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition ${
                        activeProfileId === 'all'
                          ? 'bg-emerald-50 text-emerald-900 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">Whole Household (All)</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Combined
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Scans & meals unified for all members
                        </p>
                      </div>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    {/* Individual Family Profiles */}
                    {profiles.map((p) => {
                      const isCurrent = activeProfileId === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            onSelectProfile(p.id);
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition ${
                            isCurrent
                              ? 'bg-slate-100 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <img
                            src={p.avatarImage}
                            alt={p.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-white shadow-xs"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 truncate">
                                {p.name}
                              </span>
                              {p.id === 'son' && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                                  Severe Allergy
                                </span>
                              )}
                              {p.id === 'mom' && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                  Keto
                                </span>
                              )}
                              {p.id === 'grandma' && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700">
                                  Low-Sodium
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {p.roleTitle}
                            </p>
                          </div>
                        </button>
                      );
                    })}

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenManageProfiles();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-xl transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Edit Dietary Rules & Members</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* PWA Install Button */}
            <PWAInstallButton compact />

          </div>
        </div>
      </div>
    </header>
  );
};
