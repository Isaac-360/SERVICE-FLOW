import { useState, useRef } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { Send, Paperclip, Smile, Mic } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function ChatInput() {
  const { activeConversationId, sendMessage } = useChatStore();
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!text.trim() || !activeConversationId) return;
    sendMessage(activeConversationId, text);
    setText('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeConversationId) return null;

  return (
    <div className="p-4 border-t border-zinc-800/50 glass-dark">
      <div className="max-w-4xl mx-auto flex items-end gap-2 md:gap-4">
        {/* Attachment Buttons */}
        <div className="flex items-center mb-1">
          <button className="p-2 text-zinc-500 hover:text-primary transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="hidden sm:block p-2 text-zinc-500 hover:text-primary transition-colors">
            <Mic className="w-5 h-5" />
          </button>
        </div>

        {/* Input Field */}
        <div className="flex-1 relative group">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message or share mission details..."
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all pr-12"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-primary transition-colors">
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className={cn(
            "p-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
            text.trim() 
              ? "bg-primary text-black neon-glow" 
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          )}
        >
          <Send className={cn(
            "w-5 h-5 transition-transform duration-300",
            text.trim() && "group-hover:translate-x-1 group-hover:-translate-y-1"
          )} />
          {text.trim() && (
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          )}
        </button>
      </div>
      
      <p className="text-[10px] text-zinc-600 text-center mt-3 uppercase tracking-widest font-medium opacity-50">
        Transmission via encrypted protocol v2.4.0
      </p>
    </div>
  );
}
