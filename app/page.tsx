'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Flame, 
  Sparkles, 
  Clock, 
  Heart, 
  Smile, 
  Waves, 
  Search, 
  Lock, 
  Eye, 
  Calendar, 
  Coffee,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  MessageSquare,
  RefreshCw,
  Wifi,
  WifiOff,
  Bell,
  Trash2,
  CheckCircle,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Music
} from 'lucide-react';

// Import newly implemented components and utilities
import EmergencyButton from '../components/EmergencyButton';
import CountdownCard from '../components/CountdownCard';
import { getDailyContent } from '../lib/contentRotator';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard() {
  // 1. User Authentication Session Tracker
  const [userId, setUserId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  
  // 2. Defensive Database Schema Columns List (Fetched on mount to verify columns exist before upsert)
  const [dbColumns, setDbColumns] = useState<string[]>([
    'user_id', 'log_date', 'water_glasses', 'water_goal', 'sleep_hours', 'breaks_taken', 'study_streak', 'steps'
  ]);

  useEffect(() => {
    const getOrCreateUser = async () => {
      try {
        setSyncStatus('syncing');
        let { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // Attempt to log in anonymously to trigger Supabase Realtime bindings
          const { data: authData, error } = await supabase.auth.signInAnonymously();
          if (error) throw error;
          user = authData.user;
        }
        if (user) {
          setUserId(user.id);
          setSyncStatus('synced');
        } else {
          setSyncStatus('offline');
        }
      } catch (err) {
        console.warn('Real-time auth offline. Sandbox mode active.');
        setSyncStatus('offline');
      }
    };
    getOrCreateUser();
  }, []);

  // 3. Real-time Synchronized States (Shortened names to match production spec)
  const [streak, setStreak] = useState(12);
  const [water, setWater] = useState(0);
  const [waterGoal, setWaterGoal] = useState<number>(8);
  const [sleep, setSleep] = useState(0);
  const [breaks, setBreaks] = useState(0);
  const [tasks, setTasks] = useState<any[]>([]);

  // 4. Experiential Interactive Expansion States
  const [stickyNote, setStickyNote] = useState('');
  const [confetti, setConfetti] = useState<{ id: number; x: number; color: string }[]>([]);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  // 5. Emotional Journey States
  const [isWhyRoohOpen, setIsWhyRoohOpen] = useState(false);
  const [activeSurpriseNote, setActiveSurpriseNote] = useState<string | null>(null);

  // 6. Dynamic Countdown Configurations
  const [countdownTitle, setCountdownTitle] = useState("Anatomy Final Exam");
  const [countdownDate, setCountdownDate] = useState("");
  const [countdownSubtitle, setCountdownSubtitle] = useState("Gross Anatomy & Embryology Review");
  const [isConfiguringCountdown, setIsConfiguringCountdown] = useState(false);

  const [editCountdownTitle, setEditCountdownTitle] = useState("Anatomy Final Exam");
  const [editCountdownSubtitle, setEditCountdownSubtitle] = useState("Gross Anatomy & Embryology Review");
  const [editCountdownDate, setEditCountdownDate] = useState("");

  // 7. Hidden Notes (Easter Eggs) & Achievement Matrix
  const [discoveredEggs, setDiscoveredEggs] = useState<string[]>([]);
  const [activeEggToast, setActiveEggToast] = useState<{ id: string; content: string } | null>(null);

  // 8. Dynamic Moon Mode Engine
  const [isMoonMode, setIsMoonMode] = useState(false);

  // 9. Bad Day Protocol State Machine
  const [showBadDayModal, setShowBadDayModal] = useState(false);
  const [badDayProtocolActive, setBadDayProtocolActive] = useState(false);
  const [activeMoodState, setActiveMoodState] = useState<string | null>(null);
  const [forceComfortOpen, setForceComfortOpen] = useState(false);

  const BAD_DAY_COMFORT_NOTES = [
    "Jaan, you don't have to be perfect. You just have to take care of yourself. I am here for you. 🤍",
    "If all you did today was survive and breathe, I am incredibly proud of you. 🌸",
    "Close your eyes, Ruhi. Let the exhaustion go. Your health is worth more than any grade or exam. 🌙",
    "You are doing your absolute best, and your best is always enough. Rest now, future doctor. 🩺",
    "I wish I was there to hold you and tell you that everything will be okay. Let my words comfort you. 💎"
  ];
  const [currentBadDayComfortNote, setCurrentBadDayComfortNote] = useState(BAD_DAY_COMFORT_NOTES[0]);

  const cycleBadDayComfortNote = () => {
    const currentIdx = BAD_DAY_COMFORT_NOTES.indexOf(currentBadDayComfortNote);
    const nextIdx = (currentIdx + 1) % BAD_DAY_COMFORT_NOTES.length;
    setCurrentBadDayComfortNote(BAD_DAY_COMFORT_NOTES[nextIdx]);
  };

  const toLocalDatetimeString = (isoString: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
      return localISOTime;
    } catch (e) {
      return "";
    }
  };

  // 10. Study hours goal & countdown timer variables
  const [studyHoursGoal, setStudyHoursGoal] = useState(4); // Target study hours goal
  const [secondsRemaining, setSecondsRemaining] = useState(4 * 3600);
  const [timerActive, setTimerActive] = useState(false);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0);

  // 11. Medication Routine Scheduler States
  const [medications, setMedications] = useState<{ id: string; name: string; time: string; taken: boolean }[]>([]);

  // Seeded Daily Content Rotator
  const [dailyData, setDailyData] = useState({
    affirmation: "You are enough, Ruhi. One step is still progress.",
    comfortCard: {
      category: "Study Stress",
      title: "The Books Will Wait 📚",
      content: "If the anatomy diagrams are blurring, close the book. Rest is productive."
    }
  });

  useEffect(() => {
    const daily = getDailyContent();
    setDailyData({
      affirmation: daily.affirmation,
      comfortCard: daily.comfortCard
    });
  }, []);

  const handleSaveCountdown = (title: string, dateStr: string, subtitle: string) => {
    setCountdownTitle(title);
    setCountdownDate(dateStr);
    setCountdownSubtitle(subtitle);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rooh_countdown_title', title);
      localStorage.setItem('rooh_countdown_date', dateStr);
      localStorage.setItem('rooh_countdown_subtitle', subtitle);
    }
    setIsConfiguringCountdown(false);
  };

  const triggerCelebration = (message: string) => {
    setCelebrationMessage(message);
    const newConfetti = Array.from({ length: 40 }).map((_, i) => ({
      id: Math.random() + i,
      x: Math.random() * 100, // percentage width
      color: Math.random() > 0.5 ? '#CFC8FF' : '#CCFFBC', // Lavender or Mint
    }));
    setConfetti(newConfetti);
    setTimeout(() => {
      setConfetti([]);
    }, 4000);
  };

  const sendNativeNotification = (title: string, message: string) => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn(`[Push Mock] ${title}: ${message}`);
      return;
    }

    const options = {
      body: message,
      tag: "medication-reminder",
      renotify: true,
      requireInteraction: true,
      vibrate: [300, 100, 300]
    };

    if (Notification.permission === 'granted') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, options)
            .catch(err => {
              console.warn("SW Notification failed, using fallback:", err);
              new Notification(title, options);
            });
        }).catch(() => {
          new Notification(title, options);
        });
      } else {
        new Notification(title, options);
      }
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        setHasPushPermission(permission === 'granted');
        if (permission === 'granted') {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification(title, options);
            }).catch(() => {
              new Notification(title, options);
            });
          } else {
            new Notification(title, options);
          }
        }
      });
    } else {
      console.warn(`[Push Blocked] ${title}: ${message}`);
    }
  };

  const adjustStudyGoal = (amount: number) => {
    const nextGoal = Math.max(1, Math.min(24, studyHoursGoal + amount));
    setStudyHoursGoal(nextGoal);
    setSecondsRemaining(nextGoal * 3600);
    setTotalElapsedSeconds(0);
    setTimerActive(false);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('rooh_study_hours_goal', String(nextGoal));
      localStorage.setItem('rooh_study_seconds_remaining', String(nextGoal * 3600));
      localStorage.setItem('rooh_study_timer_active', 'false');
    }
  };

  const handleToggleTimer = () => {
    const nextActive = !timerActive;
    setTimerActive(nextActive);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('rooh_study_timer_active', String(nextActive));
      localStorage.setItem('rooh_study_last_sync_time', String(Date.now()));
      localStorage.setItem('rooh_study_seconds_remaining', String(secondsRemaining));
    }
  };

  const handleResetTimer = () => {
    setTimerActive(false);
    setSecondsRemaining(studyHoursGoal * 3600);
    setTotalElapsedSeconds(0);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('rooh_study_timer_active', 'false');
      localStorage.setItem('rooh_study_seconds_remaining', String(studyHoursGoal * 3600));
    }
  };

  // Precision Ticker Interval Loop with absolute Timestamp persistence
  useEffect(() => {
    let intervalId: any = null;
    if (timerActive) {
      intervalId = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setTimerActive(false);
            localStorage.setItem('rooh_study_timer_active', 'false');
            localStorage.setItem('rooh_study_seconds_remaining', '0');

            if (!badDayProtocolActive) {
              sendNativeNotification("ROOH Sanctuary 🧠", "done jaan eibar amar kase asho");
              triggerCelebration(getRandomAffirmation());
              triggerSurpriseNote();
              updateWellnessMetric('study_streak', 1);
            }
            return 0;
          }
          
          const next = prev - 1;
          localStorage.setItem('rooh_study_seconds_remaining', String(next));
          localStorage.setItem('rooh_study_last_sync_time', String(Date.now()));

          const elapsed = (studyHoursGoal * 3600) - next;
          setTotalElapsedSeconds(elapsed);

          if (elapsed === 3600 && !badDayProtocolActive) {
            sendNativeNotification("ROOH Sanctuary 🌙", "I love you ruhi");
          }

          return next;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timerActive, studyHoursGoal, badDayProtocolActive]);

  const formatTimerString = () => {
    const hrs = Math.floor(secondsRemaining / 3600);
    const mins = Math.floor((secondsRemaining % 3600) / 60);
    const secs = secondsRemaining % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleWaterGoalChange = (val: number) => {
    const cleanVal = Math.max(1, val);
    setWaterGoal(cleanVal);
    localStorage.setItem('rooh_water_goal', String(cleanVal));
    updateWellnessMetric('water_goal', cleanVal);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      subject: newTaskSubject,
      is_completed: false,
      created_at: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');

    if (!userId) return;

    try {
      setSyncStatus('syncing');
      const { error } = await supabase.from('tasks').insert({
        user_id: userId,
        title: newTask.title,
        subject: newTask.subject,
        is_completed: false
      });
      if (error) throw error;
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('offline');
    }
  };

  const handleToggleTask = async (id: string, is_completed: boolean) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, is_completed } : t));

    if (is_completed) {
      triggerCelebration(getRandomAffirmation());
      if (Math.random() < 0.25) {
        triggerSurpriseNote();
      }
    }

    if (!userId) return;

    try {
      setSyncStatus('syncing');
      const { error } = await supabase.from('tasks').update({ is_completed }).eq('id', id);
      if (error) throw error;
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('offline');
    }
  };

  const handleDeleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));

    if (!userId) return;

    try {
      setSyncStatus('syncing');
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('offline');
    }
  };

  const toggleSound = (sound: string) => {
    setActiveSounds(prev => ({ ...prev, [sound]: !prev[sound] }));
  };

  const handleSendAiPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    const userMsg = aiPrompt;
    setAiPrompt('');
    setAiChatLog(prev => [...prev, { sender: 'User', text: userMsg }]);

    setTimeout(() => {
      let reply = "That's a vital medical concept. Let me check the textbook definitions...";
      if (userMsg.toLowerCase().includes('heart') || userMsg.toLowerCase().includes('cardio')) {
        reply = "The heart acts as a pump in the cardiovascular system. Left ventricle output is SV × HR. Remember, preload and afterload regulate this output!";
      } else if (userMsg.toLowerCase().includes('pharmacology') || userMsg.toLowerCase().includes('drug')) {
        reply = "Pharmacokinetics covers Absorption, Distribution, Metabolism, and Excretion (ADME). Pharmacodynamics is what the drug does to the body!";
      }
      setAiChatLog(prev => [...prev, { sender: 'AI', text: reply }]);
    }, 800);
  };

  const TASBIR_LETTERS = [
    { trigger: 'Stressed', label: 'Open when you\'re stressed', content: "Hey Ruhi, if you're reading this, you're probably working yourself too hard. Put the pen down, take a sip of water, and stretch. You are going to pass this with flying colors, but your health comes first. I am always routing for you." },
    { trigger: 'Post_Anatomy', label: 'Open after your anatomy exam', content: "It's finally over! Regardless of how you feel it went, you survived it. Go celebrate, get some sleep, and let the anatomy coloring book rest for a day. I'm incredibly proud of you!" },
    { trigger: 'Miss_Me', label: 'Open when you miss me', content: "Distance is just numbers, Ruhi. I am always holding a space for you in my heart. Close your eyes, feel the warmth, and know that we will catch up soon. I am just a call away." }
  ];

  const MOOD_RESPONSES: Record<string, string> = {
    Happy: "Your joy is infectious, Ruhi! Capture this feeling and save it for a cloudy day. 🌸",
    Calm: "Peace is a quiet power. Savor this tranquility as you go through your medical readings.",
    Tired: "Your body is asking for kindness. Close the books for 20 minutes and rest your eyes. 😴",
    Stressed: "You do not need to carry all of pathology and surgery in your head at once. Break it down.",
    Sad: "It is okay to not be okay. Let the feelings pass. You are safe here. 🤍",
    Lonely: "You are never truly alone. The people who love you are always carrying you in their thoughts.",
    Motivated: "Run with this spark! But remember to pace yourself so you don't burn out. ✨"
  };

  // 12. LocalStorage Base Hydration (First layer security)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Countdown date restoration/persistence check
      const savedTarget = localStorage.getItem('rooh_countdown_target');
      if (savedTarget) {
        try {
          const target = JSON.parse(savedTarget);
          if (target.title) {
            setCountdownTitle(target.title);
            setEditCountdownTitle(target.title);
          }
          if (target.date) {
            setCountdownDate(target.date);
            setEditCountdownDate(toLocalDatetimeString(target.date));
          }
          if (target.subtitle) {
            setCountdownSubtitle(target.subtitle);
            setEditCountdownSubtitle(target.subtitle);
          }
        } catch (e) {
          console.error("Error loading countdown target object", e);
        }
      } else {
        const savedTitle = localStorage.getItem('rooh_countdown_title');
        const savedDate = localStorage.getItem('rooh_countdown_date');
        const savedSub = localStorage.getItem('rooh_countdown_subtitle');
        const finalTitle = savedTitle || "Anatomy Final Exam";
        const finalSub = savedSub || "Gross Anatomy & Embryology Review";
        const finalDate = savedDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 2.8).toISOString();
        
        setCountdownTitle(finalTitle);
        setEditCountdownTitle(finalTitle);
        setCountdownDate(finalDate);
        setEditCountdownDate(toLocalDatetimeString(finalDate));
        setCountdownSubtitle(finalSub);
        setEditCountdownSubtitle(finalSub);
        
        localStorage.setItem('rooh_countdown_target', JSON.stringify({ title: finalTitle, date: finalDate, subtitle: finalSub }));
      }

      // Sticky notes local area hydration
      const savedNote = localStorage.getItem('local_sticky_note') || '';
      setStickyNote(savedNote);

      // Medications list local hydration
      const savedMeds = localStorage.getItem('rooh_medications');
      if (savedMeds) {
        try {
          setMedications(JSON.parse(savedMeds));
        } catch (e) {
          console.error("Error parsing medications from local cache", e);
        }
      } else {
        const defaults = [
          { id: '1', name: 'Multivitamin', time: '08:00 AM', taken: false },
          { id: '2', name: 'Iron Supplement', time: '10:00 PM', taken: false }
        ];
        setMedications(defaults);
        localStorage.setItem('rooh_medications', JSON.stringify(defaults));
      }

      // Study planner tasks local hydration
      const savedTasks = localStorage.getItem('rooh_study_tasks');
      if (savedTasks) {
        try {
          setTasks(JSON.parse(savedTasks));
        } catch (e) {}
      }

      // Hidden notes (Easter Eggs)
      const savedEggs = localStorage.getItem('rooh_discovered_eggs');
      if (savedEggs) {
        try {
          setDiscoveredEggs(JSON.parse(savedEggs));
        } catch (e) {
          console.error("Error loading discovered eggs", e);
        }
      }

      // Bad Day Protocol states restoration
      const savedProtocol = localStorage.getItem('rooh_bad_day_protocol_active') === 'true';
      const savedMood = localStorage.getItem('rooh_active_mood_state');
      if (savedProtocol) {
        setBadDayProtocolActive(true);
      }
      if (savedMood) {
        setActiveMoodState(savedMood);
      }
    }
  }, []);

  // 13. Timestamp-Based Session Recovery Math
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedGoal = localStorage.getItem('rooh_study_hours_goal');
      const savedActive = localStorage.getItem('rooh_study_timer_active') === 'true';
      const savedSecs = localStorage.getItem('rooh_study_seconds_remaining');
      const savedSync = localStorage.getItem('rooh_study_last_sync_time');

      let goalHours = 4;
      if (savedGoal) {
        goalHours = parseInt(savedGoal, 10);
        setStudyHoursGoal(goalHours);
      }

      let currentRemaining = goalHours * 3600;
      if (savedSecs) {
        currentRemaining = parseInt(savedSecs, 10);
      }

      if (savedActive && savedSync) {
        const elapsed = Math.floor((Date.now() - parseInt(savedSync, 10)) / 1000);
        currentRemaining = Math.max(0, currentRemaining - elapsed);
        if (currentRemaining > 0) {
          setTimerActive(true);
        } else {
          setTimerActive(false);
          currentRemaining = 0;
          // Completed while browser was closed - trigger alerts and achievements
          sendNativeNotification("ROOH Sanctuary 🧠", "done jaan eibar amar kase asho");
          triggerCelebration(getRandomAffirmation());
          triggerSurpriseNote();
          updateWellnessMetric('study_streak', 1);
          localStorage.setItem('rooh_study_timer_active', 'false');
        }
      } else {
        setTimerActive(false);
      }
      setSecondsRemaining(currentRemaining);
      setTotalElapsedSeconds((goalHours * 3600) - currentRemaining);
    }
  }, []);

  // Sync clock hour every 10 seconds to determine Moon Mode status
  useEffect(() => {
    const checkMoonMode = () => {
      const hour = new Date().getHours();
      setIsMoonMode(hour >= 22 || hour < 5);
    };
    checkMoonMode();
    const interval = setInterval(checkMoonMode, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDiscoverEgg = (id: string, content: string) => {
    if (!discoveredEggs.includes(id)) {
      const updated = [...discoveredEggs, id];
      setDiscoveredEggs(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('rooh_discovered_eggs', JSON.stringify(updated));
      }
      if (updated.length === 10) {
        triggerCelebration("Secret Finder Achievement Unlocked! 🏆 You discovered all 10 hidden notes! Tasbir is so proud of you. 🤍");
      }
    }
    setActiveEggToast({ id, content });
  };

  // Helper Component to render tiny hidden note buttons
  const HiddenEgg = ({ id, icon, content }: { id: string; icon: string; content: string }) => {
    const isDiscovered = discoveredEggs.includes(id);
    return (
      <button
        type="button"
        onClick={() => handleDiscoverEgg(id, content)}
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none cursor-pointer ${
          isDiscovered 
            ? 'opacity-90 saturate-100 scale-110' 
            : 'opacity-15 hover:opacity-75 grayscale saturate-50'
        }`}
        title="A little secret..."
      >
        <span className="text-xs">{icon}</span>
      </button>
    );
  };

  // Affirmation Matrix & Ultra-Rare Notes Setup
  const SURPRISE_NOTES = [
    "Just checking in. Have you had water today? 🌸",
    "One chapter closer to becoming Dr. Ruhi. 📚",
    "Someone is incredibly proud of you right now. 🤍",
    "If today feels heavy, carry only the next step. 🌙",
    "Hey future doctor, don't forget to be kind to yourself. 💌"
  ];
  const RARE_SURPRISE_NOTES = [
    "I love your soul. — Tasbir 💎",
    "You're my favorite person. Just thought you should know. 🤍💎"
  ];

  const triggerSurpriseNote = () => {
    // 1% chance for ultra-rare secret notes
    const isRare = Math.random() < 0.01;
    if (isRare) {
      const idx = Math.floor(Math.random() * RARE_SURPRISE_NOTES.length);
      setActiveSurpriseNote(RARE_SURPRISE_NOTES[idx]);
    } else {
      const idx = Math.floor(Math.random() * SURPRISE_NOTES.length);
      setActiveSurpriseNote(SURPRISE_NOTES[idx]);
    }
  };

  // Audio Letters Vault States
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [activeAudioLetter, setActiveAudioLetter] = useState<string | null>(null);

  const AUDIO_LETTERS = [
    { key: 'anatomy', label: '🔒 "Open when you are failing to memorize Anatomy..."', path: '/audio/anatomy_comfort.mp3' },
    { key: 'exam', label: '🔒 "Open after a long, exhausting exam day..."', path: '/audio/exam_comfort.mp3' },
    { key: 'lonely', label: '🔒 "Open at 3 AM when you feel lonely..."', path: '/audio/lonely_comfort.mp3' }
  ];

  const playAudioLetter = (path: string, key: string) => {
    if (activeAudioLetter === key) {
      if (currentAudio) {
        if (isPlaying) {
          currentAudio.pause();
          setIsPlaying(false);
        } else {
          currentAudio.play().then(() => {
            setIsPlaying(true);
          }).catch(e => {
            console.warn("Audio interaction play block or mock active:", e);
            setIsPlaying(true);
          });
        }
      }
      return;
    }

    if (currentAudio) {
      currentAudio.pause();
    }

    const audio = new Audio(path);
    setCurrentAudio(audio);
    setActiveAudioLetter(key);
    setIsPlaying(true);

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(e => {
      console.warn("Audio interaction play block or mock active:", e);
      setIsPlaying(true);
    });

    audio.addEventListener('timeupdate', () => {
      setAudioProgress(audio.currentTime);
    });
    audio.addEventListener('loadedmetadata', () => {
      setAudioDuration(audio.duration || 180); // Fallback to 3m mock
    });
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setActiveAudioLetter(null);
      setAudioProgress(0);
    });
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return "00:00";
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Audio cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [currentAudio]);

  // Audio progress tracking fallback ticker for sandbox / mock assets
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && activeAudioLetter && currentAudio) {
      const isFailedOrMock = currentAudio.error || isNaN(currentAudio.duration) || currentAudio.duration === Infinity;
      if (isFailedOrMock) {
        interval = setInterval(() => {
          setAudioProgress(prev => {
            const duration = audioDuration || 180;
            if (prev >= duration) {
              setIsPlaying(false);
              setActiveAudioLetter(null);
              return 0;
            }
            return prev + 1;
          });
        }, 1000);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeAudioLetter, currentAudio, audioDuration]);

  const [newMedName, setNewMedName] = useState('');
  const [newMedTime, setNewMedTime] = useState('08:00 AM');
  const [lastTriggeredMeds, setLastTriggeredMeds] = useState<Record<string, string>>({}); // medicationId -> YYYY-MM-DD HH:MM

  // Midnight check-in to reset medication completion status
  useEffect(() => {
    const todayStr = new Date().toLocaleDateString('en-CA');
    const lastDate = localStorage.getItem('rooh_meds_last_date');
    if (lastDate !== todayStr) {
      setMedications(prev => prev.map(med => ({ ...med, taken: false })));
      localStorage.setItem('rooh_meds_last_date', todayStr);
    }
  }, []);

  // Time parsing helper supporting 24h & 12h formats
  const parseTimeSlot = (timeStr: string) => {
    const cleanStr = timeStr.trim();
    const parts = cleanStr.split(' ');
    const timeParts = parts[0].split(':');
    let hr = parseInt(timeParts[0], 10);
    const min = parseInt(timeParts[1], 10);
    
    if (parts[1]) {
      const ampm = parts[1].toUpperCase();
      if (ampm === 'PM' && hr < 12) hr += 12;
      if (ampm === 'AM' && hr === 12) hr = 0;
    }
    return { hour: hr, minute: min };
  };

  const TASBIR_AFFIRMATIONS = [
    "I knew you could do it, Doctor! 🌸",
    "You are making your dreams happen, proud of you jaan. 🤍",
    "My future doctor is working so hard today! I love you. 🌙",
    "Hydrated and healthy—proud of you, Ruhi! 🥛🤍",
    "Another step closer to your dreams. You are unstoppable!"
  ];

  const getRandomAffirmation = () => {
    const idx = Math.floor(Math.random() * TASBIR_AFFIRMATIONS.length);
    return TASBIR_AFFIRMATIONS[idx];
  };

  // Planner States
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState<'Anatomy' | 'Physiology' | 'Biochemistry' | 'Pathology' | 'Pharmacology' | 'Medicine' | 'Surgery'>('Anatomy');

  // Client layout helper states
  const [activeMoodResponse, setActiveMoodResponse] = useState<string | null>(null);

  // Soundboard Loop controls
  const [activeSounds, setActiveSounds] = useState<Record<string, boolean>>({
    Rain: false,
    Lofi: false,
    Cafe: false
  });

  // Tasbir Vault State
  const [openedLetter, setOpenedLetter] = useState<string | null>(null);
  const [vaultPassword, setVaultPassword] = useState('');
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);

  // V2 Interactive Hook states
  const [searchDrug, setSearchDrug] = useState('');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiChatLog, setAiChatLog] = useState<{sender: string, text: string}[]>([
    { sender: 'AI', text: "Hello Ruhi! Ask me any medical concept, and I'll explain it simply." }
  ]);

  const flashcards = [
    { question: "What is the primary action of Beta-blockers?", answer: "Decrease heart rate and contractility by blocking epinephrine/norepinephrine binding to beta-adrenergic receptors." },
    { question: "Where is the loop of Henle located in the kidney?", answer: "It extends from the cortex down into the renal medulla to establish a concentration gradient." },
    { question: "What nerve is compressed in Carpal Tunnel Syndrome?", answer: "The Median Nerve." }
  ];

  const handleUnlockVault = () => {
    if (vaultPassword.toLowerCase() === 'tasbir') {
      setIsVaultUnlocked(true);
    } else {
      alert("Incorrect key. (Hint: 'tasbir')");
    }
  };

  // 3. Native OS Notification Permissions and Helper Engine
  const [hasPushPermission, setHasPushPermission] = useState(false);

  // Request native OS Notification access and register Service Worker on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setHasPushPermission(Notification.permission === 'granted');
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          setHasPushPermission(permission === 'granted');
        });
      }
    }
  }, []);

  // 14. Unified Real-Time Replication Sync Engine (Supabase Cloud Layer)
  const syncWellnessToSupabase = async (updatedFields: any) => {
    if (!userId) return;
    const todayStr = new Date().toLocaleDateString('en-CA');
    setSyncStatus('syncing');
    
    try {
      const payload: any = {
        user_id: userId,
        log_date: todayStr,
        ...updatedFields
      };
      
      // Filter out columns not supported in the active DB scheme to prevent crashes
      const filteredPayload: any = {};
      Object.keys(payload).forEach(key => {
        if (dbColumns.includes(key) || dbColumns.length === 0) {
          filteredPayload[key] = payload[key];
        }
      });
      
      const { error } = await supabase
        .from('wellness_tracker')
        .upsert(filteredPayload, { onConflict: 'user_id,log_date' });
        
      if (error) throw error;
      setSyncStatus('synced');
    } catch (err) {
      console.warn('DB Sync failed. Reverting to sandbox state.', err);
      setSyncStatus('offline');
    }
  };

  const syncAllData = async (
    medsList = medications, 
    noteText = stickyNote, 
    title = countdownTitle, 
    targetDate = countdownDate, 
    subtitle = countdownSubtitle,
    waterVal = water,
    waterGoalVal = waterGoal,
    sleepVal = sleep,
    breaksVal = breaks,
    streakVal = streak
  ) => {
    const updates = {
      water_glasses: waterVal,
      water_goal: waterGoalVal,
      sleep_hours: sleepVal,
      breaks_taken: breaksVal,
      study_streak: streakVal,
      medications: medsList,
      sticky_note: noteText,
      countdown_title: title,
      countdown_date: targetDate,
      countdown_subtitle: subtitle
    };
    await syncWellnessToSupabase(updates);
  };

  // Precision Ticker Interval Loop (Medications alerts every 30s)
  useEffect(() => {
    const checkPrescriptions = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const todayStr = now.toLocaleDateString('en-CA');
      const currentTimeKey = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      medications.forEach(med => {
        const { hour, minute } = parseTimeSlot(med.time);
        if (hour === currentHour && minute === currentMinute) {
          const triggerKey = `${med.id}-${todayStr}-${currentTimeKey}`;
          if (!lastTriggeredMeds[med.id] || lastTriggeredMeds[med.id] !== triggerKey) {
            sendNativeNotification("ROOH Care Matrix 🌸", "ei jaan oshud ta kheye neo");
            setLastTriggeredMeds(prev => ({ ...prev, [med.id]: triggerKey }));
          }
        }
      });
    };

    checkPrescriptions();
    const interval = setInterval(checkPrescriptions, 30000);
    return () => clearInterval(interval);
  }, [medications, lastTriggeredMeds]);

  // Fetch and Subscribe to wellness and task databases on mount
  useEffect(() => {
    if (!userId) return;

    const todayStr = new Date().toLocaleDateString('en-CA');

    const fetchInitialData = async () => {
      try {
        setSyncStatus('syncing');
        
        let { data: wellnessData, error: wellnessErr } = await supabase
          .from('wellness_tracker')
          .select('*')
          .eq('user_id', userId)
          .eq('log_date', todayStr)
          .maybeSingle();
        
        if (wellnessErr || !wellnessData) {
          const defaultRow = {
            user_id: userId,
            log_date: todayStr,
            water_glasses: water,
            water_goal: waterGoal,
            sleep_hours: sleep,
            breaks_taken: breaks,
            study_streak: streak,
            steps: 4000
          };
          const { data: upsertData, error: upsertErr } = await supabase
            .from('wellness_tracker')
            .upsert(defaultRow, { onConflict: 'user_id,log_date' })
            .select()
            .maybeSingle();
          
          if (!upsertErr && upsertData) {
            wellnessData = upsertData;
          } else {
            wellnessData = defaultRow;
          }
        }
        
        if (wellnessData) {
          setDbColumns(Object.keys(wellnessData));
          setWater(wellnessData.water_glasses ?? 0);
          setWaterGoal(wellnessData.water_goal ?? 8);
          setSleep(Number(wellnessData.sleep_hours ?? 0));
          setBreaks(wellnessData.breaks_taken ?? 0);
          setStreak(wellnessData.study_streak ?? 12);
          
          // Hydrate Medications list from cloud if present
          if (wellnessData.medications) {
            let meds = wellnessData.medications;
            if (typeof meds === 'string') {
              try { meds = JSON.parse(meds); } catch (e) {}
            }
            if (Array.isArray(meds) && meds.length > 0) {
              setMedications(meds);
              localStorage.setItem('rooh_medications', JSON.stringify(meds));
            }
          }

          // Hydrate sticky note from cloud if present
          if (wellnessData.sticky_note !== undefined) {
            setStickyNote(wellnessData.sticky_note || '');
            localStorage.setItem('local_sticky_note', wellnessData.sticky_note || '');
          }

          // Hydrate countdown configurations from cloud if present
          if (wellnessData.countdown_title !== undefined) {
            setCountdownTitle(wellnessData.countdown_title || "Anatomy Final Exam");
            setEditCountdownTitle(wellnessData.countdown_title || "Anatomy Final Exam");
          }
          if (wellnessData.countdown_date) {
            setCountdownDate(wellnessData.countdown_date);
            setEditCountdownDate(toLocalDatetimeString(wellnessData.countdown_date));
          }
          if (wellnessData.countdown_subtitle !== undefined) {
            setCountdownSubtitle(wellnessData.countdown_subtitle || "Gross Anatomy & Embryology Review");
            setEditCountdownSubtitle(wellnessData.countdown_subtitle || "Gross Anatomy & Embryology Review");
          }
        }

        // Fetch planner tasks from Supabase
        const { data: dbTasks, error: tasksErr } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (!tasksErr && dbTasks) {
          setTasks(dbTasks);
          localStorage.setItem('rooh_study_tasks', JSON.stringify(dbTasks));
        }

        setSyncStatus('synced');
      } catch (err) {
        setSyncStatus('offline');
      }
    };

    fetchInitialData();

    // Aggressive Realtime database subscriptions
    const wellnessChannel = supabase
      .channel('live-wellness-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wellness_tracker' }, (payload) => {
        setSyncStatus('syncing');
        if (payload.new) {
          const data = payload.new as any;
          setWater(data.water_glasses ?? 0);
          setWaterGoal(data.water_goal ?? 8);
          setSleep(Number(data.sleep_hours ?? 0));
          setBreaks(data.breaks_taken ?? 0);
          setStreak(data.study_streak ?? 12);
          
          if (data.medications) {
            let meds = data.medications;
            if (typeof meds === 'string') {
              try { meds = JSON.parse(meds); } catch (e) {}
            }
            if (Array.isArray(meds)) {
              setMedications(meds);
            }
          }
          if (data.sticky_note !== undefined) {
            setStickyNote(data.sticky_note || '');
          }
        }
        setSyncStatus('synced');
      })
      .subscribe();

    const tasksChannel = supabase.channel(`realtime-tasks:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${userId}`
      }, () => {
        const refetchTasks = async () => {
          const { data } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
          if (data) {
            setTasks(data);
            localStorage.setItem('rooh_study_tasks', JSON.stringify(data));
          }
        };
        refetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(wellnessChannel);
      supabase.removeChannel(tasksChannel);
    };
  }, [userId]);

  // 15. Optimistic DB Mutations
  const updateWellnessMetric = async (
    field: 'water_glasses' | 'sleep_hours' | 'breaks_taken' | 'study_streak' | 'water_goal', 
    amount: number
  ) => {
    let finalWater = water;
    let finalWaterGoal = waterGoal;
    let finalSleep = sleep;
    let finalBreaks = breaks;
    let finalStreak = streak;

    if (field === 'water_glasses') {
      finalWater = Math.max(0, water + amount);
      setWater(finalWater);
      if (finalWater >= waterGoal && water < waterGoal) {
        triggerCelebration("Hydrated and healthy—proud of you, Ruhi! 🥛🤍");
      }
    } else if (field === 'water_goal') {
      finalWaterGoal = Math.max(1, amount);
      setWaterGoal(finalWaterGoal);
    } else if (field === 'sleep_hours') {
      finalSleep = Math.max(0, sleep + amount);
      setSleep(finalSleep);
    } else if (field === 'breaks_taken') {
      finalBreaks = Math.max(0, breaks + amount);
      setBreaks(finalBreaks);
    } else if (field === 'study_streak') {
      finalStreak = Math.max(0, streak + amount);
      setStreak(finalStreak);
    }

    await syncAllData(
      medications,
      stickyNote,
      countdownTitle,
      countdownDate,
      countdownSubtitle,
      finalWater,
      finalWaterGoal,
      finalSleep,
      finalBreaks,
      finalStreak
    );
  };

  // Sticky Pad Auto-saving with debounced cloud replication
  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('local_sticky_note', stickyNote);
        syncAllData(medications, stickyNote);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [stickyNote]);

  // Time-Aware Greeting Lifecycle Loop (10s checks to instantly sync night mode swaps)
  const [greeting, setGreeting] = useState("Hello, Ruhi 🌸");

  useEffect(() => {
    const getGreetingText = (hour: number) => {
      if (hour >= 22 || hour < 5) {
        return Math.random() > 0.5 
          ? "Burning the midnight oil again, future doctor? 🌙" 
          : "Another late-night study session? I'm rooting for you.";
      }
      if (hour >= 5 && hour < 12) return "Good Morning, Ruhi 🌅";
      if (hour >= 12 && hour < 17) return "Good Afternoon, Ruhi ☀️";
      if (hour >= 17 && hour < 22) return "Good Evening, Ruhi 🌙";
      return "Good Night, Ruhi 🌌";
    };

    const updateGreeting = () => {
      const hour = new Date().getHours();
      setGreeting(getGreetingText(hour));
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 10000);
    return () => clearInterval(interval);
  }, []);

  // Theme variable configurations based on active clock hour
  const canvasBgClass = isMoonMode ? 'bg-[#0D3B66]' : 'bg-[#FFFDF7]';
  const textColorClass = isMoonMode ? 'text-[#FFFDF7]' : 'text-[#0D3B66]';
  const subTextColorClass = isMoonMode ? 'text-[#FFFDF7]/70' : 'text-[#0D3B66]/65';
  
  const cardClass = isMoonMode 
    ? "bg-white/10 backdrop-blur-md border border-white/20 text-[#FFFDF7] shadow-lg transition-all duration-500 rounded-3xl p-6" 
    : "bg-white/80 backdrop-blur-md border border-[#0D3B66]/5 text-[#0D3B66] shadow-sm hover:shadow-md transition-all duration-500 rounded-3xl p-6";

  const inputClass = isMoonMode
    ? "bg-white/10 border-white/20 text-[#FFFDF7] placeholder-white/40 focus:ring-1 focus:ring-white/30"
    : "bg-white border-gray-200 text-[#0D3B66] placeholder-gray-400/85 focus:ring-1 focus:ring-[#0D3B66]/30";

  // Bad Day Protocol dynamic mapping payload calculations
  let badDayMainMessage = "It's okay. Today doesn't have to be productive. You don't have to carry everything today.";
  let badDayActionPrompt = null;

  if (activeMoodState === 'Sad') {
    badDayMainMessage = "It's okay to cry, doctor. Your emotions are valid, and you don't have to be strong every single second.";
    badDayActionPrompt = (
      <div className="mt-6 p-4 rounded-2xl bg-[#CFC8FF]/20 border border-[#CFC8FF]/30 flex flex-col sm:flex-row justify-between items-center gap-3">
        <span className="text-xs font-bold opacity-80 font-serif">Comfort Tip: Play Tasbir's 3 AM Voice Letter.</span>
        <button
          onClick={() => playAudioLetter('/audio/lonely_comfort.mp3', 'lonely')}
          className="px-4 py-1.5 bg-[#0D3B66] text-white hover:bg-[#0c2e50] text-xs font-bold rounded-xl transition-all cursor-pointer font-sans"
        >
          🔊 Play Voice Note
        </button>
      </div>
    );
  } else if (activeMoodState === 'Stressed') {
    badDayMainMessage = "Take a deep breath. Your exams and textbooks do not define your worth. Let's just focus on the very next step together.";
    badDayActionPrompt = (
      <div className="mt-6 p-4 rounded-2xl bg-[#CCFFBC]/20 border border-[#CCFFBC]/30 flex flex-col sm:flex-row justify-between items-center gap-3">
        <span className="text-xs font-bold opacity-80 font-serif">Breathing Guide: Launch the automated 4-4-4 Box Breathing visual guide.</span>
        <button
          onClick={() => setForceComfortOpen(true)}
          className="px-4 py-1.5 bg-[#0D3B66] text-white hover:bg-[#0c2e50] text-xs font-bold rounded-xl transition-all cursor-pointer font-sans"
        >
          🌬️ Start Box Breathing
        </button>
      </div>
    );
  } else if (activeMoodState === 'Lonely') {
    badDayMainMessage = "Close your eyes for a second. Distance means nothing because my heart is right there beating next to yours. You are never alone.";
    badDayActionPrompt = (
      <div className="mt-6 p-4 rounded-2xl bg-[#CFC8FF]/20 border border-[#CFC8FF]/30 flex flex-col sm:flex-row justify-between items-center gap-3">
        <span className="text-xs font-bold opacity-80 font-serif">Surprise: Open a rare dynamic surprise note from Tasbir.</span>
        <button
          onClick={triggerSurpriseNote}
          className="px-4 py-1.5 bg-[#0D3B66] text-white hover:bg-[#0c2e50] text-xs font-bold rounded-xl transition-all cursor-pointer font-sans"
        >
          💌 Open Surprise Note
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${canvasBgClass} ${textColorClass} font-sans pb-24 relative overflow-x-hidden selection:bg-[#CFC8FF] flex flex-col transition-colors duration-500`}>
      
      {/* Floating stars background overlay for Moon Mode shift */}
      {isMoonMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 90 + 5}%`,
              }}
              animate={{
                opacity: [0.2, 0.9, 0.2],
                scale: [0.8, 1.2, 0.8],
                y: [0, badDayProtocolActive ? -5 : -15, 0] // Slower movement during recovery
              }}
              transition={{
                duration: badDayProtocolActive ? (Math.random() * 6 + 6) : (Math.random() * 4 + 4),
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>
      )}

      {/* Dynamic Confetti viewport stream overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {confetti.map(p => (
            <motion.div
              key={p.id}
              initial={{ y: '105vh', x: `${p.x}vw`, scale: Math.random() * 0.6 + 0.4, opacity: 1, rotate: 0 }}
              animate={{ y: '-10vh', rotate: Math.random() * 360 + 360 }}
              exit={{ opacity: 0 }}
              transition={{ duration: badDayProtocolActive ? 6.0 : (Math.random() * 2.5 + 2), ease: "easeOut" }}
              className="absolute w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: p.color }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Dynamic Celebration Affirmation Overlay Card */}
      <AnimatePresence>
        {celebrationMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0D3B66]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setCelebrationMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-[#FFFDF7] border-2 border-[#CFC8FF] rounded-3xl p-8 max-w-md w-full text-center shadow-xl relative text-[#0D3B66]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer font-sans text-sm font-bold" onClick={() => setCelebrationMessage(null)}>
                ✕
              </div>
              <div className="w-16 h-16 bg-[#CCFFBC]/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-[#0D3B66]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#0D3B66] mb-3">Milestone Completed! 🌸</h3>
              <p className="font-serif text-lg italic text-[#0D3B66]/90 leading-relaxed">
                "{celebrationMessage}"
              </p>
              <button
                onClick={() => setCelebrationMessage(null)}
                className="mt-6 px-6 py-2.5 bg-[#0D3B66] text-white hover:bg-[#0c2e50] rounded-xl font-sans text-sm font-bold shadow-sm transition-all"
              >
                Thank you, Tasbir! 🤍
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Surprise Notes Pop-up Card */}
      <AnimatePresence>
        {activeSurpriseNote && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-8 left-8 z-40 max-w-sm w-full bg-white/95 backdrop-blur-md border-2 border-[#CFC8FF] rounded-3xl p-5 shadow-xl flex flex-col justify-between text-[#0D3B66]"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-purple-600 bg-purple-100 px-2.5 py-0.5 rounded-full font-sans">
                Surprise Note 💌
              </span>
              <button 
                onClick={() => setActiveSurpriseNote(null)}
                className="text-gray-400 hover:text-gray-600 font-sans text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <p className="font-serif text-base text-[#0D3B66] italic leading-relaxed mb-4">
              "{activeSurpriseNote}"
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setActiveSurpriseNote(null)}
                className="px-4 py-1.5 bg-[#0D3B66] text-white hover:bg-[#0c2e50] rounded-xl font-sans text-xs font-bold transition-all"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Notes Micro-Toast */}
      <AnimatePresence>
        {activeEggToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md border-2 border-[#CFC8FF] rounded-2xl py-3 px-6 shadow-xl flex items-center justify-between gap-3 max-w-sm w-full text-[#0D3B66]"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">✨</span>
              <p className="font-serif text-sm text-[#0D3B66] italic leading-relaxed">
                "{activeEggToast.content}"
              </p>
            </div>
            <button 
              onClick={() => setActiveEggToast(null)}
              className="text-gray-400 hover:text-gray-600 font-sans text-xs font-bold shrink-0 ml-2"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bad Day Protocol Initial Modal Prompt */}
      <AnimatePresence>
        {showBadDayModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FFFDF7] border-2 border-[#CFC8FF] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative text-[#0D3B66]"
            >
              <h3 className="font-serif text-2xl font-bold text-[#0D3B66] mb-4">Is today a bad day? 🌧️</h3>
              <p className="font-sans text-sm text-[#0D3B66]/80 mb-6 leading-relaxed">
                It's okay to feel overwhelmed. Let me adjust ROOH to help you recover.
              </p>
              <div className="flex gap-4 font-sans">
                <button
                  onClick={() => {
                    setTimerActive(false); // Force stop academic study timer
                    localStorage.setItem('rooh_study_timer_active', 'false');
                    setBadDayProtocolActive(true);
                    localStorage.setItem('rooh_bad_day_protocol_active', 'true');
                    setShowBadDayModal(false);
                  }}
                  className="flex-1 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl transition-all"
                >
                  YES 🌧️
                </button>
                <button
                  onClick={() => {
                    setShowBadDayModal(false);
                  }}
                  className="flex-1 py-3 bg-[#CCFFBC] hover:bg-[#b0eaa5] text-[#0D3B66] font-bold rounded-xl transition-all"
                >
                  NO 🌸
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* "Why ROOH Exists" Full-Screen Modal Journey */}
      <AnimatePresence>
        {isWhyRoohOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#FFFDF7] z-50 overflow-y-auto flex items-center justify-center p-6 sm:p-12 md:p-24 text-[#0D3B66]"
          >
            {/* Minimalist close button */}
            <button
              onClick={() => setIsWhyRoohOpen(false)}
              className="absolute top-8 right-8 text-[#0D3B66] hover:scale-110 transition-transform font-sans text-sm font-bold flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full border border-[#0D3B66]/10 shadow-sm"
            >
              ✕ Close
            </button>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="max-w-2xl w-full text-center space-y-8 py-12"
            >
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wide text-[#0D3B66] mb-8">
                Why ROOH Exists
              </h2>
              
              <div className="font-serif text-lg sm:text-xl md:text-2xl text-[#0D3B66] leading-loose space-y-6 max-h-[70vh] overflow-y-auto px-4 selection:bg-[#CFC8FF] text-center">
                <p>Dear Ruhi,</p>
                <p>I know there are days when your books feel heavier than usual.</p>
                <p>Days when you're overwhelmed, exhausted, or quietly hurting.</p>
                <p>I know I can't always sit beside you during every late-night study session or every difficult exam.</p>
                <p>So I built ROOH.</p>
                <p>A place that reminds you to rest when you're tired.</p>
                <p>A place that reminds you to keep going when you want to quit.</p>
                <p>A place that reminds you that you are loved, even on the days you forget it yourself.</p>
                <p>ROOH was never meant to be just a website.</p>
                <p>It was meant to be a piece of my heart that stays with you when I cannot.</p>
                <p className="pt-6 font-bold">— Tasbir 🤍</p>
              </div>

              <button
                onClick={() => setIsWhyRoohOpen(false)}
                className="mt-8 px-8 py-3 bg-[#0D3B66] text-white hover:bg-[#0c2e50] rounded-full font-sans text-sm font-bold transition-all shadow-md hover:shadow-lg"
              >
                Back to Sanctuary 🌸
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#CFC8FF]/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] bg-[#CCFFBC]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Scrollable Layout Container */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex-grow w-full font-sans relative z-10">
        
        {/* Header / Logo / Database Sync Indicator */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-12">
          <div className="flex items-center gap-2">
            <span className="font-serif text-3xl font-black tracking-wide">ROOH</span>
            <div className="w-2 h-2 rounded-full bg-[#CCFFBC]" />
            
            {/* Supabase Sync status tracker */}
            <div className="flex items-center gap-1.5 ml-4 bg-white/75 backdrop-blur-md px-3 py-1 rounded-full border border-gray-200 text-xs font-semibold text-[#0D3B66]">
              {syncStatus === 'synced' && (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span className="text-emerald-700 font-sans">Sync Configured</span>
                </>
              )}
              {syncStatus === 'syncing' && (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span className="text-amber-600 font-sans">Syncing...</span>
                </>
              )}
              {syncStatus === 'offline' && (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-500 font-sans">Offline Sandbox</span>
                </>
              )}
            </div>

            {/* Persistent Secret Finder Achievement Badge */}
            {discoveredEggs.length >= 10 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="ml-3 bg-[#CCFFBC] text-[#0D3B66] border border-[#CCFFBC]/45 rounded-full px-3 py-1 text-xs font-sans font-black tracking-wider flex items-center gap-1 shadow-sm"
              >
                Secret Finder 🏆
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center gap-3 self-start sm:self-center">
            {/* "Why ROOH Exists" Trigger element */}
            <button
              onClick={() => setIsWhyRoohOpen(true)}
              className="flex items-center gap-2 bg-white/60 hover:bg-white/95 px-4 py-2 rounded-full border border-gray-200 shadow-sm text-xs font-bold transition-all text-[#0D3B66] font-sans"
            >
              Why ROOH Exists 🌙
            </button>

            {/* Notification Request Perms button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && 'Notification' in window) {
                  Notification.requestPermission().then((permission) => {
                    setHasPushPermission(permission === 'granted');
                    alert(permission === 'granted' ? "Notifications enabled! 🌸" : "Notification permission denied.");
                  });
                } else {
                  alert("Notifications are not supported on this browser.");
                }
              }}
              className="flex items-center gap-2 bg-white/60 hover:bg-white/95 px-4 py-2 rounded-full border border-gray-200 shadow-sm text-xs font-bold transition-all text-[#0D3B66] font-sans"
            >
              <Bell className={`w-3.5 h-3.5 ${hasPushPermission ? 'text-emerald-600 fill-emerald-600' : 'text-gray-400'}`} />
              {hasPushPermission ? "Push Notifications Active" : "Allow Push Alerts"}
            </button>

            {/* Flame Streak pill */}
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 shadow-sm text-[#0D3B66]">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              </motion.span>
              <span className="font-sans font-bold text-xs">
                {streak} Days Streak
              </span>
            </div>
          </div>
        </header>

        {/* Time-Aware Greeting & Affirmation (Module 1 & 11) */}
        <div className="mb-12">
          <motion.h1 
            key={greeting}
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
          >
            {greeting}
          </motion.h1>
          
          {/* Affirmation Card (Rotated date-seeded content) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${
              isMoonMode ? 'bg-[#CFC8FF]/15 border-[#CFC8FF]' : 'bg-[#CFC8FF]/30 border-[#CFC8FF]'
            } border-l-4 rounded-r-2xl p-5 flex justify-between items-center gap-4 cursor-pointer hover:opacity-95 transition-all duration-300`}
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 shrink-0 mt-1" />
              <p className="font-serif text-lg md:text-xl font-medium">
                "{dailyData.affirmation}"
              </p>
            </div>
            <span className="text-xs uppercase font-bold tracking-wider opacity-50 shrink-0 font-sans">
              Rotates Daily 🌸
            </span>
          </motion.div>
        </div>

        {/* Clean Reverted 2-Column Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN: Transform dynamically if Bad Day Protocol is Active */}
          {badDayProtocolActive ? (
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#CFC8FF]/15 border-2 border-[#CFC8FF]/40 rounded-3xl p-8 text-center relative overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <HiddenEgg id="egg-4" icon="🌸" content="You bloom beautifully in your own time, future doctor. 🌸" />
                </div>

                <h2 className="font-serif text-2xl md:text-3xl font-extrabold mb-4 leading-normal">
                  {badDayMainMessage}
                </h2>

                {/* Dynamic 3-Tier Mood Condition Payload Actions */}
                {badDayActionPrompt}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch pt-6 border-t border-[#CFC8FF]/20 mt-6">
                  {/* Left side: Random comforting note history cycling (BADGE CONTRAST PATCHED) */}
                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-left flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#0D3B66] bg-[#CFC8FF] px-2.5 py-0.5 rounded-full font-sans">
                        Tasbir's Comfort Log 🤍
                      </span>
                      <p className="font-serif text-base italic leading-relaxed mt-4">
                        "{currentBadDayComfortNote}"
                      </p>
                    </div>
                    <button
                      onClick={cycleBadDayComfortNote}
                      className="mt-4 text-[10px] font-bold text-purple-350 hover:underline flex items-center gap-1 font-sans cursor-pointer self-start"
                    >
                      🔄 Cycle Another Comfort Note
                    </button>
                  </div>
                  
                  {/* Right side: Emergency Water check (BADGE CONTRAST PATCHED) */}
                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center flex flex-col items-center justify-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#0D3B66] bg-[#CCFFBC] px-2.5 py-0.5 rounded-full font-sans">
                      Self-Care Check 💧
                    </span>
                    <p className="font-serif text-lg font-semibold mt-4 mb-3">
                      Have a glass of water first. 💧
                    </p>
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-xl font-black font-sans">{water} Glasses Logged Today</span>
                      <button
                        onClick={() => updateWellnessMetric('water_glasses', 1)}
                        className="px-4 py-1.5 bg-[#CCFFBC] hover:bg-[#b5ebaa] text-[#0D3B66] font-sans text-xs font-bold rounded-lg transition-colors shadow-sm"
                      >
                        + Log 1 Glass
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dominant Pulsating "I Need Comfort" button */}
                <div className="flex flex-col items-center justify-center mt-10">
                  <motion.button
                    onClick={() => {
                      setForceComfortOpen(true);
                      playAudioLetter('/audio/lonely_comfort.mp3', 'lonely');
                    }}
                    animate={{
                      scale: [1, 1.04, 1],
                      boxShadow: [
                        "0 0 0 0px rgba(207, 200, 255, 0.4)",
                        "0 0 0 20px rgba(207, 200, 255, 0)",
                        "0 0 0 0px rgba(207, 200, 255, 0.4)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="px-8 py-5 rounded-full bg-[#CFC8FF] text-[#0D3B66] font-serif text-xl font-bold border-2 border-[#0D3B66]/10 shadow-lg cursor-pointer"
                  >
                    ❤️ I Need Comfort ❤️
                  </motion.button>
                  <p className="text-[10px] uppercase tracking-wider opacity-60 mt-3 font-sans font-bold">
                    Clicking triggers a breathing session + Tasbir's 3AM Voice Letter
                  </p>
                </div>
                
                {/* Option wrapper: Ready to continue? */}
                <div className="mt-10 pt-6 border-t border-[#CFC8FF]/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <span className="text-xs font-bold font-sans">Ready to continue studies? 🌸</span>
                  <div className="flex gap-3 w-full sm:w-auto font-sans">
                    <button
                      onClick={() => {
                        setBadDayProtocolActive(false);
                        localStorage.setItem('rooh_bad_day_protocol_active', 'false');
                      }}
                      className="flex-1 sm:flex-initial px-6 py-2 bg-[#CCFFBC] hover:bg-[#b0eaa5] text-[#0D3B66] text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Back To Studies
                    </button>
                    <button
                      onClick={() => {
                        triggerSurpriseNote();
                      }}
                      className="flex-1 sm:flex-initial px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Stay In Comfort
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="lg:col-span-2 space-y-8">
              
              {/* STUDY TIMER & TIMELINES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Study Session Active Precision Countdown Card (Module 1 & 3) */}
                <div className={cardClass}>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-bold">Study Session Today</h3>
                      <HiddenEgg id="egg-1" icon="⭐" content="Found a hidden note. I still believe in you. 🤍" />
                    </div>
                    <Clock className="w-4 h-4 opacity-60 animate-spin-slow" />
                  </div>
                  
                  <div className="flex flex-col items-center justify-center py-1">
                    <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                      {/* Ring background - Active countdown tracks (Mint accent) */}
                      <svg className="absolute w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="54" stroke={isMoonMode ? "#3A5A78" : "#F3F4F6"} strokeWidth="8" fill="transparent" />
                        <circle cx="64" cy="64" r="54" stroke="#CCFFBC" strokeWidth="8" fill="transparent" 
                           strokeDasharray={2 * Math.PI * 54} 
                           strokeDashoffset={2 * Math.PI * 54 * (secondsRemaining / (studyHoursGoal * 3600))} 
                           strokeLinecap="round"
                           className="transition-all duration-300"
                        />
                      </svg>
                      <div className="text-center z-10 font-sans">
                        <span className="text-2xl font-black tabular-nums tracking-tight font-sans">
                          {formatTimerString()}
                        </span>
                        <p className="text-[10px] opacity-60 font-bold">Goal: {studyHoursGoal}h</p>
                      </div>
                    </div>

                    {/* Timer Controls */}
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={handleToggleTimer}
                        className={`p-2 rounded-full transition-colors ${timerActive ? 'bg-amber-100 hover:bg-amber-200 text-amber-700' : 'bg-[#CCFFBC] hover:bg-[#b0eaa5] text-[#0D3B66]'}`}
                      >
                        {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={handleResetTimer}
                        className="p-2 bg-gray-100/15 hover:bg-gray-200/30 rounded-full transition-colors text-inherit border border-gray-200/10"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Goal Adjustment */}
                    <div className="flex items-center gap-3 mt-1.5 pt-2 border-t border-gray-100/10 w-full justify-center">
                      <button 
                        onClick={() => adjustStudyGoal(-1)}
                        className="p-1.5 bg-gray-50/10 hover:bg-gray-100/20 rounded-lg transition-colors border border-gray-200/10 text-inherit"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold">Adjust Hours</span>
                      <button 
                        onClick={() => adjustStudyGoal(1)}
                        className="p-1.5 bg-gray-50/10 hover:bg-gray-100/20 rounded-lg transition-colors border border-gray-200/10 text-inherit"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dynamic Milestone & Countdown Configurator */}
                <div className="relative group flex flex-col gap-2">
                  <CountdownCard 
                    title={countdownTitle} 
                    targetDate={countdownDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 2.8).toISOString()}
                    subtitle={countdownSubtitle}
                  />
                  
                  {/* Settings Toggle Link/Icon at the bottom of the card block */}
                  <div className="flex justify-between items-center px-2">
                    <HiddenEgg id="egg-2" icon="🌙" content="You're doing better than you think." />
                    <button
                      type="button"
                      onClick={() => setIsConfiguringCountdown(!isConfiguringCountdown)}
                      className="text-[10px] uppercase font-bold tracking-wider opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1 font-sans cursor-pointer text-inherit"
                    >
                      ⚙️ Configure Deadline
                    </button>
                  </div>

                  {/* Compact Edit Form expansion */}
                  <AnimatePresence>
                    {isConfiguringCountdown && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`${
                          isMoonMode ? 'bg-white/15 border-white/20 text-[#FFFDF7]' : 'bg-white/95 border-[#0D3B66]/10 text-[#0D3B66]'
                        } border rounded-2xl p-4 space-y-3 font-sans shadow-md`}
                      >
                        <h4 className="font-serif text-sm font-bold">Set Custom Target Event</h4>
                        
                        <div className="space-y-2 text-xs">
                          <div>
                            <label className="block font-bold opacity-60 mb-1">Event/Exam Name</label>
                            <input 
                              type="text" 
                              value={editCountdownTitle}
                              onChange={(e) => setEditCountdownTitle(e.target.value)}
                              placeholder="e.g., Anatomy Final Exam"
                              className={`w-full py-1.5 px-3 rounded-lg border outline-none font-sans ${inputClass}`}
                            />
                          </div>
                          
                          <div>
                            <label className="block font-bold opacity-60 mb-1">Subtitle / Details</label>
                            <input 
                              type="text" 
                              value={editCountdownSubtitle}
                              onChange={(e) => setEditCountdownSubtitle(e.target.value)}
                              placeholder="e.g., Gross Anatomy & Embryology Review"
                              className={`w-full py-1.5 px-3 rounded-lg border outline-none font-sans ${inputClass}`}
                            />
                          </div>

                          <div>
                            <label className="block font-bold opacity-60 mb-1">Target Date & Time</label>
                            <input 
                              type="datetime-local" 
                              value={editCountdownDate}
                              onChange={(e) => setEditCountdownDate(e.target.value)}
                              className={`w-full py-1.5 px-3 rounded-lg border outline-none font-sans ${inputClass}`}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end text-xs font-sans">
                          <button
                            type="button"
                            onClick={() => setIsConfiguringCountdown(false)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#0D3B66] rounded-lg font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              let formattedDate = editCountdownDate;
                              if (editCountdownDate) {
                                formattedDate = new Date(editCountdownDate).toISOString();
                              }
                              handleSaveCountdown(editCountdownTitle, formattedDate, editCountdownSubtitle);
                            }}
                            className="px-3 py-1.5 bg-[#0D3B66] text-white hover:bg-[#0c2e50] rounded-lg font-bold"
                          >
                            Save Deadline
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* STUDY PLANNER (Module 2 CRUD synced in real-time) */}
              <div className={cardClass}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl font-bold">Real-Time Study Planner</h3>
                    <HiddenEgg id="egg-3" icon="🤍" content="If nobody told you today, I'm proud of you." />
                  </div>
                </div>
                <p className="text-xs opacity-60 mb-6">Manage study items. Modifications persist in the database channel.</p>

                {/* Add Task Input Form */}
                <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2.5 mb-6">
                  <input
                    type="text"
                    placeholder="What medical concept will you review today?"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className={`flex-1 text-sm py-2 px-4 rounded-xl border focus:outline-none font-sans ${inputClass}`}
                  />
                  
                  <select
                    value={newTaskSubject}
                    onChange={(e) => setNewTaskSubject(e.target.value as any)}
                    className={`text-xs py-2 px-3 rounded-xl border focus:outline-none font-sans font-bold ${
                      isMoonMode ? 'bg-[#0D3B66] text-white border-white/20' : 'bg-white text-[#0D3B66] border-gray-200'
                    }`}
                  >
                    {['Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology', 'Medicine', 'Surgery'].map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    className="bg-[#0D3B66] text-white hover:bg-[#0c2e50] text-xs font-bold px-5 py-2.5 rounded-xl transition-all font-sans cursor-pointer"
                  >
                    Add Lecture
                  </button>
                </form>

                {/* Real-time Task List */}
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {tasks.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No tasks planned yet. Add one to start sync logs.</p>
                  ) : (
                    <AnimatePresence initial={false}>
                      {tasks.map(task => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`flex items-center justify-between p-3.5 border rounded-xl font-sans ${
                            isMoonMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleToggleTask(task.id, !task.is_completed)}
                              className="text-inherit hover:scale-110 transition-transform"
                            >
                              {task.is_completed ? (
                                <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                              ) : (
                                <Circle className="w-5 h-5 opacity-40" />
                              )}
                            </button>
                            
                            <div>
                              <span className={`text-sm font-semibold ${task.is_completed ? 'line-through opacity-45' : ''}`}>
                                {task.title}
                              </span>
                              <span className="text-[10px] bg-[#CFC8FF]/30 text-[#0D3B66] px-2 py-0.5 rounded ml-2 font-bold uppercase tracking-wider">
                                {task.subject}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1.5 hover:bg-red-50/10 text-red-500 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>

              {/* MOOD CHECK-IN ENGINE (Module 4) */}
              <div className={cardClass}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-serif text-xl font-bold">How are you feeling right now, Ruhi?</h3>
                  <HiddenEgg id="egg-4" icon="🌸" content="You bloom beautifully in your own time, future doctor. 🌸" />
                </div>
                <p className="text-xs opacity-65 mb-6">Select a mood to log your check-in. It will stream live into your database log.</p>
                
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-3 mb-6">
                  {[
                    { name: 'Happy', emoji: '😊' },
                    { name: 'Calm', emoji: '🌸' },
                    { name: 'Tired', emoji: '😴' },
                    { name: 'Stressed', emoji: '😰' },
                    { name: 'Sad', emoji: '😔' },
                    { name: 'Lonely', emoji: '🤍' },
                    { name: 'Motivated', emoji: '✨' }
                  ].map(m => (
                    <button
                      key={m.name}
                      onClick={() => {
                        if (userId) {
                          supabase.from('mood_logs').insert({ user_id: userId, mood: m.name, note: 'Dashboard Log' });
                        }
                        setActiveMoodResponse(MOOD_RESPONSES[m.name] || "We're here for you.");
                        
                        // Dynamic Bad Day protocol trigger setup
                        setActiveMoodState(m.name);
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('rooh_active_mood_state', m.name);
                        }
                        if (['Sad', 'Stressed', 'Lonely'].includes(m.name)) {
                          setShowBadDayModal(true);
                        }
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 hover:scale-105 cursor-pointer ${
                        isMoonMode 
                          ? 'bg-white/5 hover:border-[#CFC8FF] border-white/10' 
                          : 'bg-[#FFFDF7] hover:border-[#CFC8FF] border-gray-150'
                      }`}
                    >
                      <span className="text-2xl mb-1">{m.emoji}</span>
                      <span className="text-xs font-semibold opacity-90">{m.name}</span>
                    </button>
                  ))}
                </div>

                {/* Reactive UI comfort text box */}
                {activeMoodResponse && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#CFC8FF]/20 border border-[#CFC8FF]/50 rounded-2xl p-4 text-sm"
                  >
                    <p className="font-bold mb-1 font-serif">ROOH responds:</p>
                    <p className="italic opacity-90">"{activeMoodResponse}"</p>
                  </motion.div>
                )}
              </div>

              {/* SEEDED DAILY COMFORT CARD RECOMMENDATION (Module 5) */}
              <div className="border-2 border-[#CFC8FF] rounded-3xl p-6 shadow-sm relative overflow-hidden bg-white/5">
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#CCFFBC]/30 rounded-full blur-xl animate-pulse" />
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest bg-[#CFC8FF]/40 px-2.5 py-0.5 rounded-full font-sans">
                    {dailyData.comfortCard.category}
                  </span>
                  <span className="text-[10px] text-purple-400 font-bold">Today's Daily Comfort 🌸</span>
                </div>
                <h4 className="font-serif text-xl font-bold mb-2">{dailyData.comfortCard.title}</h4>
                <p className="text-sm italic leading-relaxed opacity-90 font-serif">{dailyData.comfortCard.content}</p>
              </div>

            </div>
          )}

          {/* RIGHT COLUMN: Self Care, Sounds, Notes, Secure Vault & Prescriptions */}
          <div className="space-y-8">
            
            {/* DOCTOR'S PRESCRIPTION & SCHEDULE (Health Module) */}
            <div className={cardClass}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl font-bold">Doctor's Prescription</h3>
                  <HiddenEgg id="egg-5" icon="⭐" content="Every small step counts. Remember to rest. ⭐" />
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-100 animate-pulse" />
                </div>
                {/* Mobile Notification Safety Override Button */}
                {!hasPushPermission && (
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined' && 'Notification' in window) {
                        Notification.requestPermission().then((permission) => {
                          setHasPushPermission(permission === 'granted');
                          if (permission === 'granted') {
                            sendNativeNotification("ROOH Care Matrix 🌸", "Mobile notification loop activated successfully!");
                          } else {
                            alert("Notification permissions not granted. Please adjust device settings.");
                          }
                        });
                      } else {
                        alert("Web Notifications are not supported on this browser or device.");
                      }
                    }}
                    className="px-3 py-1 bg-[#CFC8FF]/30 hover:bg-[#CFC8FF]/50 text-[10px] font-bold rounded-full transition-all font-sans shrink-0 border border-gray-200/10 text-inherit cursor-pointer"
                  >
                    Enable Mobile Alerts
                  </button>
                )}
              </div>
              <p className="text-xs opacity-65 mb-6">Manage scheduled medications. System matches clock and triggers alerts.</p>

              {/* Add Medication form */}
              <div className="flex flex-col gap-2.5 mb-6">
                <input
                  type="text"
                  placeholder="Medicine Name (e.g. Multivitamin)..."
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className={`w-full text-xs py-2 px-3 rounded-xl border focus:outline-none font-sans ${inputClass}`}
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Time (e.g. 08:00 AM)"
                    value={newMedTime}
                    onChange={(e) => setNewMedTime(e.target.value)}
                    className={`flex-grow text-xs py-2 px-3 rounded-xl border focus:outline-none font-sans ${inputClass}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newMedName.trim() || !newMedTime.trim()) return;
                      const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$|^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
                      if (!timeRegex.test(newMedTime)) {
                        alert("Please use HH:MM AM/PM format (e.g. '08:00 AM' or '10:00 PM')");
                        return;
                      }
                      
                      const newMed = {
                        id: Math.random().toString(36).substr(2, 9),
                        name: newMedName.trim(),
                        time: newMedTime.trim().toUpperCase(),
                        taken: false
                      };
                      const updatedMeds = [...medications, newMed];
                      setMedications(updatedMeds);
                      localStorage.setItem('rooh_medications', JSON.stringify(updatedMeds));
                      syncAllData(updatedMeds);
                      
                      setNewMedName('');
                      setNewMedTime('08:00 AM');
                    }}
                    className="bg-[#0D3B66] text-white hover:bg-[#0c2e50] text-xs font-bold px-4 py-2 rounded-xl transition-all font-sans shrink-0 cursor-pointer"
                  >
                    Add Schedule
                  </button>
                </div>
              </div>

              {/* Medication list */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {medications.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No prescriptions logged yet.</p>
                ) : (
                  medications.map(med => (
                    <div
                      key={med.id}
                      className={`flex items-center justify-between p-3.5 border rounded-xl ${
                        isMoonMode ? 'bg-white/5 border-white/10' : 'bg-[#FFFDF7] border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const updatedMeds = medications.map(m => m.id === med.id ? { ...m, taken: !m.taken } : m);
                            setMedications(updatedMeds);
                            localStorage.setItem('rooh_medications', JSON.stringify(updatedMeds));
                            syncAllData(updatedMeds);

                            if (!med.taken) {
                              triggerCelebration("Oshud khavar jonno proud of you, Doctor! 🌸");
                              if (Math.random() < 0.25) {
                                triggerSurpriseNote();
                              }
                            }
                          }}
                          className="text-inherit hover:scale-110 transition-transform shrink-0"
                        >
                          {med.taken ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-5 h-5 opacity-40" />
                          )}
                        </button>

                        <div>
                          <p className={`text-sm font-semibold font-sans ${med.taken ? 'line-through opacity-45' : ''}`}>
                            {med.name}
                          </p>
                          <p className="text-[10px] text-purple-400 font-bold">
                            {med.time}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const updatedMeds = medications.filter(m => m.id !== med.id);
                          setMedications(updatedMeds);
                          localStorage.setItem('rooh_medications', JSON.stringify(updatedMeds));
                          syncAllData(updatedMeds);
                        }}
                        className="p-1.5 hover:bg-red-50/10 text-red-500 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* WELLNESS & SELF-CARE INTERACTIVE CONTROL MATRIX */}
            <div className={cardClass}>
              <h3 className="font-serif text-xl font-bold mb-6">Wellness & Self-Care</h3>
              
              <div className="space-y-6">
                
                {/* 1. Hydration Module (Lavender Animated Fluid Wave Component) */}
                <div>
                  <div className="flex justify-between items-center text-sm font-semibold mb-3">
                    <span className="flex items-center gap-2"><Waves className="w-4 h-4 text-sky-500" /> Hydration</span>
                    <div className="flex items-center gap-1 font-sans">
                      <span className="text-xs">Goal:</span>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={waterGoal}
                        onChange={(e) => handleWaterGoalChange(parseInt(e.target.value, 10))}
                        className={`w-10 text-center py-0.5 rounded font-sans font-bold text-xs focus:outline-none outline-none ${
                          isMoonMode ? 'bg-white/10 text-white' : 'bg-gray-50 text-[#0D3B66]'
                        }`}
                      />
                      <span className="text-xs font-bold">Glasses</span>
                    </div>
                  </div>

                  {/* Rising Tide Wave Animation Container */}
                  <motion.div 
                    animate={water >= waterGoal ? { scale: [1, 1.02, 1], borderColor: '#CCFFBC' } : { scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-32 bg-gray-150/10 border border-gray-200/20 rounded-2xl overflow-hidden flex flex-col justify-end shadow-inner mb-3"
                  >
                    {/* Water tide fill */}
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-[#CFC8FF] rounded-t-xl origin-bottom"
                      initial={{ height: "0%" }}
                      animate={{ height: `${Math.min(100, (water / waterGoal) * 100)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      {/* Wave surface animated line */}
                      <motion.div 
                        animate={{ y: [0, -3, 0], x: [0, 2, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="absolute top-0 left-0 right-0 h-3 bg-white/20 blur-[1px] rounded-t-full"
                      />
                    </motion.div>

                    {/* Success confirmatory visual flash */}
                    {water >= waterGoal && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ duration: 1, repeat: 1 }}
                        className="absolute inset-0 bg-[#CCFFBC]"
                      />
                    )}

                    {/* Stats overlays */}
                    <div className="z-10 p-4 w-full flex justify-between items-end font-sans text-[#0D3B66]">
                      <div className="flex flex-col text-left">
                        <span className="text-2xl font-black">{water} Glasses</span>
                      </div>
                      {water >= waterGoal && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-[#CCFFBC] border border-emerald-355 px-2 py-0.5 rounded-full">
                          Achieved! 🌸
                        </span>
                      )}
                    </div>
                  </motion.div>

                  <div className="flex justify-end gap-2 font-sans">
                    <button 
                      onClick={() => updateWellnessMetric('water_glasses', -1)}
                      className="px-3 py-1 text-xs bg-gray-150/10 hover:bg-gray-150/20 rounded-lg font-bold transition-colors"
                    >
                      -1 Glass
                    </button>
                    <button 
                      onClick={() => updateWellnessMetric('water_glasses', 1)}
                      className="px-3 py-1 text-xs bg-[#CFC8FF]/30 hover:bg-[#CFC8FF]/50 rounded-lg font-bold transition-colors"
                    >
                      +1 Glass
                    </button>
                  </div>
                </div>

                {/* 2. Sleep Tracker Module (Mint Accent Progress) */}
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-emerald-500" /> Sleep Log
                      <HiddenEgg id="egg-6" icon="🌙" content="Sleep is a holy form of recovery. Sleep well. 🌙" />
                    </span>
                    <span>{sleep}h Logged</span>
                  </div>
                  <div className="w-full bg-gray-100/10 h-2.5 rounded-full overflow-hidden mb-2">
                    <div 
                      className="bg-[#CCFFBC] h-full rounded-full transition-all duration-300 animate-pulse-slow" 
                      style={{ width: `${Math.min(100, (sleep / 9) * 100)}%` }} 
                      title={`${sleep} logged sleep hours`}
                    />
                  </div>
                  <div className="flex justify-end gap-2 font-sans">
                    <button 
                      onClick={() => updateWellnessMetric('sleep_hours', -0.5)}
                      className="px-2.5 py-0.5 text-xs bg-gray-100/10 hover:bg-gray-100/20 rounded font-bold"
                    >
                      -0.5h
                    </button>
                    <button 
                      onClick={() => updateWellnessMetric('sleep_hours', 0.5)}
                      className="px-2.5 py-0.5 text-xs bg-[#CCFFBC]/40 hover:bg-[#CCFFBC]/60 rounded font-bold"
                    >
                      +0.5h
                    </button>
                  </div>
                </div>

                {/* 3. Rest Breaks Module (Lavender Progress) */}
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-500" /> Rest Breaks
                      <HiddenEgg id="egg-7" icon="🤍" content="Breaks are productive too. Be kind to your mind. 🤍" />
                    </span>
                    <span>{breaks} Breaks Taken</span>
                  </div>
                  <div className="w-full bg-gray-100/10 h-2.5 rounded-full overflow-hidden mb-2">
                    <div 
                      className="bg-[#CFC8FF] h-full rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(100, (breaks / 5) * 100)}%` }} 
                      title={`${breaks} breaks taken`}
                    />
                  </div>
                  <div className="flex justify-end gap-2 font-sans">
                    <button 
                      onClick={() => updateWellnessMetric('breaks_taken', -1)}
                      className="px-2.5 py-0.5 text-xs bg-gray-100/10 hover:bg-gray-100/20 rounded font-bold"
                      disabled={breaks <= 0}
                    >
                      -1 Break
                    </button>
                    <button 
                      onClick={() => updateWellnessMetric('breaks_taken', 1)}
                      className="px-2.5 py-0.5 text-xs bg-[#CCFFBC] hover:bg-[#b5ebaa] rounded font-bold text-[#0D3B66] shadow-sm cursor-pointer"
                    >
                      Log Break 🌸
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK NOTE-TAKING STICKY PAD (Feature 2) */}
            <div className={cardClass}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl font-bold">Sanctuary Notes</h3>
                  <HiddenEgg id="egg-8" icon="🌸" content="Your thoughts are safe here. Keep going. 🌸" />
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                </div>
              </div>
              <p className="text-xs opacity-65 mb-4">Auto-saves clinical tracking details or daily pathology concepts instantly.</p>
              
              <textarea
                value={stickyNote}
                onChange={(e) => setStickyNote(e.target.value)}
                placeholder="Write your study logs, medical targets, or thoughts here, Ruhi..."
                className={`w-full h-32 text-xs p-3.5 rounded-2xl border outline-none font-sans resize-none shadow-inner ${
                  isMoonMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#FFFDF7] border-gray-200 text-[#0D3B66]'
                }`}
              />
              <div className="flex justify-between items-center mt-2 text-[10px] opacity-50 font-bold font-sans">
                <span>{stickyNote.length} characters</span>
                <span className="text-[#CCFFBC] bg-[#0D3B66] px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-sans font-black">
                  Auto-saved
                </span>
              </div>
            </div>

            {/* TASBIR'S AUDIO VAULT (Feature 1) */}
            <div className={cardClass}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl font-bold">Tasbir's Audio Vault</h3>
                  <HiddenEgg id="egg-9" icon="⭐" content="Listen to the voices of comfort whenever you need. ⭐" />
                  <Music className="w-4 h-4 text-purple-600 animate-pulse" />
                </div>
              </div>
              <p className="text-xs opacity-65 mb-4">A private collection of comforting voice letters for your medical journey.</p>

              <div className="space-y-3 mb-4">
                {AUDIO_LETTERS.map((item) => {
                  const isSelected = activeAudioLetter === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => playAudioLetter(item.path, item.key)}
                      className={`w-full flex justify-between items-center p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#CFC8FF]/20 border-[#CFC8FF] shadow-sm' 
                          : isMoonMode ? 'bg-white/5 border-white/10 hover:border-[#CFC8FF]/40' : 'bg-[#FFFDF7] border-gray-100 hover:border-[#CFC8FF]/40'
                      }`}
                    >
                      <span className="text-xs font-serif font-semibold pr-2">
                        {item.label}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected && isPlaying ? (
                          <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-5 h-5 rounded-full bg-[#CFC8FF] flex items-center justify-center"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0D3B66]" />
                          </motion.div>
                        ) : (
                          <Lock className="w-3.5 h-3.5 opacity-60 text-purple-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Minimalist Custom Audio Player Interface */}
              <AnimatePresence>
                {activeAudioLetter && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className={`mt-4 p-4 border rounded-2xl shadow-inner space-y-3 ${
                      isMoonMode ? 'bg-white/5 border-white/10' : 'bg-[#FFFDF7] border-[#CFC8FF]/60'
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex justify-between items-center font-sans">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
                        <span className="text-[10px] uppercase tracking-wider font-bold text-purple-400">
                          Now Playing
                        </span>
                      </div>
                      <button 
                        onClick={() => {
                          if (currentAudio) {
                            currentAudio.pause();
                            setIsPlaying(false);
                          }
                          setActiveAudioLetter(null);
                        }}
                        className="text-[10px] opacity-60 hover:opacity-100 font-bold"
                      >
                        Close
                      </button>
                    </div>

                    {/* Active Track Title */}
                    <p className="text-xs font-serif font-medium leading-snug">
                      {AUDIO_LETTERS.find(l => l.key === activeAudioLetter)?.label.replace('🔒 ', '')}
                    </p>

                    {/* Progress Slider (Seek Bar) */}
                    <div className="space-y-1.5 font-sans">
                      <div 
                        onClick={(e) => {
                          if (!currentAudio) return;
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          const width = rect.width;
                          const percentage = clickX / width;
                          const newTime = percentage * (audioDuration || 180);
                          currentAudio.currentTime = newTime;
                          setAudioProgress(newTime);
                        }}
                        className="w-full bg-gray-200/25 h-1.5 rounded-full overflow-hidden cursor-pointer relative"
                      >
                        <motion.div 
                          className="bg-[#CFC8FF] h-full rounded-full"
                          style={{ width: `${(audioProgress / (audioDuration || 180)) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] opacity-75 font-bold">
                        <span>{formatTime(audioProgress)}</span>
                        <span>{formatTime(audioDuration || 180)}</span>
                      </div>
                    </div>

                    {/* Controls & Wave Animation row */}
                    <div className="flex justify-between items-center pt-1">
                      {/* Play/Pause Button */}
                      <button
                        onClick={() => {
                          if (currentAudio) {
                            if (isPlaying) {
                              currentAudio.pause();
                              setIsPlaying(false);
                            } else {
                              currentAudio.play().then(() => {
                                setIsPlaying(true);
                              }).catch(e => {
                                console.warn("Failed to play: ", e);
                                setIsPlaying(true);
                              });
                            }
                          }
                        }}
                        className="p-2 rounded-full bg-[#0D3B66] hover:bg-[#0c2e50] text-[#FFFDF7] transition-all flex items-center justify-center cursor-pointer"
                      >
                        {isPlaying ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current" />
                        )}
                      </button>

                      {/* Rhythmic wave animation */}
                      <div className="flex items-center gap-1 h-5">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((bar) => (
                          <motion.div
                            key={bar}
                            animate={isPlaying ? { scaleY: [0.3, 1.4, 0.3] } : { scaleY: 0.3 }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.7 + (bar % 3) * 0.1,
                              delay: bar * 0.08,
                              ease: "easeInOut"
                            }}
                            className="w-1 bg-[#CFC8FF] h-full origin-center rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CALM CORNER SOUNDBOARD (Module 12) */}
            <div className={cardClass}>
              <h3 className="font-serif text-xl font-bold mb-1">Calm Corner Soundboard</h3>
              <p className="text-xs opacity-60 mb-4">Toggle study ambient soundtracks to craft your study mix.</p>
              
              <div className="space-y-3 font-sans">
                {[
                  { name: 'Rain', label: 'Rain Sounds 🌧️' },
                  { name: 'Lofi', label: 'Lofi Study Music 🎧' },
                  { name: 'Cafe', label: 'Cafe Ambience ☕' }
                ].map(sound => (
                  <button
                    key={sound.name}
                    onClick={() => toggleSound(sound.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      activeSounds[sound.name] 
                        ? 'bg-[#CCFFBC] border-[#CCFFBC] text-[#0D3B66] scale-[1.01] shadow-sm' 
                        : isMoonMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-150 hover:bg-gray-50'
                    }`}
                  >
                    <span>{sound.label}</span>
                    {activeSounds[sound.name] ? (
                      <Volume2 className="w-4 h-4 animate-bounce text-[#0D3B66]" />
                    ) : (
                      <VolumeX className="w-4 h-4 opacity-40" />
                    )}
                  </button>
                ))}
              </div>

              {/* Dynamic Moon Mode ambient check recommendation notice */}
              {isMoonMode && (
                <p className="mt-4 text-xs italic text-[#CCFFBC]/90 font-sans animate-pulse text-left">
                  🌙 Late-night study session active. We highly recommend playing Rain Sounds for maximum comfort.
                </p>
              )}
            </div>

            {/* TASBIR LOCKER VAULT (Module 14) */}
            <div className={cardClass}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl font-bold">Tasbir Corner</h3>
                  <Lock className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <p className="text-xs opacity-65 mb-4">A private safe space with letters from a loved one. Input code key to reveal.</p>

              {!isVaultUnlocked ? (
                <div className="space-y-3 font-sans">
                  <input 
                    type="password"
                    placeholder="Enter Key Code (try 'tasbir')..."
                    value={vaultPassword}
                    onChange={(e) => setVaultPassword(e.target.value)}
                    className={`w-full text-xs py-2 px-3 rounded-xl border outline-none ${inputClass}`}
                  />
                  <button
                    onClick={handleUnlockVault}
                    className="w-full py-2 bg-[#0D3B66] text-white hover:bg-[#0c2e50] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Unlock Locker
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in font-sans">
                  <div className="flex justify-between items-center text-xs text-purple-400 bg-purple-950/20 px-3 py-1.5 rounded-lg border border-purple-500/20">
                    <span>Locker Unlocked</span>
                    <button 
                      onClick={() => { setIsVaultUnlocked(false); setOpenedLetter(null); }}
                      className="underline text-[10px] cursor-pointer"
                    >
                      Lock
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {TASBIR_LETTERS.map((letter, idx) => (
                      <button
                        key={idx}
                        onClick={() => setOpenedLetter(openedLetter === letter.trigger ? null : letter.trigger)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          openedLetter === letter.trigger 
                            ? 'bg-[#CFC8FF]/30 border-[#CFC8FF] text-inherit' 
                            : isMoonMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-100 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{letter.label}</span>
                          <Eye className="w-3.5 h-3.5 opacity-60" />
                        </div>
                        {openedLetter === letter.trigger && (
                          <motion.p 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-2 opacity-90 font-normal leading-relaxed italic border-t border-gray-200/10 pt-2 font-serif"
                          >
                            {letter.content}
                          </motion.p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* VERSION 2 INTERACTIVE WORKSPACE */}
        <div className={`mt-8 border border-dashed rounded-3xl p-6 space-y-6 ${
          isMoonMode ? 'bg-white/5 border-white/20' : 'bg-white/80 border-[#0D3B66]/20'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-serif text-xl font-bold">Version 2 Scale-Up Integrations</h3>
              <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded font-sans">Future Roadmap</span>
            </div>
            <p className="text-xs opacity-60">Ready slots for drug database searches, flashcards, and AI models.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            
            {/* Hook 1: Flashcards */}
            <div className={`border p-5 rounded-2xl ${
              isMoonMode ? 'bg-white/5 border-white/10' : 'bg-[#FFFDF7] border-gray-150'
            }`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold opacity-60 flex items-center gap-1 font-sans">
                  <BookOpen className="w-3.5 h-3.5" /> Medical Flashcards
                </span>
                <span className="text-[10px] opacity-65 font-sans">Card {flashcardIndex + 1}/3</span>
              </div>
              
              <div className={`min-h-[90px] flex flex-col justify-center items-center text-center p-3 rounded-xl border mb-3 shadow-inner ${
                isMoonMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'
              }`}>
                <p className="text-sm font-semibold">
                  {showAnswer ? flashcards[flashcardIndex].answer : flashcards[flashcardIndex].question}
                </p>
              </div>

              <div className="flex gap-2 font-sans">
                <button 
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="flex-1 py-1.5 px-3 bg-gray-150/10 hover:bg-gray-150/20 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {showAnswer ? "Show Question" : "Reveal Answer"}
                </button>
                <button 
                  onClick={() => {
                    setFlashcardIndex(prev => (prev + 1) % flashcards.length);
                    setShowAnswer(false);
                  }}
                  className="py-1.5 px-3 bg-[#CCFFBC] hover:bg-[#b5ebaa] text-[#0D3B66] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Hook 2: Drug Database */}
            <div className={`border p-5 rounded-2xl flex flex-col justify-between ${
              isMoonMode ? 'bg-white/5 border-white/10' : 'bg-[#FFFDF7] border-gray-150'
            }`}>
              <div>
                <span className="text-xs font-bold opacity-60 flex items-center gap-1 mb-3 font-sans">
                  <Search className="w-3.5 h-3.5" /> Drug Database Search
                </span>
                
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Search generic (e.g. Paracetamol)..."
                    value={searchDrug}
                    onChange={(e) => setSearchDrug(e.target.value)}
                    className={`w-full text-xs py-2 pl-8 pr-3 rounded-lg border focus:outline-none font-sans ${inputClass}`}
                  />
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 opacity-40" />
                </div>
              </div>

              {searchDrug ? (
                <div className="p-2 bg-[#CCFFBC]/20 border border-[#CCFFBC]/60 rounded-lg text-[11px]">
                  <span className="font-bold">Drug Hook Active:</span> API trigger for <span className="underline font-semibold">{searchDrug}</span> ready.
                </div>
              ) : (
                <p className="text-[10px] opacity-40 italic">Enter a name above to test endpoint query binding.</p>
              )}
            </div>

          </div>

          {/* Hook 3: AI Companion */}
          <div className={`border p-5 rounded-2xl font-sans ${
            isMoonMode ? 'bg-white/5 border-white/10' : 'bg-[#FFFDF7] border-gray-150'
          }`}>
            <span className="text-xs font-bold opacity-60 flex items-center gap-1 mb-3">
              <MessageSquare className="w-3.5 h-3.5" /> AI Study Assistant & Companion
            </span>

            <div className={`rounded-xl border p-3 h-28 overflow-y-auto mb-3 text-xs space-y-2 shadow-inner ${
              isMoonMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 text-gray-700'
            }`}>
              {aiChatLog.map((chat, idx) => (
                <div key={idx} className={`flex ${chat.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2 rounded-xl max-w-[85%] ${
                    chat.sender === 'User' 
                      ? 'bg-[#CFC8FF]/40 text-[#0D3B66]' 
                      : isMoonMode ? 'bg-white/10 text-white border border-white/10' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {chat.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendAiPrompt} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about renal clearance, ADME, etc..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className={`flex-1 text-xs py-2 px-3 rounded-lg border focus:outline-none font-sans ${inputClass}`}
              />
              <button 
                type="submit"
                className="bg-[#0D3B66] text-white hover:bg-[#092b4d] text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Ask Assistant
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* 4. Permanent Romantic Dedication Footer */}
      <footer className="w-full py-16 mt-auto text-center font-serif relative z-10 px-6 border-t border-gray-250/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-lg md:text-xl leading-relaxed">
            This isn't just a website. It's an apology, a promise, and a reminder that you're deeply loved.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            To the girl who acts strong when she's hurting, yet carries the softest heart I've ever known.
          </p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-lg md:text-xl font-semibold leading-relaxed">
              ROOH belongs to you, Ruhi. 🤍🌙
            </p>
            <HiddenEgg id="egg-10" icon="🤍" content="You are the center of my sanctuary. 🤍" />
          </div>
          <p className="font-sans text-[11px] uppercase tracking-widest opacity-50 font-bold pt-4">
            © 2026 Tasbir. Made with love, reserved for my future doctor.
          </p>
        </div>
      </footer>

      {/* Floating Emergency Comfort Button (Module 7) */}
      <EmergencyButton 
        visible={!isWhyRoohOpen} 
        forceOpen={forceComfortOpen} 
        setForceOpen={setForceComfortOpen}
      />
    </div>
  );
}
