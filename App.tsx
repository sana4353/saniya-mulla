
import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole, Notice, UserStatus, UserSettings } from './types';
import Dashboard from './components/Dashboard';
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';
import SettingsView from './components/SettingsView';
import { 
  Menu, 
  X, 
  Eye, 
  EyeOff, 
  Lock, 
  User as UserIcon,
  Bell,
  Megaphone,
  ChevronRight,
  UserCheck,
  LayoutDashboard,
  Cpu,
  Sparkles,
  Zap,
  Settings as SettingsIcon,
  Home,
  MessageSquare
} from 'lucide-react';
import { MOCK_USERS, MOCK_NOTIFICATIONS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [authRole, setAuthRole] = useState<UserRole>(UserRole.STUDENT);
  
  // Settings State
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('ec_settings');
    return saved ? JSON.parse(saved) : {
      disableAnimations: false,
      theme: 'default'
    };
  });

  useEffect(() => {
    localStorage.setItem('ec_settings', JSON.stringify(settings));
  }, [settings]);

  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // App States
  const [notices] = useState<Notice[]>(MOCK_NOTIFICATIONS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const loginCardRef = useRef<HTMLDivElement>(null);

  const handleMouseMoveAuth = (e: React.MouseEvent) => {
    if (!loginCardRef.current || user || window.innerWidth < 1024) return;
    const card = loginCardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (centerY - y) / 15;
    const rotateY = (x - centerX) / 15;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeaveAuth = () => {
    if (!loginCardRef.current) return;
    loginCardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const demoUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0] || 'User',
      email: email,
      role: authRole,
      status: 'APPROVED',
      avatar: `https://i.pravatar.cc/150?u=${email}`
    };
    setUser(demoUser);
    setActiveTab(authRole === UserRole.ADMIN ? 'dashboard' : 'home');
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
    setSelectedRecipient(null);
    setIsSidebarOpen(false);
  };

  const handleFacultySelect = (facultyId: string) => {
    const target = MOCK_USERS.find(u => u.id === facultyId);
    if (target) {
      setSelectedRecipient(target);
      setActiveTab('chats');
      setIsSidebarOpen(false);
    }
  };

  const renderHome = () => (
    <div className="space-y-8 md:space-y-16 animate-fadeIn max-w-7xl mx-auto py-6 md:py-12 px-4 md:px-6 pb-24 relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10">
        <div>
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
            Node Sync<br/>
            <span className="text-white/40">{user?.name.split(' ')[0]}</span>
          </h2>
          <div className="flex items-center space-x-4 mt-4 md:mt-6">
             <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
               <p className="text-emerald-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">Link Stable</p>
             </div>
          </div>
        </div>
        <div className="flex items-center space-x-4 md:space-x-6">
           <button className="p-4 md:p-6 bg-white/5 rounded-2xl md:rounded-[2rem] border border-white/10 backdrop-blur-2xl relative group transition-all hover:bg-white/10 shadow-2xl">
             {/* Fix: Removed invalid md:size and used responsive Tailwind classes */}
             <Bell className="w-6 h-6 md:w-32 md:h-32 text-slate-300" />
             <span className="absolute top-4 md:top-6 right-4 md:right-6 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#1a0b2e]"></span>
           </button>
           <div className="p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full shadow-2xl cursor-pointer" onClick={() => setActiveTab('profile')}>
             <img src={user?.avatar} className="w-12 h-12 md:w-16 md:size-16 rounded-full object-cover border-2 border-[#1a0b2e]" alt="" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {[
          { title: 'Notice Board', icon: Megaphone, color: 'text-indigo-400', bg: 'bg-indigo-600/20', desc: 'Sync with official MSBTE circulars and college broadcasts.', action: () => setActiveTab('notices') },
          { title: 'Faculty Hub', icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-600/20', desc: 'Secure point-to-point communication with mentors.', action: () => setActiveTab('chats') },
          { title: 'EduAI Engine', icon: Cpu, color: 'text-white', bg: 'bg-indigo-600', desc: 'Neural MSBTE curriculum assistant. Synthesis online.', action: () => setActiveTab('ai-chat'), highlight: true, hasSparkle: true }
        ].map((card, i) => (
          <div key={i} onClick={card.action} className={`inner-card-glass p-8 md:p-12 rounded-3xl md:rounded-[4rem] border border-white/5 group hover:border-white/20 transition-all duration-500 cursor-pointer flex flex-col h-full ${card.highlight ? 'shadow-2xl bg-indigo-600/10' : ''}`}>
            <div className={`w-14 h-14 md:w-20 md:h-20 ${card.bg} rounded-2xl md:rounded-[2rem] flex items-center justify-center mb-6 md:mb-10 group-hover:scale-110 transition-all relative`}>
              {card.hasSparkle && <Sparkles size={16} className="absolute -top-2 -right-2 text-white animate-pulse" />}
              {/* Fix: Removed invalid md:size and used responsive Tailwind classes */}
              <card.icon className={`${card.color} w-7 h-7 md:w-10 md:h-10`} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-3 md:mb-4 tracking-tight">{card.title}</h3>
            <p className="text-slate-500 text-sm md:text-[15px] leading-relaxed mb-6 md:mb-10 flex-1">{card.desc}</p>
            <div className="flex items-center space-x-3 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400 opacity-60 group-hover:opacity-100 transition-all">
               <span>Access Node</span>
               <ChevronRight size={14} md:size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center p-4 md:p-8 perspective-stage relative overflow-hidden bg-[#050510]">
        <div className="cosmic-bg">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="star" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: `${1 + Math.random() * 2}px`, height: `${1 + Math.random() * 2}px`, '--duration': `${3 + Math.random() * 5}s` } as any} />
          ))}
        </div>
        <div className="mountain-silhouette"></div>
        <div className="tree-silhouette"></div>
        
        <div 
          ref={loginCardRef}
          onMouseMove={handleMouseMoveAuth}
          onMouseLeave={handleMouseLeaveAuth}
          className="w-full max-w-[420px] login-glass rounded-3xl md:rounded-[2.5rem] p-8 md:p-12 shadow-2xl tilt-box animate-floatIn relative z-10 transition-transform duration-200 border-white/20 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl shadow-indigo-600/40 border border-white/10">EC</div>
          </div>
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-8">Login</h2>

          <form onSubmit={handleAuth} className="space-y-4 md:space-y-6">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mb-4 overflow-hidden backdrop-blur-md">
               {(['STUDENT', 'FACULTY', 'ADMIN'] as UserRole[]).map((r) => (
                 <button 
                  key={r}
                  type="button" 
                  onClick={() => setAuthRole(r)} 
                  className={`flex-1 py-2 rounded-lg text-[8px] md:text-[9px] font-bold uppercase tracking-widest transition-all ${authRole === r ? 'bg-white text-indigo-950' : 'text-white/40 hover:text-white/70'}`}
                 >
                   {r}
                 </button>
               ))}
            </div>

            <div className="relative group">
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Username" 
                className="w-full bg-white/10 border border-white/20 rounded-full py-3.5 md:py-4 px-6 text-white text-sm placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/50 transition-all" 
              />
              <UserIcon className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            </div>

            <div className="relative group">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Password" 
                className="w-full bg-white/10 border border-white/20 rounded-full py-3.5 md:py-4 px-6 text-white text-sm placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/50 transition-all pr-14" 
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center space-x-3 text-white/40">
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-white transition-colors">
                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
                 <Lock size={18} />
              </div>
            </div>

            <div className="flex items-center justify-between px-2 text-[10px] md:text-[11px] text-white/60">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={() => setRememberMe(!rememberMe)} 
                  className="w-3.5 h-3.5 rounded bg-white/10 border-white/20 checked:bg-indigo-600 transition-all" 
                />
                <span className="group-hover:text-white transition-colors">Remember Me</span>
              </label>
              <button type="button" className="hover:text-white transition-colors">Forgot Password</button>
            </div>
            
            <button type="submit" className="w-full py-4 bg-white text-indigo-950 rounded-full font-bold text-sm uppercase tracking-widest shadow-xl hover:bg-opacity-90 transition-all active:scale-[0.97] mt-4 shimmer">
              Login
            </button>
          </form>

          <div className="mt-8 text-white/50 text-[10px] md:text-[11px]">
            Don't have account? <button onClick={() => setIsLogin(false)} className="text-white font-bold hover:underline">Register</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#050510] text-white selection:bg-indigo-500/30">
      <div className="cosmic-bg pointer-events-none opacity-40"></div>
      
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - responsive behavior */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-500 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          user={user} 
          activeTab={activeTab} 
          setActiveTab={(tab) => { setActiveTab(tab); setSelectedRecipient(null); setIsSidebarOpen(false); }} 
          onLogout={handleLogout}
          onSelectFaculty={handleFacultySelect}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative z-10 h-full">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-slate-950/50 backdrop-blur-xl border-b border-white/5 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-xs border border-white/10">EC</div>
            <h1 className="text-lg font-black tracking-tighter">EduConnect</h1>
          </div>
          <button className="p-2 -mr-2 text-slate-400 hover:text-white transition-colors" onClick={() => setActiveTab('profile')}>
            <img src={user.avatar} className="w-8 h-8 rounded-full border border-indigo-500/30" alt="" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-12 pt-4 md:pt-6 pb-24 md:pb-20">
          <div className="h-full">
            {activeTab === 'home' && renderHome()}
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'chats' && <ChatWindow currentUser={user} recipient={selectedRecipient} settings={settings} />}
            {activeTab === 'ai-chat' && <ChatWindow currentUser={user} isAI={true} settings={settings} />}
            {activeTab === 'settings' && <SettingsView settings={settings} setSettings={setSettings} />}
            {activeTab === 'profile' && (
              <div className="max-w-3xl mx-auto py-12 animate-fadeIn">
                 <div className="text-center mb-12">
                    <div className="relative inline-block mb-6">
                      <img src={user.avatar} className="w-32 h-32 md:w-40 md:h-40 rounded-[3rem] object-cover border-4 border-indigo-500/20 shadow-2xl" alt="" />
                      <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-3 rounded-2xl shadow-xl">
                        <UserIcon size={20} />
                      </div>
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter mb-2">{user.name}</h2>
                    <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.4em]">{user.role} CORE MODULE</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="inner-card-glass p-8 rounded-[2.5rem] border border-white/5">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Identity Matrix</p>
                       <div className="space-y-4">
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold mb-1">EMAIL SYNC</p>
                            <p className="text-white font-medium">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold mb-1">DEPT NODE</p>
                            <p className="text-white font-medium">{user.department || 'General Matrix'}</p>
                          </div>
                       </div>
                    </div>
                    <div className="inner-card-glass p-8 rounded-[2.5rem] border border-white/5">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Session Telemetry</p>
                       <div className="space-y-4">
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold mb-1">LINK STATUS</p>
                            <p className="text-emerald-400 font-black tracking-widest uppercase text-xs">ONLINE</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold mb-1">ENCRYPTION</p>
                            <p className="text-indigo-400 font-black tracking-widest uppercase text-xs">AES-256 ACTIVE</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}
            {activeTab === 'notices' && (
              <div className="max-w-4xl mx-auto py-8 md:py-16 animate-fadeIn relative z-10 px-4">
                <div className="flex items-center space-x-4 md:space-x-6 mb-10 md:mb-16">
                   <div className="p-4 md:p-6 bg-indigo-600/20 rounded-2xl md:rounded-[2rem] border border-indigo-500/20">
                     {/* Fix: Removed invalid md:size and used responsive Tailwind classes */}
                     <Megaphone className="text-indigo-400 w-6 h-6 md:w-10 md:h-10" />
                   </div>
                   <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter">Broadcasts</h2>
                </div>
                <div className="grid gap-6 md:gap-10">
                  {notices.map(n => (
                    <div key={n.id} className="inner-card-glass p-8 md:p-12 rounded-[2rem] md:rounded-[4rem] border border-white/5 hover:border-white/20 transition-all duration-500 group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-10 gap-4">
                         <span className={`w-fit px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] ${n.type === 'URGENT' ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'}`}>{n.type}</span>
                         <p className="text-[10px] md:text-[12px] text-slate-500 font-black uppercase tracking-[0.5em]">{n.date}</p>
                      </div>
                      <h3 className="text-2xl md:text-4xl font-black text-white mb-4 md:mb-8 tracking-tight leading-tight">{n.title}</h3>
                      <p className="text-slate-400 leading-relaxed text-sm md:text-lg mb-4 md:mb-0">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Mobile Bottom Nav Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-4 safe-bottom z-40">
          <button 
            onClick={() => setActiveTab('home')}
            className={`p-2 transition-all ${activeTab === 'home' ? 'text-indigo-400' : 'text-slate-500'}`}
          >
            <Home size={22} className={activeTab === 'home' ? 'scale-110' : ''} />
          </button>
          <button 
            onClick={() => setActiveTab('notices')}
            className={`p-2 transition-all ${activeTab === 'notices' ? 'text-indigo-400' : 'text-slate-500'}`}
          >
            <Megaphone size={22} className={activeTab === 'notices' ? 'scale-110' : ''} />
          </button>
          <button 
            onClick={() => setActiveTab('ai-chat')}
            className={`p-3 -mt-6 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/40 border-2 border-[#1a0b2e] transition-all ${activeTab === 'ai-chat' ? 'scale-110' : ''}`}
          >
            <Cpu size={22} className="text-white" />
          </button>
          <button 
            onClick={() => setActiveTab('chats')}
            className={`p-2 transition-all ${activeTab === 'chats' ? 'text-indigo-400' : 'text-slate-500'}`}
          >
            <MessageSquare size={22} className={activeTab === 'chats' ? 'scale-110' : ''} />
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`p-2 transition-all ${activeTab === 'settings' ? 'text-indigo-400' : 'text-slate-500'}`}
          >
            <SettingsIcon size={22} className={activeTab === 'settings' ? 'scale-110' : ''} />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default App;
