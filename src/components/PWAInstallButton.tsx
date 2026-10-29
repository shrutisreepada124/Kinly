import React, { useState } from 'react';
import { Download, Share, X, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedNotice, setInstalledNotice] = useState(false);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
        <Check className="w-3.5 h-3.5 text-emerald-600" />
        <span>PWA Installed</span>
      </div>
    );
  }

  // Android / Chrome / Desktop install
  if (isInstallable) {
    return (
      <button
        onClick={async () => {
          const success = await install();
          if (success) setInstalledNotice(true);
        }}
        className={`flex items-center gap-1.5 rounded-full font-medium transition shadow-xs hover:shadow-sm ${
          compact
            ? 'px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 text-xs'
            : 'px-3.5 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 text-xs'
        }`}
        title="Install Kinly as an App on your device"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50/60 px-2.5 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
          <span>Install PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                    K
                  </div>
                  <h3 className="text-base font-bold text-slate-800">Install Kinly on iOS</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-full p-1 hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    Tap the <strong>Share</strong> button <Share className="w-4 h-4 inline text-blue-600" /> in Safari’s bottom bar.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    Scroll down and tap <strong>Add to Home Screen</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    Tap <strong>Add</strong> in the top-right corner to open offline anytime!
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  const [showDesktopGuide, setShowDesktopGuide] = useState(false);

  // Fallback info button if in desktop browser where beforeinstallprompt didn't fire yet
  return (
    <>
      <button
        onClick={() => setShowDesktopGuide(true)}
        className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/70 px-2.5 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition"
        title="Install App options"
      >
        <Download className="w-3.5 h-3.5 text-emerald-600" />
        <span>Install PWA</span>
      </button>

      {showDesktopGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  K
                </div>
                <h3 className="text-base font-bold text-slate-800">Install Kinly App</h3>
              </div>
              <button
                onClick={() => setShowDesktopGuide(false)}
                className="rounded-full p-1 hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Kinly runs as an installable progressive web app with offline grocery scanning.</p>
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                <div><strong>Desktop Chrome / Edge:</strong> Click the install icon (⊕) on the right edge of your browser URL address bar.</div>
                <div><strong>Mobile Browser:</strong> Open menu (⋮) and tap <em>&quot;Add to Home Screen&quot;</em> or <em>&quot;Install App&quot;</em>.</div>
              </div>
            </div>
            <button
              onClick={() => setShowDesktopGuide(false)}
              className="mt-5 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};
