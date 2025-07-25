'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, MessageList, MessageInput, Window } from 'stream-chat-react';
import { X, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import 'stream-chat-react/dist/css/v2/index.css';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string | string[];
}

const ChatSidebar = ({ isOpen, onClose, meetingId }: ChatSidebarProps) => {
  const { user } = useUser();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [chatChannel, setChatChannel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeChat = async () => {
      if (!user || !meetingId) {
        setIsLoading(false);
        return;
      }

      try {
        // Get or create a singleton client instance
        const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY!);
        
        // Only connect if not already connected
        if (!client.user) {
          const res = await fetch('/api/stream-chat-token');
          const { token } = await res.json();
          
          await client.connectUser(
            {
              id: user.id,
              name: user.username || user.firstName || user.id,
              image: user.imageUrl,
            },
            token
          );
        }

        const channelId = typeof meetingId === 'string' ? meetingId : meetingId[0];
        const channel = client.channel('messaging', channelId, {
          members: [user.id],
        });
        
        await channel.watch();
        setChatClient(client);
        setChatChannel(channel);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setChatClient(null);
        setChatChannel(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Only initialize when chat is opened
    if (isOpen && !chatClient) {
      initializeChat();
    }

    // No cleanup function - let the client persist globally
  }, [user, meetingId, isOpen, chatClient]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          "lg:hidden", // Only show on mobile/tablet
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Chat Sidebar */}
      <div className={cn(
        "fixed top-0 h-full bg-background border-l border-border shadow-lg z-50 flex flex-col transition-transform duration-300",
        // Mobile: full screen slide-in from right
        "right-0 w-full sm:w-96",
        // Desktop: fixed sidebar
        "lg:w-80 lg:relative lg:translate-x-0",
        // Animation states
        isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}>
        {/* Chat Header */}
        <div className={cn(
          "flex items-center justify-between border-b border-border",
          "p-3 sm:p-4", // Responsive padding
          "bg-background/95 backdrop-blur-sm" // Better mobile header
        )}>
          <h3 className="font-semibold text-base sm:text-lg">Meeting Chat</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </Button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
                <p className="text-xs sm:text-sm text-muted-foreground">Loading chat...</p>
              </div>
            </div>
          ) : chatClient && chatChannel ? (
            <div className="h-full">
              <div className="h-full flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="text-center text-sm text-muted-foreground">
                      Chat will be available shortly
                    </div>
                  </div>
                </div>
                <div className="border-t border-border p-3">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"
                      disabled
                    />
                    <button 
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50"
                      disabled
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground p-4">
              <div className="text-center">
                <MessageCircle className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
                <p className="text-xs sm:text-sm">Unable to load chat</p>
                <p className="text-xs opacity-70 mt-1">Please try again later</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile Close Area - Swipe indicator */}
        <div className="lg:hidden p-2 border-t border-border/50">
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto"></div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
