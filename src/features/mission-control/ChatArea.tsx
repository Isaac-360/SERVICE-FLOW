import { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { cn } from '../../utils/cn';
import { ShieldCheck, UserCircle2 } from 'lucide-react';

export default function ChatArea() {
  const { activeConversationId, conversations, messages } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages]);

  if (!activeConversationId || !activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 bg-zinc-950/20">
        <div className="w-16 h-16 bg-zinc-900/50 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800">
          <ShieldCheck className="w-8 h-8 opacity-20" />
        </div>
        <p className="text-sm font-medium">Secure Channel Initialized</p>
        <p className="text-xs opacity-50 mt-1">Select a mission conversation to begin briefing.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950/20">
      {/* Chat Header */}
      <div className="p-4 border-b border-zinc-800/50 glass-dark flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            {activeConversation.participantAvatar ? (
              <img src={activeConversation.participantAvatar} alt={activeConversation.participantName} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <UserCircle2 className="w-10 h-10 text-zinc-600" />
            )}
            {activeConversation.isOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary border-2 border-[#0A0A0B] rounded-full" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{activeConversation.participantName}</h3>
            <p className="text-[10px] text-primary flex items-center gap-1 uppercase tracking-widest font-bold">
              <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
              Secure Link Active
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] text-zinc-500 uppercase font-medium">Mission Status</span>
            <span className="text-xs text-zinc-300 font-semibold">Coordination Phase</span>
          </div>
          <div className="w-px h-8 bg-zinc-800/50" />
          <button className="p-2 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide"
      >
        <div className="flex justify-center mb-8">
          <div className="px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-primary" />
            End-to-End Encrypted Tunnel
          </div>
        </div>

        {activeMessages.map((msg, idx) => {
          const isMe = msg.senderId === 'me';
          return (
            <div 
              key={msg.id} 
              className={cn(
                "flex flex-col max-w-[85%] md:max-w-[70%]",
                isMe ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className={cn(
                "px-4 py-3 rounded-2xl text-sm relative group transition-all duration-300",
                isMe 
                  ? "bg-primary text-black font-medium rounded-tr-none shadow-[0_0_20px_rgba(212,255,0,0.1)]" 
                  : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none"
              )}>
                {msg.text}
                
                {/* Micro-glow for client messages */}
                {isMe && (
                  <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <span className="text-[10px] text-zinc-600 mt-1 px-1">
                {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(msg.timestamp))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
