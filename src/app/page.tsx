"use client";

import { useChat } from "@ai-sdk/react";
import { Loader2, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { MessageList } from "@/components/MessageList";
import { ChatInput } from "@/components/ChatInput";
import { AshokaChakra } from "@/components/AshokaChakra";
import { TriviaSection } from "@/components/TriviaSection";
import { RegistrationGuide, RegistrationGuideMobile } from "@/components/RegistrationGuide";

import { LanguageSelectorSidebar } from "@/components/LanguageSelectorSidebar";

function ChatInterface({ userId, conversationId, initialHistory, language, setLanguage }: { userId: string, conversationId: string, initialHistory: any[], language: string, setLanguage: (l: string) => void }) {
  const { messages, status, sendMessage } = useChat({
    id: conversationId,
    messages: initialHistory,
    body: {
      userId,
      conversationId,
      language,
    },
  } as any);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "streaming" || status === "submitted";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleQuickAction = (text: string) => {
    setInput(text);
  };

  const handleAskAI = (text: string) => {
    sendMessage(
      { text },
      { body: { userId, conversationId, language } }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    sendMessage(
      { text: input },
      { body: { userId, conversationId, language } }
    );
    setInput("");
  };

  // Auto-scroll to the bottom when a new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-screen max-w-full mx-auto bg-background relative overflow-hidden">
      {/* Background Ashoka Chakra Watermark */}
      <AshokaChakra className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] w-[120%] h-[120%]" />

      <ChatHeader language={language} setLanguage={setLanguage} />

      {/* Always Visible Trivia Section */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 z-20 mt-4">
        <TriviaSection language={language} />
      </div>

      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Side: Registration Guide (Desktop) */}
        <RegistrationGuide language={language} onAskAI={handleAskAI} />

        {/* Center: Main Chat Area */}
        <main className="flex-1 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-24">
            <RegistrationGuideMobile language={language} onAskAI={handleAskAI} />

            <div className="p-4 rounded-3xl bg-white/40 dark:bg-black/20 border border-border/50 shadow-inner backdrop-blur-xl relative">
              <MessageList 
                messages={messages as any} 
                isLoading={isLoading} 
                onQuickAction={handleQuickAction} 
                messagesEndRef={messagesEndRef} 
                currentLanguage={language}
              />
              
              {/* Floating Google Maps Integration */}
              <div className="sticky bottom-0 right-0 flex justify-end p-2 pointer-events-none">
                <a 
                  href="https://www.google.com/maps/search/polling+booth+near+me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="pointer-events-auto flex items-center gap-2 bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 border border-white/20 backdrop-blur-sm"
                  aria-label="Find your polling booth on Google Maps"
                >
                  <MapPin size={16} />
                  <span>Find Booth</span>
                </a>
              </div>
            </div>
          </div>
        </main>

        {/* Right Side: Language Panel (Desktop) */}
        <LanguageSelectorSidebar language={language} setLanguage={setLanguage} />
      </div>

      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6">
        <ChatInput 
          input={input} 
          isLoading={isLoading} 
          onInputChange={handleInputChange} 
          onSubmit={handleSubmit} 
          language={language}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [userId, setUserId] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [initialHistory, setInitialHistory] = useState<any[]>([]);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    let storedUserId = localStorage.getItem("voter_userId");
    let storedConversationId = localStorage.getItem("voter_conversationId");
    let storedLanguage = localStorage.getItem("voter_language") || "en";

    if (!storedUserId) {
      storedUserId = crypto.randomUUID();
      localStorage.setItem("voter_userId", storedUserId);
    }
    if (!storedConversationId) {
      storedConversationId = crypto.randomUUID();
      localStorage.setItem("voter_conversationId", storedConversationId);
    }
    
    setUserId(storedUserId);
    setConversationId(storedConversationId);
    setLanguage(storedLanguage);

    fetch(`/api/chat/history?conversationId=${storedConversationId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Normalize roles for AI SDK 6
          const history = data.map(msg => ({
            ...msg,
            role: msg.role === 'bot' ? 'assistant' : msg.role
          }));
          setInitialHistory(history);
        }
        setIsReady(true);
      })
      .catch(err => {
        console.error("Error fetching history:", err);
        setIsReady(true);
      });
  }, []);

  const handleLanguageChange = (l: string) => {
    setLanguage(l);
    localStorage.setItem("voter_language", l);
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-background" aria-busy="true" aria-label="Loading application">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return <ChatInterface userId={userId} conversationId={conversationId} initialHistory={initialHistory} language={language} setLanguage={handleLanguageChange} />;
}
