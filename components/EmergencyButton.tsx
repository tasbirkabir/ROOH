'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Sparkles, Quote, Music, MessageSquare } from 'lucide-react';

// Pre-defined deep reassurance elements for Ruhi's emotional support
const COMFORT_DATABASE = [
  {
    type: 'letter',
    category: 'Self Doubt',
    icon: MessageSquare,
    title: 'A reminder of your strength 🌸',
    content: "Ruhi, you are studying so hard, and it's completely normal to feel overwhelmed. Your worth is not defined by how much information you memorize today. You are going to make an incredibly empathetic, brilliant doctor because you care so deeply. Take a deep breath. I believe in you.",
  },
  {
    type: 'quote',
    category: 'Exam Anxiety',
    icon: Quote,
    title: 'Perspective over Pressure ✨',
    content: '"Resting is not quitting. One step is still progress. Trust the timing of your life, and remember that your medical path is a marathon, not a sprint. You have survived all of your hardest days so far."',
  },
  {
    type: 'memory',
    category: 'Motivation',
    icon: Sparkles,
    title: 'Remember this moment 🤍',
    content: "Recall the absolute joy when you got your admission letter. Remember the passion that sparked this path. That spark is still inside you, even when the books feel heavy. Close your eyes, inhale for 4 seconds, hold for 4, and let it go.",
  },
  {
    type: 'voice_note',
    category: 'Burnout',
    icon: Music,
    title: 'Soft Sound Check-in 🎵',
    content: "Imagine hearing: 'Hey Ruhi, you've done enough for today. Close the laptop, make yourself a warm cup of mint tea, and listen to the rain. The books will wait. Your peace comes first.'",
  }
];

interface EmergencyButtonProps {
  visible?: boolean;
}

export default function EmergencyButton({ visible = true }: EmergencyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentComfort, setCurrentComfort] = useState(COMFORT_DATABASE[0]);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  // Loop for Box Breathing cadence (4-4-4 seconds)
  useEffect(() => {
    if (!isOpen) return;
    
    let timer = 0;
    const interval = setInterval(() => {
      timer = (timer + 1) % 12;
      if (timer < 4) {
        setBreathingPhase('Inhale');
      } else if (timer < 8) {
        setBreathingPhase('Hold');
      } else {
        setBreathingPhase('Exhale');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const triggerComfort = () => {
    const randomIndex = Math.floor(Math.random() * COMFORT_DATABASE.length);
    setCurrentComfort(COMFORT_DATABASE[randomIndex]);
    setIsOpen(true);
  };

  const ringVariants = {
    Inhale: {
      scale: 1.6,
      backgroundColor: 'rgba(207, 200, 255, 0.3)', // bg-[#CFC8FF]/30 Lavender layout glow
      borderColor: '#CFC8FF',
      transition: { duration: 4, ease: "easeInOut" }
    },
    Hold: {
      scale: [1.6, 1.63, 1.6], // pulsing slightly
      backgroundColor: [
        'rgba(207, 200, 255, 0.3)',
        'rgba(207, 200, 255, 0.5)',
        'rgba(207, 200, 255, 0.3)'
      ], // ambient color shifts
      borderColor: [
        '#CFC8FF',
        '#CCFFBC',
        '#CFC8FF'
      ],
      transition: {
        duration: 4,
        ease: "easeInOut"
      }
    },
    Exhale: {
      scale: 1.0,
      backgroundColor: 'rgba(204, 255, 188, 0.3)', // bg-[#CCFFBC]/30 Mint Cream glow
      borderColor: '#CCFFBC',
      transition: { duration: 4, ease: "easeInOut" }
    }
  };

  return (
    <>
      {/* Floating Pulse Comfort Button */}
      <AnimatePresence>
        {visible && (
          <motion.button
            key="emergency-trigger-btn"
            onClick={triggerComfort}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-full bg-[#CFC8FF] text-[#0D3B66] font-serif text-lg font-bold shadow-lg shadow-[#CFC8FF]/30 hover:bg-[#b8aeff] transition-colors duration-300 border border-[#0D3B66]/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: [
                "0px 10px 15px -3px rgba(207, 200, 255, 0.3)",
                "0px 10px 25px 5px rgba(207, 200, 255, 0.5)",
                "0px 10px 15px -3px rgba(207, 200, 255, 0.3)"
              ]
            }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{
              boxShadow: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <Heart className="w-5 h-5 fill-[#0D3B66] text-[#0D3B66]" />
            </motion.span>
            I Need Comfort
          </motion.button>
        )}
      </AnimatePresence>

      {/* Gentle Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#FFFDF7] border-2 border-[#CFC8FF] p-8 shadow-2xl"
            >
              {/* Decorative Soft Background Blobs */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#CFC8FF]/20 rounded-full blur-2xl -z-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#CCFFBC]/20 rounded-full blur-2xl -z-10" />

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#0D3B66]/5 text-[#0D3B66]/60 hover:text-[#0D3B66] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon & Category Badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-[#CFC8FF]/30 text-[#0D3B66]">
                  {React.createElement(currentComfort.icon, { className: 'w-6 h-6' })}
                </div>
                <span className="text-xs uppercase tracking-widest font-sans font-bold text-[#0D3B66]/50 bg-[#CFC8FF]/10 px-3 py-1 rounded-full">
                  {currentComfort.category}
                </span>
              </div>

              {/* Content */}
              <h2 className="font-serif text-2xl md:text-3xl text-[#0D3B66] mb-4 font-bold leading-tight">
                {currentComfort.title}
              </h2>

              <p className="font-sans text-base md:text-lg text-[#0D3B66]/80 leading-relaxed mb-6 italic">
                {currentComfort.content}
              </p>

              {/* Interactive Mindful Breathing Guide (Feature 4) */}
              <div className="flex flex-col items-center justify-center my-6 p-6 bg-white border border-[#0D3B66]/5 rounded-2xl relative shadow-inner">
                <h4 className="font-serif text-xs font-bold text-[#0D3B66] mb-6 uppercase tracking-widest opacity-60">
                  Mindfulness Breathing Guide
                </h4>
                
                {/* Expanding Glowing Breathing Ring */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <motion.div
                    variants={ringVariants}
                    animate={breathingPhase}
                    className="absolute w-20 h-20 rounded-full border-2 flex items-center justify-center shadow-lg"
                  >
                    <motion.span 
                      animate={breathingPhase === 'Hold' ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="font-serif text-xs font-bold text-[#0D3B66] text-center"
                    >
                      {breathingPhase === 'Inhale' && "Inhale (4s)"}
                      {breathingPhase === 'Hold' && "Hold (4s)"}
                      {breathingPhase === 'Exhale' && "Exhale (4s)"}
                    </motion.span>
                  </motion.div>
                </div>

                <p className="mt-6 text-[10px] text-gray-400 font-sans font-bold tracking-wider text-center uppercase">
                  Follow the Ring: 4s Inhale, 4s Hold, 4s Exhale
                </p>
              </div>

              {/* Action Buttons inside the overlay */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={triggerComfort}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#CCFFBC] hover:bg-[#b6f0a5] text-[#0D3B66] font-sans font-bold transition-all text-sm shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Show Me Something Else
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="py-3 px-5 rounded-2xl bg-[#0D3B66]/5 hover:bg-[#0D3B66]/10 text-[#0D3B66] font-sans font-semibold transition-all text-sm"
                >
                  I feel better now, thank you
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
