'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, Clock } from 'lucide-react';

interface CountdownCardProps {
  title: string;
  targetDate: string; // ISO or date string e.g. '2026-06-20T09:00:00'
  subtitle?: string;
}

export default function CountdownCard({ title, targetDate, subtitle }: CountdownCardProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isOver: false
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Determine urgency level
  const isUrgent = timeLeft.days < 3 && !timeLeft.isOver;

  // Visual Theme mapping based on urgency
  const cardTheme = isUrgent 
    ? {
        container: 'bg-red-50/70 border-red-300 shadow-red-100/30',
        badge: 'bg-red-200 text-red-800',
        icon: 'text-red-600',
        textColor: 'text-red-950',
        subColor: 'text-red-900/60'
      }
    : {
        container: 'bg-[#CFC8FF]/20 border-[#CFC8FF] shadow-[#CFC8FF]/20',
        badge: 'bg-[#CFC8FF] text-[#0D3B66]',
        icon: 'text-[#0D3B66]/65',
        textColor: 'text-[#0D3B66]',
        subColor: 'text-[#0D3B66]/60'
      };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`border rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-colors duration-500 relative overflow-hidden ${cardTheme.container}`}
    >
      {/* Glow highlight for urgent warnings */}
      {isUrgent && (
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-400/20 rounded-full blur-2xl animate-pulse" />
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="font-serif text-base font-bold flex items-center gap-1.5">
            {isUrgent ? (
              <AlertCircle className={`w-4 h-4 ${cardTheme.icon} animate-bounce`} />
            ) : (
              <Calendar className={`w-4 h-4 ${cardTheme.icon}`} />
            )}
            {isUrgent ? 'Upcoming Soon!' : 'Milestone Tracker'}
          </span>
          <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full ${cardTheme.badge}`}>
            {timeLeft.isOver ? 'Ended' : isUrgent ? 'Urgent' : 'Steady'}
          </span>
        </div>

        <div>
          <h4 className={`font-sans font-extrabold text-lg leading-snug ${cardTheme.textColor}`}>
            {title}
          </h4>
          {subtitle && (
            <p className={`text-xs mt-0.5 ${cardTheme.subColor}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Ticking Numbers */}
      <div className="mt-6">
        {timeLeft.isOver ? (
          <p className={`text-sm italic font-sans font-bold ${cardTheme.textColor}`}>
            Exam session has concluded. Deep breaths!
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: 'd', value: timeLeft.days },
              { label: 'h', value: timeLeft.hours },
              { label: 'm', value: timeLeft.minutes },
              { label: 's', value: timeLeft.seconds }
            ].map((unit, idx) => (
              <div key={idx} className="bg-white/90 backdrop-blur-md rounded-xl p-2 border border-[#0D3B66]/5">
                <span className={`block font-serif text-xl font-black ${cardTheme.textColor}`}>
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="block text-[9px] uppercase tracking-wider font-sans opacity-50 font-bold">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
