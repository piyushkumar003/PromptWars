"use client";

import { useChat } from "@ai-sdk/react";
import { SendHorizontal, User, Bot, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

function ChatInterface({ userId, conversationId, initialHistory }: { userId: string, conversationId: string, initialHistory: any[] }) {
  const { messages, status, sendMessage } = useChat({
    api: '/api/chat',
    body: {
      userId,
      conversationId,
    },
    initialMessages: initialHistory,
  });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "streaming" || status === "submitted";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    sendMessage(
      { role: "user", parts: [{ type: "text", text: input }] },
      { body: { userId, conversationId } }
    );
    setInput("");
  };

  // Auto-scroll to the bottom when a new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-background p-4 sm:p-6 relative overflow-hidden">
      {/* Background Ashoka Chakra Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center dark:opacity-[0.05]">
        <svg viewBox="0 0 100 100" className="w-[120%] h-[120%] animate-[spin_120s_linear_infinite] text-accent">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
          {Array.from({ length: 24 }).map((_, i) => (
            <path key={i} d="M50 50 L50 5" stroke="currentColor" strokeWidth="1" transform={`rotate(${i * 15} 50 50)`} />
          ))}
        </svg>
      </div>

      {/* Header */}
      <header className="flex flex-col items-center justify-center py-8 mb-6 border-b border-border/50 bg-background/60 backdrop-blur-md z-10 sticky top-0 rounded-b-2xl shadow-sm">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-foreground to-secondary drop-shadow-sm">
          Voter Sahayak
        </h1>
        <p className="text-muted-foreground mt-3 text-center max-w-lg text-lg font-medium">
          Empowering your voice in the world's largest democracy.
        </p>
      </header>

      {/* Chat Container */}
      <main className="flex-1 overflow-y-auto mb-6 p-4 rounded-3xl bg-white/40 dark:bg-black/20 border border-border/50 shadow-inner backdrop-blur-xl z-10 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-1000">
            <div className="w-24 h-24 mb-6 text-primary drop-shadow-xl flex items-center justify-center relative">
              {/* Ballot Box Icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full relative z-10">
                <path d="M4 14h16M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M4 14l-2-2v-2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2l-2 2M12 4v4M10 6l2-2 2 2" />
              </svg>
              {/* Chakra Accent */}
              <div className="absolute top-0 right-0 w-8 h-8 text-accent animate-[spin_10s_linear_infinite]">
                 <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5" />
                  {Array.from({ length: 24 }).map((_, i) => (
                    <path key={i} d="M50 50 L50 5" stroke="currentColor" strokeWidth="2" transform={`rotate(${i * 15} 50 50)`} />
                  ))}
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Namaste! Ready to vote?</h2>
            <p className="text-muted-foreground text-lg mb-6 max-w-md">
              Ask me how to register, where to find your polling booth, or what documents you need to participate in the elections.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
              <button onClick={() => setInput("How do I register as a new voter?")} className="text-sm bg-background border border-border/50 hover:border-primary/50 text-foreground py-3 px-4 rounded-xl shadow-sm transition-all hover:shadow-md text-left flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                How do I register to vote?
              </button>
              <button onClick={() => setInput("What documents do I need to carry to the polling booth?")} className="text-sm bg-background border border-border/50 hover:border-secondary/50 text-foreground py-3 px-4 rounded-xl shadow-sm transition-all hover:shadow-md text-left flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                What documents do I need?
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${message.role === "user"
                      ? "bg-gradient-to-br from-primary to-orange-600 text-white"
                      : "bg-white dark:bg-slate-800 border-2 border-secondary text-secondary"
                    }`}
                >
                  {message.role === "user" ? <User size={22} /> : (
                     <svg viewBox="0 0 100 100" className="w-6 h-6 text-secondary animate-[spin_20s_linear_infinite]">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
                      {Array.from({ length: 24 }).map((_, i) => (
                        <path key={i} d="M50 50 L50 5" stroke="currentColor" strokeWidth="4" transform={`rotate(${i * 15} 50 50)`} />
                      ))}
                    </svg>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-3xl p-5 text-[1.05rem] leading-relaxed shadow-md backdrop-blur-sm ${message.role === "user"
                      ? "bg-gradient-to-br from-primary/90 to-primary text-white rounded-tr-sm"
                      : "bg-white dark:bg-slate-900 border border-border/50 border-l-4 border-l-secondary text-foreground rounded-tl-sm"
                    }`}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc ml-5 mb-2" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal ml-5 mb-2" {...props} />,
                      li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                    }}
                  >
                    {(message as any).content || message.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('')}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white dark:bg-slate-800 border-2 border-secondary text-secondary flex items-center justify-center shadow-md">
                   <svg viewBox="0 0 100 100" className="w-6 h-6 animate-[spin_3s_linear_infinite]">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
                    {Array.from({ length: 24 }).map((_, i) => (
                      <path key={i} d="M50 50 L50 5" stroke="currentColor" strokeWidth="4" transform={`rotate(${i * 15} 50 50)`} />
                    ))}
                  </svg>
                </div>
                <div className="max-w-[80%] rounded-3xl p-5 bg-white dark:bg-slate-900 border border-border/50 border-l-4 border-l-secondary rounded-tl-sm shadow-md flex items-center gap-3">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-muted-foreground font-medium text-sm">Consulting the guidelines...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Form */}
      <footer className="mt-auto z-10">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 p-2 bg-background/80 backdrop-blur-xl border border-border rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all focus-within:shadow-[0_8px_30px_rgba(255,153,51,0.2)] focus-within:border-primary/50"
        >
          <input
            className="flex-1 px-6 py-4 bg-transparent text-lg text-foreground focus:outline-none placeholder:text-muted-foreground/70"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your question about voting..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-accent to-blue-900 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
          >
            <SendHorizontal size={24} className="ml-1" />
          </button>
        </form>
      </footer>
    </div>
  );
}

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [userId, setUserId] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [initialHistory, setInitialHistory] = useState<any[]>([]);

  useEffect(() => {
    let storedUserId = localStorage.getItem("voter_userId");
    let storedConversationId = localStorage.getItem("voter_conversationId");

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

    fetch(`/api/chat/history?conversationId=${storedConversationId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInitialHistory(data);
        }
        setIsReady(true);
      })
      .catch(err => {
        console.error(err);
        setIsReady(true);
      });
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return <ChatInterface userId={userId} conversationId={conversationId} initialHistory={initialHistory} />;
}
