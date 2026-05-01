"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, ExternalLink, Info, Languages, Loader2 } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  query: string;
  link?: string;
}

const defaultSteps = [
  {
    id: 1,
    title: "Check Eligibility",
    description: "Ensure you are 18+ and a citizen of India.",
    query: "What are the eligibility criteria to vote in India?"
  },
  {
    id: 2,
    title: "Gather Documents",
    description: "Keep your Aadhaar, Address proof, and photo ready.",
    query: "What documents do I need for voter registration?"
  },
  {
    id: 3,
    title: "Fill Form 6",
    description: "Register online via Voter Helpline or NVSP portal.",
    query: "How do I fill Form 6 for new voter registration?",
    link: "https://voters.eci.gov.in/"
  },
  {
    id: 4,
    title: "Track Status",
    description: "Use your reference ID to track your application.",
    query: "How can I track my voter registration status?"
  },
  {
    id: 5,
    title: "Get Voter ID",
    description: "Collect your EPIC card from the local ERO office.",
    query: "How will I receive my Voter ID card after registration?"
  }
];

export function RegistrationGuide({ language, onAskAI }: { language: string, onAskAI: (query: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [steps, setSteps] = useState<Step[]>(defaultSteps);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translateSteps = async () => {
      if (language === 'en') {
        setSteps(defaultSteps);
        return;
      }

      setIsTranslating(true);
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: JSON.stringify(defaultSteps), 
            targetLanguage: language 
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          if (data.error && data.isQuotaError) {
            console.warn("Translation quota exceeded, using default steps.");
            return;
          }
          console.error("Translation API error:", data);
          return;
        }

        const data = await response.json();
        if (data.translatedText) {
          try {
            const parsed = JSON.parse(data.translatedText);
            setSteps(parsed);
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

    translateSteps();
  }, [language]);

  const toggleStep = (id: number) => {
    setCompletedSteps(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden xl:block">
      <motion.div 
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-white dark:bg-slate-900 border border-border/50 shadow-2xl rounded-r-3xl p-6 w-[320px] pointer-events-auto relative"
      >
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-12 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-r-xl shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          {isOpen ? <ChevronLeft size={24} /> : <Info size={24} />}
        </button>

        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          {isTranslating ? <Loader2 size={20} className="animate-spin text-primary" /> : <CheckCircle2 className="text-secondary" />}
          {language === 'hi' ? 'पंजीकरण मार्गदर्शिका' : 'Registration Guide'}
        </h2>

        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="group">
              <div className="flex items-start gap-3">
                <button 
                  onClick={() => toggleStep(step.id)}
                  className={`mt-1 transition-colors ${completedSteps.includes(step.id) ? 'text-secondary' : 'text-muted-foreground'}`}
                >
                  {completedSteps.includes(step.id) ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <div className="flex-1">
                  <h3 className={`font-bold text-sm transition-all ${completedSteps.includes(step.id) ? 'line-through opacity-50' : 'text-foreground'}`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onAskAI(step.query)}
                      className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-md hover:bg-primary/20 transition-colors font-bold flex items-center gap-1"
                    >
                      <Languages size={10} /> {language === 'hi' ? 'एआई से पूछें' : 'Ask AI'}
                    </button>
                    {step.link && (
                      <a 
                        href={step.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] bg-secondary/10 text-secondary px-2 py-1 rounded-md hover:bg-secondary/20 transition-colors font-bold flex items-center gap-1"
                      >
                        {language === 'hi' ? 'पोर्टल' : 'Portal'} <ExternalLink size={8} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round((completedSteps.length / steps.length) * 100)}%</span>
          </div>
          <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
              className="h-full bg-secondary"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Mobile Version
export function RegistrationGuideMobile({ language, onAskAI }: { language: string, onAskAI: (query: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [steps, setSteps] = useState<Step[]>(defaultSteps);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translateSteps = async () => {
      if (language === 'en') {
        setSteps(defaultSteps);
        return;
      }

      setIsTranslating(true);
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: JSON.stringify(defaultSteps), 
            targetLanguage: language 
          }),
        });
        const data = await response.json();
        if (data.translatedText) {
          try {
            const parsed = JSON.parse(data.translatedText);
            setSteps(parsed);
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

    translateSteps();
  }, [language]);

  const toggleStep = (id: number) => {
    setCompletedSteps(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="xl:hidden w-full mb-6 z-20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white dark:bg-slate-900 border border-border/50 p-4 rounded-2xl shadow-sm flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-secondary/20 p-2 rounded-full text-secondary">
            {isTranslating ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
          </div>
          <div className="text-left">
            <h3 className="font-bold text-sm">{language === 'hi' ? 'पंजीकरण मार्गदर्शिका' : 'Registration Guide'}</h3>
            <p className="text-[10px] text-muted-foreground">{completedSteps.length} of {steps.length} steps completed</p>
          </div>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/50 dark:bg-slate-900/50 border-x border-b border-border/50 p-4 rounded-b-2xl space-y-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-start gap-3">
                  <button 
                    onClick={() => toggleStep(step.id)}
                    className={`mt-1 transition-colors ${completedSteps.includes(step.id) ? 'text-secondary' : 'text-muted-foreground'}`}
                  >
                    {completedSteps.includes(step.id) ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                  <div className="flex-1">
                    <h4 className={`font-bold text-xs ${completedSteps.includes(step.id) ? 'line-through opacity-50' : 'text-foreground'}`}>
                      {step.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <button 
                        onClick={() => onAskAI(step.query)}
                        className="text-[10px] text-primary font-bold flex items-center gap-1"
                      >
                        <Languages size={10} /> {language === 'hi' ? 'एआई से पूछें' : 'Ask AI'}
                      </button>
                      {step.link && (
                        <a href={step.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-secondary font-bold flex items-center gap-1">
                          {language === 'hi' ? 'पोर्टल' : 'Portal'} <ExternalLink size={8} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ChevronLeft = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);

