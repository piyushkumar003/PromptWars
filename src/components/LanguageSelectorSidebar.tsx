"use client";

import React, { useState } from 'react';
import { Languages, ChevronLeft, Check, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LanguageSelectorSidebarProps {
  language: string;
  setLanguage: (l: string) => void;
}

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

export function LanguageSelectorSidebar({ language, setLanguage }: LanguageSelectorSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden xl:block">
      <motion.div 
        initial={{ x: 280 }}
        animate={{ x: isOpen ? 0 : 280 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-white dark:bg-slate-900 border border-border/50 shadow-2xl rounded-l-3xl p-6 w-[320px] pointer-events-auto relative"
      >
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -left-12 top-1/2 -translate-y-1/2 bg-secondary text-white p-3 rounded-l-xl shadow-lg flex items-center justify-center hover:bg-secondary/90 transition-colors"
          aria-label="Toggle language selector"
        >
          {isOpen ? <ChevronRight size={24} /> : <Globe size={24} />}
        </button>

        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Languages className="text-primary" />
          {language === 'hi' ? 'भाषा चुनें' : 'Select Language'}
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                language === lang.code 
                  ? 'bg-primary/10 border-primary text-primary shadow-inner' 
                  : 'bg-muted/30 border-border/50 text-foreground hover:bg-muted/50'
              }`}
            >
              <span className="text-sm font-bold">{lang.native}</span>
              <span className="text-[10px] opacity-60">{lang.name}</span>
              {language === lang.code && (
                <motion.div layoutId="active-lang" className="mt-1">
                  <Check size={12} />
                </motion.div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <p className="text-xs text-muted-foreground text-center italic">
            {language === 'hi' 
              ? 'एआई स्वचालित रूप से आपकी चुनी हुई भाषा में सामग्री का अनुवाद करेगा।' 
              : 'AI will automatically translate content into your selected language.'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

const ChevronRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
