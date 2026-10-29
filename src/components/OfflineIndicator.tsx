import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-slate-900/90 text-white px-4 py-2 text-xs font-medium shadow-xl border border-slate-700 backdrop-blur-md animate-bounce">
      <WifiOff className="w-4 h-4 text-amber-400" />
      <span>Offline Mode — All allergen scanning rules cached locally</span>
    </div>
  );
};
