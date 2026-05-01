"use client";

import React from 'react';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatHeaderProps {
  language: string;
  setLanguage: (l: string) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = () => {
  return (
    <header className="flex flex-col items-center justify-center py-6 border-b border-border/50 bg-background/80 backdrop-blur-xl z-50 rounded-b-[2.5rem] shadow-lg shrink-0">
      <div className="w-full flex justify-between items-center px-6 max-w-4xl relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <Home className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-slate-900 to-green-600 dark:from-orange-400 dark:via-white dark:to-green-400">
              Voter Sahayak
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
              Empowering Every Vote
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Phase 2</span>
            <span className="text-[8px] text-muted-foreground">AI Powered Guide</span>
          </div>
        </div>
      </div>
    </header>
  );
};
