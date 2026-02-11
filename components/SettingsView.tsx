
import React from 'react';
import { 
  Settings as SettingsIcon, 
  Zap, 
  Palette, 
  ToggleLeft, 
  ToggleRight,
  ShieldCheck,
  Sparkles,
  Waves,
  Trees
} from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsViewProps {
  settings: UserSettings;
  setSettings: (settings: UserSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings }) => {
  const toggleAnimations = () => {
    setSettings({ ...settings, disableAnimations: !settings.disableAnimations });
  };

  const setTheme = (theme: UserSettings['theme']) => {
    setSettings({ ...settings, theme });
  };

  const themeOptions = [
    { id: 'default', label: 'Indigo Pulse', desc: 'Standard MSBTE core aesthetic', color: 'bg-indigo-600', icon: Palette },
    { id: 'cyber', label: 'Cyber Neon', desc: 'Fuchsia & Purple cyberdeck styling', color: 'bg-fuchsia-600', icon: Zap },
    { id: 'emerald', label: 'Emerald Eco', desc: 'High-visibility bio-tech interface', color: 'bg-emerald-600', icon: ShieldCheck },
    { id: 'ocean', label: 'Ocean Deep', desc: 'Fluid navy and cyan gradients', color: 'bg-sky-600', icon: Waves },
    { id: 'forest', label: 'Forest Canopy', desc: 'Natural greens and earth tones', color: 'bg-green-800', icon: Trees },
  ];

  return (
    <div className="max-w-6xl mx-auto py-16 animate-fadeIn relative z-10 space-y-16">
      <div className="flex items-center space-x-6">
        <div className="p-6 bg-indigo-600/20 rounded-[2.5rem] border border-indigo-500/20 shadow-2xl">
          <SettingsIcon className="text-indigo-400" size={40} />
        </div>
        <div>
          <h2 className="text-7xl font-black text-white tracking-tighter">System Config</h2>
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] mt-2">Adjust Neural Interfaces</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Visual Settings */}
        <div className="inner-card-glass p-12 rounded-[4rem] border border-white/5 space-y-10">
          <div className="flex items-center space-x-4 mb-6">
            <Palette className="text-indigo-400" size={24} />
            <h3 className="text-2xl font-black text-white tracking-tight">Neural Core Theme</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {themeOptions.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id as any)}
                className={`flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${
                  settings.theme === theme.id 
                    ? 'bg-white/10 border-indigo-500/50 shadow-xl scale-[1.02]' 
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl ${theme.color} shadow-lg flex items-center justify-center`}>
                    <theme.icon size={18} className="text-white/80" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-black tracking-tight">{theme.label}</p>
                    <p className="text-xs text-slate-500 font-medium">{theme.desc}</p>
                  </div>
                </div>
                {settings.theme === theme.id && <Sparkles size={16} className="text-indigo-400 animate-pulse" />}
              </button>
            ))}
          </div>
        </div>

        {/* Performance Settings */}
        <div className="inner-card-glass p-12 rounded-[4rem] border border-white/5 space-y-10 h-fit">
          <div className="flex items-center space-x-4 mb-6">
            <Zap className="text-amber-400" size={24} />
            <h3 className="text-2xl font-black text-white tracking-tight">Motion & Physics</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-8 bg-white/5 rounded-3xl border border-white/5">
              <div className="space-y-1">
                <p className="text-white font-black tracking-tight">Fluid Transitions</p>
                <p className="text-xs text-slate-500 font-medium">Toggle smooth message fly-ins and neural scrolls</p>
              </div>
              <button onClick={toggleAnimations} className="transition-all active:scale-90">
                {settings.disableAnimations ? (
                  <ToggleLeft size={48} className="text-slate-600" />
                ) : (
                  <ToggleRight size={48} className="text-indigo-500" />
                )}
              </button>
            </div>

            <div className="p-8 bg-indigo-600/10 rounded-3xl border border-indigo-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <ShieldCheck size={18} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em]">Environment Note</span>
              </div>
              <p className="text-xs text-indigo-300 leading-relaxed font-medium italic">
                Disabling fluid transitions can reduce neural load on lower-spec transmission nodes. 
                Theme changes propagate instantly to the EduAI Engine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
