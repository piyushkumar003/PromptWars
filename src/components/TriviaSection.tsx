"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronRight, ChevronLeft, Languages, Loader2 } from 'lucide-react';

interface TriviaFact {
  text: string;
}

const defaultFacts = [
  "India is the world's largest democracy with over 900 million registered voters.",
  "The first general elections in India were held in 1951-52, taking nearly four months to complete.",
  "Indelible ink, used to prevent multiple voting, is manufactured mainly by a single company in Mysore.",
  "The voting age in India was reduced from 21 to 18 years in 1989 by the 61st Amendment.",
  "Electronic Voting Machines (EVMs) were first used on an experimental basis in Kerala in 1982.",
  "The Election Commission of India was established on January 25, 1950, a day before India became a Republic.",
  "The symbol system was introduced in 1951 to help illiterate voters identify candidates easily.",
  "NOTA (None of the Above) was introduced in Indian elections in 2013 following a Supreme Court directive.",
  "The highest polling station in the world is located in Tashigang, Himachal Pradesh, at an altitude of 15,256 feet.",
  "In every election, a polling booth is set up for just a single voter in the Gir Forest of Gujarat."
];

export function TriviaSection({ language = 'en' }: { language?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [facts, setFacts] = useState<string[]>(defaultFacts);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translateFacts = async () => {
      if (language === 'en') {
        setFacts(defaultFacts);
        return;
      }

      setIsTranslating(true);
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: JSON.stringify(defaultFacts), 
            targetLanguage: language 
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Translation API error:", errorData);
          return;
        }
        const data = await response.json();
        if (data.error && data.isQuotaError) {
          console.warn("Translation quota exceeded, using default facts.");
          setFacts(defaultFacts);
          return;
        }
        if (data.translatedText) {
          try {
            const parsed = JSON.parse(data.translatedText);
            setFacts(parsed);
          } catch (e) {
            console.error("Failed to parse AI translation", e);
          }
        }
      } catch (error) {
        console.error("Translation failed", error);
      } finally {
        setIsTranslating(false);
      }
    };

    translateFacts();
  }, [language]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % facts.length);
    }, 20000); // 20 seconds

    return () => clearInterval(timer);
  }, [isPaused, facts.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % facts.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 30000);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + facts.length) % facts.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 30000);
  };

  return (
    <div className="w-full mb-6 z-20">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500/10 via-white/5 to-green-500/10 border border-primary/20 backdrop-blur-md p-4 shadow-lg group">
        <div className="flex items-start gap-4">
          <div className="bg-primary/20 p-2 rounded-full text-primary animate-pulse">
            {isTranslating ? <Loader2 size={20} className="animate-spin" /> : <Lightbulb size={20} />}
          </div>
          
          <div className="flex-1 relative min-h-[60px]">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] uppercase tracking-wider font-bold text-primary/60">
                {language === 'hi' ? 'चुनाव सामान्य ज्ञान' : 'Election Trivia'}
              </p>
              {isTranslating && <span className="text-[8px] font-bold text-primary animate-pulse flex items-center gap-1"><Languages size={8} /> Translating...</span>}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={`${currentIndex}-${language}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-sm sm:text-base font-medium text-foreground leading-relaxed pr-8"
              >
                {facts[currentIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-primary/30 w-full overflow-hidden">
          <motion.div 
            key={currentIndex}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 20, ease: "linear" }}
            className="h-full bg-primary"
          />
        </div>

        {/* Navigation Buttons */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handlePrev}
            className="p-1 hover:bg-primary/10 rounded-full transition-colors text-primary/60 hover:text-primary"
            aria-label="Previous fact"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={handleNext}
            className="p-1 hover:bg-primary/10 rounded-full transition-colors text-primary/60 hover:text-primary"
            aria-label="Next fact"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

