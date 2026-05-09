import { create } from 'zustand';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
}

export interface Conversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: 'Client' | 'Provider';
  lastMessage?: Message;
  unreadCount: number;
  isOnline: boolean;
}

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // conversationId -> messages
  activeConversationId: string | null;
  
  setActiveConversation: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string) => void;
  markAsRead: (conversationId: string) => void;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participantName: 'Alex Mercer',
    participantRole: 'Provider',
    unreadCount: 2,
    isOnline: true,
    lastMessage: {
      id: 'm-1',
      senderId: 'provider-1',
      text: 'I have reviewed the files you sent. We can start the mission tomorrow.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
      isRead: false,
    }
  },
  {
    id: 'conv-2',
    participantName: 'Sarah Chen',
    participantRole: 'Provider',
    unreadCount: 0,
    isOnline: false,
    lastMessage: {
      id: 'm-2',
      senderId: 'me',
      text: 'Thanks! The design looks great.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      isRead: true,
    }
  }
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'm-0',
      senderId: 'me',
      text: 'Here are the design assets for the new project.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isRead: true,
    },
    {
      id: 'm-1',
      senderId: 'provider-1',
      text: 'I have reviewed the files you sent. We can start the mission tomorrow.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      isRead: false,
    }
  ],
  'conv-2': [
    {
      id: 'm-2',
      senderId: 'me',
      text: 'Thanks! The design looks great.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isRead: true,
    }
  ]
};

export const useChatStore = create<ChatState>((set) => ({
  conversations: MOCK_CONVERSATIONS,
  messages: MOCK_MESSAGES,
  activeConversationId: null,

  setActiveConversation: (id) => set({ activeConversationId: id }),

  sendMessage: (conversationId, text) => set((state) => {
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: 'me',
      text,
      timestamp: new Date().toISOString(),
      isRead: true,
    };

    const updatedMessages = {
      ...state.messages,
      [conversationId]: [...(state.messages[conversationId] || []), newMessage]
    };

    const updatedConversations = state.conversations.map(conv => 
      conv.id === conversationId 
        ? { ...conv, lastMessage: newMessage }
        : conv
    );

    return {
      messages: updatedMessages,
      conversations: updatedConversations
    };
  }),

  markAsRead: (conversationId) => set((state) => {
    const updatedConversations = state.conversations.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    );

    const updatedMessagesForConv = (state.messages[conversationId] || []).map(m => 
      ({ ...m, isRead: true })
    );

    return {
      conversations: updatedConversations,
      messages: {
        ...state.messages,
        [conversationId]: updatedMessagesForConv
      }
    };
  })
}));
