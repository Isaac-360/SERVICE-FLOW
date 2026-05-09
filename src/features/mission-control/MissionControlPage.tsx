import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import ChatInput from './ChatInput';

export default function MissionControlPage() {
  return (
    <div className="h-[calc(100vh-180px)] flex flex-col md:flex-row overflow-hidden bg-zinc-950/40 rounded-3xl border border-zinc-800 shadow-2xl relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Sidebar - Conversation List */}
      <ChatSidebar />

      {/* Main Content - Chat Window */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <ChatArea />
        <ChatInput />
      </div>
    </div>
  );
}
