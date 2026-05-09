import { useChatStore } from '../../store/useChatStore';
import { cn } from '../../utils/cn';
import { Search, UserCircle2 } from 'lucide-react';

export default function ChatSidebar() {
  const { conversations, activeConversationId, setActiveConversation, markAsRead } = useChatStore();

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    markAsRead(id);
  };

  return (
    <div className="w-full md:w-80 lg:w-96 flex flex-col h-full border-r border-zinc-800/50 glass">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800/50 flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          Mission Control
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search missions or providers..." 
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => handleSelectConversation(conv.id)}
            className={cn(
              "w-full flex items-start gap-3 p-3 rounded-xl transition-all duration-200 text-left relative overflow-hidden group",
              activeConversationId === conv.id 
                ? "bg-zinc-800/80 border border-zinc-700 shadow-[0_0_15px_rgba(212,255,0,0.05)]" 
                : "hover:bg-zinc-800/40 border border-transparent"
            )}
          >
            {/* Active Indicator Line */}
            {activeConversationId === conv.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary neon-glow" />
            )}

            <div className="relative shrink-0">
              {conv.participantAvatar ? (
                <img src={conv.participantAvatar} alt={conv.participantName} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <UserCircle2 className="w-12 h-12 text-zinc-600" />
              )}
              {conv.isOnline && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary border-2 border-background rounded-full" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className={cn(
                  "font-semibold truncate",
                  conv.unreadCount > 0 ? "text-white" : "text-zinc-200"
                )}>
                  {conv.participantName}
                </h3>
                {conv.lastMessage && (
                  <span className="text-[10px] text-zinc-500 shrink-0 ml-2">
                    {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(conv.lastMessage.timestamp))}
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center gap-2">
                <p className={cn(
                  "text-sm truncate",
                  conv.unreadCount > 0 ? "text-zinc-300 font-medium" : "text-zinc-500"
                )}>
                  {conv.lastMessage?.text || "No messages yet"}
                </p>
                {conv.unreadCount > 0 && (
                  <span className="shrink-0 bg-primary text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
