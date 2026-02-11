
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Send, 
  Paperclip, 
  Trash2, 
  Search, 
  Cpu, 
  User,
  History,
  ShieldCheck,
  Lock,
  MoreVertical,
  Download,
  Sparkles,
  Zap,
  ChevronUp,
  ChevronDown,
  X,
  AlertTriangle,
  Mic,
  MicOff,
  Copy,
  Check,
  FileText,
  File,
  Image as ImageIcon,
  Film,
  Music,
  Play,
  FileCode
} from 'lucide-react';
import { Message, User as UserType, UserRole, UserSettings, MessageAttachment } from '../types';
import { generateAIResponse } from '../services/geminiService';

interface ChatWindowProps {
  currentUser: UserType;
  recipient?: UserType | null;
  isAI?: boolean;
  settings?: UserSettings;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  currentUser, 
  recipient, 
  isAI = false, 
  settings = { disableAnimations: false, theme: 'default' } 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchResult, setActiveSearchResult] = useState(0);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pendingAttachment, setPendingAttachment] = useState<MessageAttachment | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const resultRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isAtBottom = useRef(true);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const themeConfig = useMemo(() => {
    switch (settings.theme) {
      case 'cyber':
        return {
          primary: 'bg-fuchsia-600',
          glow: 'bg-fuchsia-600/10',
          text: 'text-fuchsia-400',
          gradient: 'from-fuchsia-600 to-purple-700',
          border: 'border-fuchsia-500/30'
        };
      case 'emerald':
        return {
          primary: 'bg-emerald-600',
          glow: 'bg-emerald-600/10',
          text: 'text-emerald-400',
          gradient: 'from-emerald-600 to-teal-700',
          border: 'border-emerald-500/30'
        };
      case 'ocean':
        return {
          primary: 'bg-sky-600',
          glow: 'bg-sky-600/10',
          text: 'text-sky-400',
          gradient: 'from-sky-600 to-indigo-800',
          border: 'border-sky-500/30'
        };
      case 'forest':
        return {
          primary: 'bg-green-800',
          glow: 'bg-green-800/10',
          text: 'text-green-400',
          gradient: 'from-green-800 to-yellow-900',
          border: 'border-green-700/30'
        };
      default:
        return {
          primary: 'bg-indigo-600',
          glow: 'bg-indigo-600/10',
          text: 'text-indigo-400',
          gradient: 'from-indigo-600 to-indigo-700',
          border: 'border-indigo-500/30'
        };
    }
  }, [settings.theme]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        setIsListening(true);
        recognitionRef.current.start();
      } else {
        alert("Speech Recognition is not supported in this browser.");
      }
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPendingAttachment({
        name: file.name,
        type: file.type,
        url: base64,
        size: (file.size / 1024).toFixed(1) + ' KB'
      });
    };
    reader.readAsDataURL(file);
  };

  const filteredMessages = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return messages.filter(msg => msg.text.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [messages, searchTerm]);

  const handleNextMatch = () => {
    if (filteredMessages.length > 0) {
      const nextIndex = (activeSearchResult + 1) % filteredMessages.length;
      setActiveSearchResult(nextIndex);
      const targetId = filteredMessages[nextIndex].id;
      resultRefs.current[targetId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handlePrevMatch = () => {
    if (filteredMessages.length > 0) {
      const prevIndex = (activeSearchResult - 1 + filteredMessages.length) % filteredMessages.length;
      setActiveSearchResult(prevIndex);
      const targetId = filteredMessages[prevIndex].id;
      resultRefs.current[targetId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const initialGreeting = useMemo(() => ({
    id: 'greeting',
    senderId: 'ai',
    senderName: 'EduAI',
    text: `Hello ${currentUser.name}! I am the EduAI Engine, synchronized with the MSBTE curriculum. How can I assist you today?`,
    timestamp: new Date(),
    isAI: true
  }), [currentUser.name]);

  useEffect(() => {
    if (isAI && messages.length === 0) {
      setMessages([initialGreeting]);
    }
  }, [isAI, initialGreeting, messages.length]);

  const scrollToBottom = (force = false) => {
    if (scrollRef.current && (force || isAtBottom.current) && !isSearching) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: settings.disableAnimations ? 'auto' : 'smooth'
          });
        }
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isSearching]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      isAtBottom.current = scrollHeight - scrollTop - clientHeight < 50;
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() && !pendingAttachment) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputText,
      timestamp: new Date(),
      attachment: pendingAttachment || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    const currentAttachment = pendingAttachment;
    setInputText('');
    setPendingAttachment(null);
    
    setTimeout(() => scrollToBottom(true), 100);

    if (isAI) {
      setIsTyping(true);
      
      const aiMsgId = (Date.now() + 1).toString();
      const initialAiMessage: Message = {
        id: aiMsgId,
        senderId: 'ai',
        senderName: 'EduAI',
        text: '',
        timestamp: new Date(),
        isAI: true
      };
      
      setMessages(prev => [...prev, initialAiMessage]);

      try {
        const stream = generateAIResponse(
          currentInput || "Tell me about this attachment.", 
          `Context: Neural sync for ${currentUser.name}.`,
          currentAttachment || undefined
        );
        
        let firstChunk = true;
        for await (const chunk of stream) {
          if (firstChunk) {
            setIsTyping(false);
            firstChunk = false;
          }
          
          setMessages(prev => prev.map(msg => 
            msg.id === aiMsgId 
              ? { ...msg, text: msg.text + chunk } 
              : msg
          ));
        }
      } catch (error) {
        console.error("AI Error:", error);
        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId 
            ? { ...msg, text: "Sync Interrupted. Link failed." } 
            : msg
        ));
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleClearHistory = () => {
    if (isAI) {
      setMessages([initialGreeting]);
    } else {
      setMessages([]);
    }
    setShowClearConfirm(false);
    setIsSearching(false);
    setSearchTerm('');
  };

  const renderAttachment = (attachment: MessageAttachment, isCurrent: boolean) => {
    const { type, name, url, size } = attachment;
    const isImage = type.startsWith('image/');
    const isVideo = type.startsWith('video/');
    const isAudio = type.startsWith('audio/');

    return (
      <div className={`mt-3 mb-2 overflow-hidden rounded-xl md:rounded-2xl border ${isCurrent ? 'border-white/20 bg-white/5' : 'border-white/10 bg-black/20'} group/attach transition-all`}>
        {isImage && (
          <img src={url} alt={name} className="w-full max-h-48 md:max-h-64 object-cover" />
        )}
        {isVideo && (
          <video src={url} className="w-full aspect-video" controls />
        )}
        {isAudio && (
          <div className="p-3 bg-indigo-500/10">
            <audio src={url} controls className="w-full h-8" />
          </div>
        )}
        <div className="p-3 flex items-center justify-between space-x-3">
          <div className="flex items-center space-x-2 overflow-hidden">
            <p className="text-[10px] md:text-xs font-bold text-white truncate">{name}</p>
          </div>
          <Download size={14} className="text-white/40 shrink-0" />
        </div>
      </div>
    );
  };

  const highlightText = (text: string, highlight: string, isActive: boolean) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className={`rounded-sm px-0.5 inline-block font-bold ${isActive ? 'bg-amber-400 text-black' : 'bg-white/20 text-white'}`}>
              {part}
            </mark>
          ) : part
        )}
      </>
    );
  };

  const renderMessageContent = (text: string, highlight: string, isActive: boolean) => {
    if (!text && !highlight) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => (
      <p key={i} className="mb-2 last:mb-0 leading-relaxed text-sm md:text-base">
        {highlightText(line, highlight, isActive)}
      </p>
    ));
  };

  const isFacultyPrivate = !isAI && currentUser.role === UserRole.FACULTY && recipient?.role === UserRole.FACULTY;

  return (
    <div className="flex flex-col h-full bg-slate-950/40 backdrop-blur-3xl lg:rounded-[3rem] overflow-hidden border-x lg:border border-white/10 shadow-2xl transition-all relative">
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,video/*,audio/*,application/pdf,text/*" />

      {isAI && <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${themeConfig.glow} rounded-full blur-[120px] pointer-events-none z-0`}></div>}

      {showClearConfirm && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
          <div className="inner-card-glass p-8 md:p-10 rounded-[2rem] border border-white/10 max-w-md w-full shadow-2xl text-center scale-up-center">
            <AlertTriangle size={32} className="text-rose-400 mx-auto mb-6" />
            <h3 className="text-xl md:text-2xl font-black text-white mb-4">Purge Logs?</h3>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-8">This will permanently delete the current session. Abort?</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleClearHistory} className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full font-bold text-xs uppercase tracking-widest">Confirm Termination</button>
              <button onClick={() => setShowClearConfirm(false)} className="w-full py-3.5 bg-white/5 text-white rounded-full font-bold text-xs uppercase tracking-widest border border-white/10">Abort Protocol</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`px-4 md:px-8 py-4 md:py-6 border-b border-white/5 flex items-center justify-between backdrop-blur-xl z-10 relative ${isAI ? themeConfig.glow : 'bg-white/5'}`}>
        <div className="flex items-center space-x-3 md:space-x-5">
          <div className="relative">
            {/* Fix: Removed invalid md:size and used responsive Tailwind classes */}
            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center ${isAI ? themeConfig.primary : 'bg-white/5 border border-white/10'}`}>
              {isAI ? <Cpu className="w-5 h-5 md:w-7 md:h-7" /> : <User className="w-5 h-5 md:w-7 md:h-7" />}
            </div>
            <div className="absolute -right-0.5 -bottom-0.5 w-3 h-3 md:w-4 md:h-4 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
          </div>
          <div>
            <h3 className="text-sm md:text-xl font-black text-white truncate max-w-[120px] md:max-w-none">{isAI ? "EduAI Engine" : recipient?.name || "Global Sync"}</h3>
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">{isAI ? "Live Interface" : "Encrypted Link"}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 md:space-x-3">
          {/* Fix: Removed invalid md:size and used responsive Tailwind classes */}
          <button onClick={() => setIsSearching(!isSearching)} className={`p-2.5 md:p-4 rounded-xl transition-all ${isSearching ? themeConfig.primary : 'text-slate-500 hover:bg-white/10'}`}><Search className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]" /></button>
          <button onClick={() => setShowClearConfirm(true)} className="p-2.5 md:p-4 rounded-xl text-slate-500 hover:text-rose-400 transition-all"><Trash2 className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]" /></button>
        </div>
      </div>

      {isSearching && (
        <div className="px-4 md:px-8 py-3 md:py-5 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl flex items-center space-x-2 md:space-x-4 relative z-50">
          <div className="relative flex-1">
            <input type="text" autoFocus value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setActiveSearchResult(0); }} placeholder="Search..." className="w-full bg-white/5 rounded-xl md:rounded-2xl py-2.5 md:py-4 px-10 md:px-12 text-sm text-white outline-none border border-white/10 placeholder-slate-600" />
            <Search size={14} className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>
          {/* Fix: Removed invalid md:size and used responsive Tailwind classes */}
          <div className="flex items-center bg-white/5 rounded-xl md:rounded-2xl border border-white/10 overflow-hidden">
            <button onClick={handlePrevMatch} className="p-2 md:p-4 text-slate-400"><ChevronUp className="w-4 h-4 md:w-5 md:h-5" /></button>
            <button onClick={handleNextMatch} className="p-2 md:p-4 text-slate-400 border-l border-white/10"><ChevronDown className="w-4 h-4 md:w-5 md:h-5" /></button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 md:px-10 py-6 md:py-10 space-y-6 md:space-y-10 custom-scrollbar relative z-10">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
             {/* Fix: Removed invalid md:size and used responsive Tailwind classes */}
             <History className="mb-6 w-[60px] h-[60px] md:w-[100px] md:h-[100px]" />
             <p className="text-xs md:text-sm font-black uppercase tracking-[0.4em]">Establishing Sync...</p>
          </div>
        )}
        
        {messages.map((msg) => {
          const isCurrentUser = msg.senderId === currentUser.id;
          const isAIResp = msg.isAI;
          return (
            <div key={msg.id} ref={el => { resultRefs.current[msg.id] = el; }} className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} group`}>
               <div className={`max-w-[90%] md:max-w-[85%] p-4 md:p-7 rounded-2xl md:rounded-[2.5rem] relative shadow-xl transition-all ${
                isCurrentUser ? `bg-gradient-to-br ${themeConfig.gradient} text-white rounded-tr-none` : 
                isAIResp ? 'bg-slate-900/60 text-indigo-50 rounded-tl-none border border-white/10 backdrop-blur-xl' :
                'bg-white/5 text-slate-200 rounded-tl-none border border-white/10 backdrop-blur-md'
              }`}>
                <div className="flex items-center justify-between mb-2">
                   {isAIResp && <Zap size={10} className={`${themeConfig.text} fill-current mr-2`} />}
                   <button onClick={() => handleCopyText(msg.id, msg.text)} className="ml-auto p-1 text-white/30 hover:text-white transition-opacity opacity-0 group-hover:opacity-100">
                     {copiedId === msg.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                   </button>
                </div>
                {msg.attachment && renderAttachment(msg.attachment, isCurrentUser)}
                <div className="font-medium">{renderMessageContent(msg.text, searchTerm, false)}</div>
                <div className="mt-3 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/30 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && <div className="flex space-x-1 p-4 bg-white/5 rounded-full w-fit animate-pulse"><div className="w-1 h-1 bg-white/40 rounded-full animate-bounce"></div><div className="w-1 h-1 bg-white/40 rounded-full animate-bounce delay-75"></div><div className="w-1 h-1 bg-white/40 rounded-full animate-bounce delay-150"></div></div>}
      </div>

      {/* Input */}
      <div className="p-4 md:p-10 bg-slate-950/60 backdrop-blur-3xl border-t border-white/10 shrink-0 safe-bottom">
        {pendingAttachment && (
          <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <span className="text-[10px] font-bold truncate text-white/60">{pendingAttachment.name}</span>
            <button onClick={() => setPendingAttachment(null)}><X size={14} className="text-rose-400" /></button>
          </div>
        )}
        {/* Fix: Removed invalid md:size and used responsive Tailwind classes */}
        <div className="flex items-center bg-white/5 rounded-2xl md:rounded-[3rem] border border-white/10 px-2 md:px-4 py-2 transition-all group focus-within:border-indigo-500/50">
          <button onClick={() => fileInputRef.current?.click()} className="p-3 md:p-4 text-slate-500 hover:text-indigo-400"><Paperclip className="w-5 h-5 md:w-[26px] md:h-[26px]" /></button>
          <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder={isListening ? "Listening..." : "Message..."} className="flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-base px-2 md:px-4 text-white" />
          <button onClick={toggleVoiceInput} className={`p-3 md:p-4 rounded-full ${isListening ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`}>{isListening ? <MicOff className="w-5 h-5 md:w-[26px] md:h-[26px]" /> : <Mic className="w-5 h-5 md:w-[26px] md:h-[26px]" />}</button>
          <button onClick={handleSend} disabled={!inputText.trim() && !pendingAttachment} className={`p-3 md:p-4 rounded-xl md:rounded-[2rem] transition-all ${inputText.trim() || pendingAttachment ? `${themeConfig.primary} text-white` : 'text-slate-700'}`}><Send className="w-5 h-5 md:w-[26px] md:h-[26px]" /></button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
