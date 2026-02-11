
import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut, 
  Cpu,
  UserCircle,
  ShieldCheck,
  Home,
  Megaphone,
  Zap,
  Sparkles
} from 'lucide-react';
import { UserRole, User } from '../types';
import { MOCK_USERS } from '../constants';

interface SidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onSelectFaculty?: (facultyId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, setActiveTab, onLogout, onSelectFaculty }) => {
  const menuItems = [
    { id: 'home', label: 'Home Feed', icon: Home, roles: [UserRole.FACULTY, UserRole.STUDENT] },
    { id: 'dashboard', label: 'Admin Panel', icon: LayoutDashboard, roles: [UserRole.ADMIN] },
    { id: 'chats', label: 'Chat Hub', icon: MessageSquare, roles: [UserRole.ADMIN, UserRole.FACULTY, UserRole.STUDENT] },
    { id: 'faculty-chat', label: 'Secure Lounge', icon: ShieldCheck, roles: [UserRole.FACULTY] },
    { id: 'ai-chat', label: 'AI Assistant', icon: Cpu, roles: [UserRole.ADMIN, UserRole.FACULTY, UserRole.STUDENT], special: true },
    { id: 'notices', label: 'Notice Board', icon: Megaphone, roles: [UserRole.ADMIN, UserRole.FACULTY, UserRole.STUDENT] },
    { id: 'users', label: 'Directory', icon: Users, roles: [UserRole.ADMIN, UserRole.FACULTY] },
    { id: 'profile', label: 'Profile', icon: UserCircle, roles: [UserRole.ADMIN, UserRole.FACULTY, UserRole.STUDENT] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: [UserRole.ADMIN, UserRole.FACULTY, UserRole.STUDENT] },
  ];

  const otherFaculty = MOCK_USERS.filter(u => u.role === UserRole.FACULTY && u.id !== user.id);

  return (
    <div className="w-80 h-full bg-slate-950/90 backdrop-blur-3xl text-white flex flex-col shrink-0 border-r border-white/5 relative overflow-hidden shadow-2xl">
      {/* Dynamic Background Glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="p-8 flex items-center space-x-4 mb-4 relative z-10">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl shadow-indigo-600/40 border border-white/10 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          EC
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">EduConnect</h1>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-[10px] text-indigo-400 font-black tracking-[0.2em] uppercase">{user.role} CORE</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pb-4">
        <nav className="mt-4 px-6 space-y-2">
          {menuItems.filter(item => item.roles.includes(user.role)).map((item) => {
            const isActive = activeTab === item.id;
            const isAI = item.id === 'ai-chat';
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? isAI ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'bg-white/10 text-white shadow-xl' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                {isActive && !isAI && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]"></div>
                )}
                {isAI && !isActive && (
                  <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
                <div className={`relative ${isAI && isActive ? 'animate-bounce-short' : ''}`}>
                  <item.icon size={22} className={`transition-all duration-500 ${isActive ? 'scale-110' : 'group-hover:translate-x-1'} ${isAI && !isActive ? 'text-indigo-400/70 group-hover:text-indigo-400' : ''}`} />
                  {isAI && (
                    <Sparkles size={10} className={`absolute -top-1 -right-1 transition-opacity ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-indigo-400'}`} />
                  )}
                </div>
                <span className={`text-sm tracking-tight font-black ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{item.label}</span>
                {isAI && (
                  <div className={`ml-auto px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${isActive ? 'bg-white/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                    Live
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {user.role === UserRole.FACULTY && otherFaculty.length > 0 && (
          <div className="mt-12 px-6 pb-8">
            <div className="flex items-center justify-between px-4 mb-6">
              <div className="flex items-center space-x-2">
                <Zap size={12} className="text-emerald-400" />
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Active Pulse</h3>
              </div>
            </div>
            <div className="space-y-3">
              {otherFaculty.map(faculty => (
                <button
                  key={faculty.id}
                  onClick={() => onSelectFaculty?.(faculty.id)}
                  className="w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all group border border-transparent hover:border-emerald-500/20"
                >
                  <div className="relative">
                    <img src={faculty.avatar} className="w-10 h-10 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all border border-slate-800 group-hover:border-emerald-500/50 shadow-xl" alt="" />
                    <div className="absolute -right-1 -bottom-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="text-xs font-black truncate tracking-tight">{faculty.name}</p>
                    <p className="text-[9px] font-bold text-slate-600 group-hover:text-emerald-500/60 uppercase tracking-widest mt-0.5">Encrypted Sync</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-md relative z-10 shrink-0">
        <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-3xl mb-6 border border-white/5 group hover:bg-white/10 transition-all cursor-pointer" onClick={() => setActiveTab('profile')}>
          <div className="relative">
            <img src={user.avatar} className="w-12 h-12 rounded-2xl object-cover border border-indigo-500/30 shadow-2xl shrink-0 group-hover:scale-105 transition-transform" alt="Avatar" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"></div>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black truncate tracking-tight">{user.name}</p>
            <p className="text-[9px] text-slate-500 font-bold truncate tracking-widest uppercase mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">Active Link</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-3 py-4 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all text-[11px] font-black uppercase tracking-[0.3em] border border-transparent hover:border-rose-500/20"
        >
          <LogOut size={16} />
          <span>Terminate Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
