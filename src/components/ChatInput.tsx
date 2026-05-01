"use client";

import React, { useState, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  language?: string;
}

const defaultPlaceholder = "Type your question about voting...";

export const ChatInput: React.FC<ChatInputProps> = ({ 
  input, 
  isLoading, 
  onInputChange, 
  onSubmit,
  language = 'en'
}) => {
  const [placeholder, setPlaceholder] = useState(defaultPlaceholder);

  useEffect(() => {
    const translatePlaceholder = async () => {
      if (language === 'en') {
        setPlaceholder(defaultPlaceholder);
        return;
      }
      if (language === 'hi') {
        setPlaceholder("मतदान के बारे में अपना प्रश्न पूछें...");
        return;
      }

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: defaultPlaceholder, targetLanguage: language }),
        });
        const data = await response.json();
        if (data.translatedText) {
          setPlaceholder(data.translatedText);
        }
      } catch (error) {
        console.error("Placeholder translation failed", error);
      }
    };

    translatePlaceholder();
  }, [language]);

  return (
    <footer className="mt-auto z-10">
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-3 p-2 bg-background/80 backdrop-blur-xl border border-border rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all focus-within:shadow-[0_8px_30px_rgba(255,153,51,0.2)] focus-within:border-primary/50"
      >
        <input
          className="flex-1 px-6 py-4 bg-transparent text-lg text-foreground focus:outline-none placeholder:text-muted-foreground/70"
          value={input || ""}
          onChange={onInputChange}
          placeholder={placeholder}
          disabled={isLoading}
          aria-label="Your message"
        />
        <button
          type="submit"
          disabled={isLoading || !input?.trim()}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-accent to-blue-900 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none"
          aria-label="Send message"
        >
          <SendHorizontal size={24} className="ml-1" />
        </button>
      </form>
    </footer>
  );
};

