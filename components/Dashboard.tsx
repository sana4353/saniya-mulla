
import React from 'react';
import { 
  Users, 
  Zap, 
  ShieldCheck, 
  Activity,
  ArrowUpRight,
  TrendingUp,
  Mail,
  Plus
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mon', usage: 400, ai: 240 },
  { name: 'Tue', usage: 300, ai: 139 },
  { name: 'Wed', usage: 200, ai: 980 },
  { name: 'Thu', usage: 278, ai: 390 },
  { name: 'Fri', usage: 189, ai: 480 },
  { name: 'Sat', usage: 239, ai: 380 },
  { name: 'Sun', usage: 349, ai: 430 },
];

const Dashboard: React.FC = () => {
  const Metric = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="inner-card-glass p-5 md:p-6 rounded-2xl md:rounded-[2rem] border-white/5 group hover:border-white/20 transition-all duration-500">
      <div className="flex justify-between items-start mb-4">
        {/* Fix: Removed invalid md:size and used responsive Tailwind classes on the icon wrapper and icon itself */}
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center ${color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
          <Icon className="text-white w-5 h-5 md:w-6 md:h-6" />
        </div>
        {trend && (
          <div className="flex items-center space-x-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
            <TrendingUp size={10} />
            <span className="text-[9px] md:text-[10px] font-black">{trend}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</p>
        <h4 className="text-2xl md:text-3xl font-black text-white tracking-tighter">{value}</h4>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn max-w-7xl mx-auto pb-24 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            {/* Fix: Removed invalid md:size and used responsive Tailwind classes */}
            <Activity className="text-indigo-500 w-[18px] h-[18px] md:w-5 md:h-5" />
            <span className="text-indigo-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]">Live Telemetry</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Admin Console</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 md:px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all">
            {/* Fix: Removed invalid md:size and used responsive Tailwind classes */}
            <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Reports</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 md:px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-600/20 transition-all active:scale-95">
            {/* Fix: Removed invalid md:size and used responsive Tailwind classes */}
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Notice</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Metric title="Total Enrolled" value="2,842" icon={Users} color="bg-blue-600" trend="+12%" />
        <Metric title="AI Synapses" value="14.2k" icon={Zap} color="bg-indigo-600" trend="+4.5%" />
        <Metric title="Secure Nodes" value="84" icon={ShieldCheck} color="bg-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 inner-card-glass p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity hidden md:block">
            <TrendingUp size={120} className="text-indigo-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-base md:text-lg font-black text-white mb-6 md:mb-8 tracking-tighter flex items-center space-x-3">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>Network Traffic</span>
            </h3>
            <div className="h-[250px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                    itemStyle={{ color: '#fff', fontSize: '9px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="usage" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="inner-card-glass p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/5">
          <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 md:mb-8">System Health</h3>
          <div className="space-y-4 md:space-y-6">
            {[
              { label: 'Database Sync', status: 'Online', color: 'text-emerald-400' },
              { label: 'Gemini Engine', status: 'Optimized', color: 'text-indigo-400' },
              { label: 'Firewall', status: 'Active', color: 'text-emerald-400' },
              { label: 'Latency', status: '24ms', color: 'text-blue-400' },
              { label: 'Storage', status: '82%', color: 'text-amber-400' }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center group cursor-default">
                <span className="text-[10px] md:text-[11px] font-bold text-slate-400 group-hover:text-white transition-colors">{item.label}</span>
                <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 md:mt-12 p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/20">
            <p className="text-[9px] md:text-[10px] text-indigo-300 font-bold leading-relaxed italic">
              "All systems operational. No packet loss detected."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
