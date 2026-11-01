import React, { useState } from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  CheckCircle2,
  Sliders,
  Send,
  Zap,
  Volume2,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SECTOR_OPTIONS } from '../../data/mockData';

export const JobAlertsSettings: React.FC = () => {
  const { alertPreferences, updateAlertPreferences, addNotification } = useApp();
  const [prefs, setPrefs] = useState({ ...alertPreferences });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const toggleSector = (sector: string) => {
    setPrefs((prev) => {
      const exists = prev.sectors.includes(sector);
      return {
        ...prev,
        sectors: exists ? prev.sectors.filter((s) => s !== sector) : [...prev.sectors, sector],
      };
    });
  };

  const handleSave = () => {
    updateAlertPreferences(prefs);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestAlert = () => {
    setTestSent(true);
    addNotification(
      '🔔 Test Job Alert: Matching Role Found!',
      '3 new openings in your selected sectors were found matching your ₹' + prefs.minSalary.toLocaleString() + '+ criteria.',
      'job_alert'
    );
    setTimeout(() => setTestSent(false), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" />
            Automated Job Alerts & Push Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Get instant mobile alerts as soon as verified companies post jobs matching your skills and salary expectations.
          </p>
        </div>

        <button
          onClick={handleTestAlert}
          disabled={testSent}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 shrink-0"
        >
          <Zap className="w-4 h-4 text-slate-950" />
          <span>{testSent ? 'Simulating Push...' : 'Send Test Notification'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 border border-emerald-300 dark:border-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Alert preferences saved! You will receive updates according to your chosen schedule.</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Notification Channels */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            1. Alert Delivery Channels / सूचना माध्यम
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                prefs.enablePush
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-bold text-xs">Mobile Push Alerts</p>
                  <p className="text-[10px] text-slate-500">In-app popups & sound</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.enablePush}
                onChange={(e) => setPrefs({ ...prefs, enablePush: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>

            <label
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                prefs.enableEmail
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="font-bold text-xs">Email Notifications</p>
                  <p className="text-[10px] text-slate-500">Daily job matches</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.enableEmail}
                onChange={(e) => setPrefs({ ...prefs, enableEmail: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>

            <label
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                prefs.enableWhatsApp
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">💬</span>
                <div>
                  <p className="font-bold text-xs">WhatsApp Direct Alert</p>
                  <p className="text-[10px] text-slate-500">Instant job links</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.enableWhatsApp}
                onChange={(e) => setPrefs({ ...prefs, enableWhatsApp: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Minimum Salary Slider */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              2. Minimum Expected Salary Filter
            </h2>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              ₹{prefs.minSalary.toLocaleString('en-IN')} / month
            </span>
          </div>
          <input
            type="range"
            min="10000"
            max="60000"
            step="2000"
            value={prefs.minSalary}
            onChange={(e) => setPrefs({ ...prefs, minSalary: Number(e.target.value) })}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>₹10,000</span>
            <span>₹30,000</span>
            <span>₹60,000+</span>
          </div>
        </div>

        {/* Sectors to Monitor */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
            3. Selected Job Segments / किस प्रकार के जॉब अलर्ट चाहिए
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Click to select or deselect categories you want alerts for:
          </p>

          <div className="flex flex-wrap gap-2">
            {SECTOR_OPTIONS.filter((s) => !s.startsWith('All')).map((sec) => {
              const isSelected = prefs.sectors.includes(sec);
              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => toggleSector(sec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {sec}
                </button>
              );
            })}
          </div>
        </div>

        {/* Frequency */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              4. Alert Frequency
            </h2>
            <p className="text-xs text-slate-500">How frequently would you like to receive new match summaries?</p>
          </div>

          <div className="flex items-center gap-2">
            {(['Instant', 'Daily Digest', 'Weekly'] as const).map((freq) => (
              <button
                key={freq}
                type="button"
                onClick={() => setPrefs({ ...prefs, frequency: freq })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  prefs.frequency === freq
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Save Alert Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
