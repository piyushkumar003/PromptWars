import React, { useState } from 'react';
import { User, Languages, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { AshokaChakra } from './AshokaChakra';

interface Message {
  id: string;
  role: string;
  content?: string;
  parts?: any[];
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onQuickAction: (text: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  currentLanguage: string;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading, 
  onQuickAction, 
  messagesEndRef,
  currentLanguage
}) => {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [translatingId, setTranslatingId] = useState<string | null>(null);

  const handleTranslate = async (messageId: string, text: string) => {
    if (translations[messageId]) {
      // Toggle off if already translated
      const newTranslations = { ...translations };
      delete newTranslations[messageId];
      setTranslations(newTranslations);
      return;
    }

    setTranslatingId(messageId);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage: currentLanguage }),
      });
      const data = await response.json();
      if (data.translatedText) {
        setTranslations(prev => ({ ...prev, [messageId]: data.translatedText }));
      }
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setTranslatingId(null);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-1000">
        <div className="w-24 h-24 mb-6 text-primary drop-shadow-xl flex items-center justify-center relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full relative z-10" aria-hidden="true">
            <path d="M4 14h16M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M4 14l-2-2v-2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2l-2 2M12 4v4M10 6l2-2 2 2" />
          </svg>
          <AshokaChakra className="absolute top-0 right-0 w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Namaste! Ready to vote?</h2>
        <p className="text-muted-foreground text-lg mb-6 max-w-md">
          Ask me how to register, where to find your polling booth, or what documents you need to participate in the elections.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
          <button 
            onClick={() => onQuickAction("How do I register as a new voter?")} 
            className="text-sm bg-background border border-border/50 hover:border-primary/50 text-foreground py-3 px-4 rounded-xl shadow-sm transition-all hover:shadow-md text-left flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none"
          >
            <div className="w-2 h-2 rounded-full bg-primary" />
            How do I register to vote?
          </button>
          <button 
            onClick={() => onQuickAction("What documents do I need to carry to the polling booth?")} 
            className="text-sm bg-background border border-border/50 hover:border-secondary/50 text-foreground py-3 px-4 rounded-xl shadow-sm transition-all hover:shadow-md text-left flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-secondary outline-none"
          >
            <div className="w-2 h-2 rounded-full bg-secondary" />
            What documents do I need?
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" role="log" aria-label="Conversation history">
      {messages.map((message) => {
        const messageContent = message.content || message.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || "";
        const isTranslated = !!translations[message.id];
        const displayContent = isTranslated ? translations[message.id] : messageContent;

        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${message.role === "user"
                  ? "bg-gradient-to-br from-primary to-orange-600 text-white"
                  : "bg-white dark:bg-slate-800 border-2 border-secondary text-secondary"
                }`}
            >
              {message.role === "user" ? <User size={22} /> : (
                <AshokaChakra className="w-6 h-6" />
              )}
            </div>

            <div className="flex flex-col gap-2 max-w-[85%]">
              <div
                className={`rounded-3xl p-5 text-[1.05rem] leading-relaxed shadow-md backdrop-blur-sm relative group ${message.role === "user"
                    ? "bg-gradient-to-br from-primary/90 to-primary text-white rounded-tr-sm"
                    : "bg-white dark:bg-slate-900 border border-border/50 border-l-4 border-l-secondary text-foreground rounded-tl-sm"
                  }`}
              >
                <ReactMarkdown
                  components={{
                    p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                    strong: ({ ...props }) => <strong className="font-semibold text-accent dark:text-accent-foreground" {...props} />,
                    ul: ({ ...props }) => <ul className="list-disc ml-5 mb-2" {...props} />,
                    ol: ({ ...props }) => <ol className="list-decimal ml-5 mb-2" {...props} />,
                    li: ({ ...props }) => <li className="mb-1" {...props} />,
                  }}
                >
                  {displayContent}
                </ReactMarkdown>

                {message.role !== "user" && (
                  <button
                    onClick={() => handleTranslate(message.id, messageContent)}
                    disabled={translatingId === message.id}
                    className={`absolute -right-10 top-2 p-2 rounded-full bg-white dark:bg-slate-800 border border-border shadow-sm hover:text-primary transition-all opacity-0 group-hover:opacity-100 ${isTranslated ? 'text-primary' : 'text-muted-foreground'}`}
                    title={isTranslated ? "Show original" : "Translate using AI"}
                  >
                    {translatingId === message.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Languages size={14} />
                    )}
                  </button>
                )}
              </div>
              {isTranslated && (
                <span className="text-[10px] font-bold text-primary px-3 uppercase tracking-widest flex items-center gap-1">
                  <Languages size={10} /> AI Translated
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4"
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white dark:bg-slate-800 border-2 border-secondary text-secondary flex items-center justify-center shadow-md">
            <AshokaChakra className="w-6 h-6 animate-[spin_3s_linear_infinite]" />
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
  );
};

