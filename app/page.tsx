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

  // 2. Real-time Synchronized States (Shortened names to match production spec)
  const [streak, setStreak] = useState(12);
  const [water, setWater] = useState(0);
  const [waterGoal, setWaterGoal] = useState<number>(8);
  const [sleep, setSleep] = useState(0);
  const [breaks, setBreaks] = useState(0);
  const [tasks, setTasks] = useState<any[]>([]);

  // 3. Experiential Interactive Expansion States
  const [stickyNote, setStickyNote] = useState('');
  const [confetti, setConfetti] = useState<{ id: number; x: number; color: string }[]>([]);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

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

  // Medication Routine Scheduler States
  const [medications, setMedications] = useState<{ id: string; name: string; time: string; taken: boolean }[]>([]);

  // Load medications from localStorage on client-side mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rooh_medications');
      if (saved) {
        try {
          setMedications(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing medications", e);
        }
      } else {
        const defaults = [
          { id: '1', name: 'Multivitamin', time: '08:00 AM', taken: false },
          { id: '2', name: 'Iron Supplement', time: '10:00 PM', taken: false }
        ];
        setMedications(defaults);
        localStorage.setItem('rooh_medications', JSON.stringify(defaults));
      }
    }
  }, []);

  const [newMedName, setNewMedName] = useState('');
  const [newMedTime, setNewMedTime] = useState('08:00 AM');
  const [lastTriggeredMeds, setLastTriggeredMeds] = useState<Record<string, string>>({}); // medicationId -> YYYY-MM-DD HH:MM

  // Save medications to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rooh_medications', JSON.stringify(medications));
    }
  }, [medications]);

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

  const getRandomAffirmation = () => {
    const idx = Math.floor(Math.random() * TASBIR_AFFIRMATIONS.length);
    return TASBIR_AFFIRMATIONS[idx];
  };

  // Sanctuary Notes Sticky Pad Auto-Save hook
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('local_sticky_note') || '';
      setStickyNote(saved);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('local_sticky_note', stickyNote);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [stickyNote]);

  // Planner States
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState<'Anatomy' | 'Physiology' | 'Biochemistry' | 'Pathology' | 'Pharmacology' | 'Medicine' | 'Surgery'>('Anatomy');

  // Study hours goal & countdown timer variables
  const [studyHoursGoal, setStudyHoursGoal] = useState(4); // Target study hours goal
  const [secondsRemaining, setSecondsRemaining] = useState(4 * 3600);
  const [timerActive, setTimerActive] = useState(false);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0);

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

    // Vercel PWA Worker Registration
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('data:application/javascript;base64,c2VsZi5hZGRFdmVudExpc3RlbmVyKCdwdXNoJywgZnVuY3Rpb24oZSl7fSk7', { scope: '/' })
        .then(() => console.log('Vercel PWA Worker Active.'))
        .catch(err => console.log('Worker registration failed:', err));
    }
  }, []);

  // Bulletproof Notification Delivery Engine with SW Overdrive
  const sendNativeNotification = (title: string, message: string) => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn(`[Push Mock] ${title}: ${message}`);
      return;
    }

    // Force production-grade parameters to wake up lock screens and notify reliably
    const options = {
      body: message,
      tag: "medication-reminder",
      renotify: true,
      requireInteraction: true,
      vibrate: [300, 100, 300]
    };

    if (Notification.permission === 'granted') {
      // Prioritize SW registration to bypass background restrictions
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

  // Precision Active Prescription Push Engine checker loop (30s interval)
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

  // Fetch and Subscribe to all wellness changes in a single useEffect loop
  useEffect(() => {
    if (!userId) return;

    const todayStr = new Date().toLocaleDateString('en-CA');

    const fetchInitialData = async () => {
      try {
        setSyncStatus('syncing');
        
        // 1. Defensive Initial Fetch & Upsert Fallback
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
            water_glasses: 0,
            water_goal: 8,
            sleep_hours: 0,
            breaks_taken: 0,
            study_streak: 12,
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
          setWater(wellnessData.water_glasses ?? 0);
          setWaterGoal(wellnessData.water_goal ?? 8);
          setSleep(Number(wellnessData.sleep_hours ?? 0));
          setBreaks(wellnessData.breaks_taken ?? 0);
          setStreak(wellnessData.study_streak ?? 12);
        }

        // Fetch tasks
        const { data: dbTasks, error: tasksErr } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (!tasksErr && dbTasks) {
          setTasks(dbTasks);
        }

        setSyncStatus('synced');
      } catch (err) {
        setSyncStatus('offline');
      }
    };

    fetchInitialData();

    // 2. Aggressive Wildcard Realtime Handler
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
          setStreak(data.study_streak ?? 12); // Absolute force sync for streak
        }
        setSyncStatus('synced');
      })
      .subscribe();

    // Setup Realtime Tasks subscription
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
          if (data) setTasks(data);
        };
        refetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(wellnessChannel);
      supabase.removeChannel(tasksChannel);
    };
  }, [userId]);

  // 4. Optimistic DB Mutations
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
      
      // Trigger Celebration when target water goal reached exactly
      if (finalWater >= waterGoal && water < waterGoal) {
        triggerCelebration("Hydrated and healthy—proud of you, Ruhi! 🥛🤍");
      }
    } else if (field === 'water_goal') {
      finalWaterGoal = Math.max(1, amount); // Set absolute value
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

    if (!userId) return;
    const todayStr = new Date().toLocaleDateString('en-CA');

    try {
      setSyncStatus('syncing');
      const { error } = await supabase.from('wellness_tracker').upsert({
        user_id: userId,
        log_date: todayStr,
        water_glasses: finalWater,
        water_goal: finalWaterGoal,
        sleep_hours: finalSleep,
        breaks_taken: finalBreaks,
        study_streak: finalStreak,
        steps: 4000
      }, { onConflict: 'user_id,log_date' });

      if (error) throw error;
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Sync failed. Reverting to sandbox state.');
      setSyncStatus('offline');
    }
  };

  // 5. Time-Aware Greeting Lifecycle Loop (60s checks)
  const [greeting, setGreeting] = useState("Hello, Ruhi 🌸");

  useEffect(() => {
    const getGreetingText = (hour: number) => {
      if (hour >= 5 && hour < 12) return "Good Morning, Ruhi 🌅";
      if (hour >= 12 && hour < 17) return "Good Afternoon, Ruhi ☀️";
      if (hour >= 17 && hour < 21) return "Good Evening, Ruhi 🌙";
      return "Good Night, Ruhi 🌌";
    };

    const updateGreeting = () => {
      const hour = new Date().getHours();
      setGreeting(getGreetingText(hour));
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  // 6. Active Study Session Countdown Timer & Push Pipeline
  const adjustStudyGoal = (amount: number) => {
    const nextGoal = Math.max(1, Math.min(24, studyHoursGoal + amount));
    setStudyHoursGoal(nextGoal);
    setSecondsRemaining(nextGoal * 3600);
    setTotalElapsedSeconds(0);
    setTimerActive(false);
  };

  // Precision Ticker Interval Loop (Automated notifications in the background)
  useEffect(() => {
    let intervalId: any = null;
    if (timerActive) {
      intervalId = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setTimerActive(false);
            sendNativeNotification("ROOH Sanctuary 🧠", "done jaan eibar amar kase asho");
            // Trigger celebration overlay on goal completion
            triggerCelebration(getRandomAffirmation());
            // Optimistically update study streak on goal completion
            updateWellnessMetric('study_streak', 1);
            return 0;
          }
          
          const next = prev - 1;
          const elapsed = (studyHoursGoal * 3600) - next;
          setTotalElapsedSeconds(elapsed);

          // 1. Check 1-Hour Milestone (3600 seconds)
          if (elapsed === 3600) {
            sendNativeNotification("ROOH Sanctuary 🌙", "I love you ruhi");
          }

          return next;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timerActive, studyHoursGoal]);

  // Format countdown text e.g. 03:59:59
  const formatTimerString = () => {
    const hrs = Math.floor(secondsRemaining / 3600);
    const mins = Math.floor((secondsRemaining % 3600) / 60);
    const secs = secondsRemaining % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

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

  const handleWaterGoalChange = (val: number) => {
    const cleanVal = Math.max(1, val);
    setWaterGoal(cleanVal);
    localStorage.setItem('rooh_water_goal', String(cleanVal));
    updateWellnessMetric('water_goal', cleanVal);
  };

  // Planner Mutator Helpers
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

    // Optimistic local update
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
      // Trigger Celebration when task matches completed status
      triggerCelebration(getRandomAffirmation());
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

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#0D3B66] font-sans pb-24 relative overflow-x-hidden selection:bg-[#CFC8FF] flex flex-col">
      {/* Dynamic Confetti viewport stream overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {confetti.map(p => (
            <motion.div
              key={p.id}
              initial={{ y: '105vh', x: `${p.x}vw`, scale: Math.random() * 0.6 + 0.4, opacity: 1, rotate: 0 }}
              animate={{ y: '-10vh', rotate: Math.random() * 360 + 360 }}
              exit={{ opacity: 0 }}
              transition={{ duration: Math.random() * 2.5 + 2, ease: "easeOut" }}
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
              className="bg-[#FFFDF7] border-2 border-[#CFC8FF] rounded-3xl p-8 max-w-md w-full text-center shadow-xl relative"
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

      {/* Decorative Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#CFC8FF]/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] bg-[#CCFFBC]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Scrollable Layout Container */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex-grow w-full font-sans">
        
        {/* Header / Logo / Database Sync Indicator */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-12">
          <div className="flex items-center gap-2">
            <span className="font-serif text-3xl font-black tracking-wide text-[#0D3B66]">ROOH</span>
            <div className="w-2 h-2 rounded-full bg-[#CCFFBC]" />
            
            {/* Supabase Sync status tracker */}
            <div className="flex items-center gap-1.5 ml-4 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full border border-[#0D3B66]/5 text-xs font-semibold">
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
          </div>
          
          <div className="flex items-center gap-3 self-start sm:self-center">
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
              className="flex items-center gap-2 bg-white/60 hover:bg-white/95 px-4 py-2 rounded-full border border-[#0D3B66]/5 shadow-sm text-xs font-bold transition-all text-[#0D3B66] font-sans"
            >
              <Bell className={`w-3.5 h-3.5 ${hasPushPermission ? 'text-emerald-600 fill-emerald-600' : 'text-gray-400'}`} />
              {hasPushPermission ? "Push Notifications Active" : "Allow Push Alerts"}
            </button>

            {/* Flame Streak pill */}
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-[#0D3B66]/5 shadow-sm">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              </motion.span>
              <span className="font-sans font-bold text-xs text-[#0D3B66]">
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
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-[#0D3B66]"
          >
            {greeting}
          </motion.h1>
          
          {/* Affirmation Card (Rotated date-seeded content) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#CFC8FF]/30 border-l-4 border-[#CFC8FF] rounded-r-2xl p-5 flex justify-between items-center gap-4 cursor-pointer hover:bg-[#CFC8FF]/40 transition-all duration-300 animate-fade-in"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#0D3B66] shrink-0 mt-1" />
              <p className="font-serif text-lg md:text-xl font-medium text-[#0D3B66]">
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

          {/* Left Column: Studies, Countdown & Tasks */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* STUDY TIMER & TIMELINES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Study Session Active Precision Countdown Card (Module 1 & 3) */}
              <div className="bg-white/80 backdrop-blur-md border border-[#0D3B66]/5 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow font-sans">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-serif text-lg font-bold text-[#0D3B66]">Study Session Today</h3>
                  <Clock className="w-4 h-4 opacity-60 animate-spin-slow" />
                </div>
                
                <div className="flex flex-col items-center justify-center py-1">
                  <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                    {/* Ring background - Active countdown tracks (Mint accent) */}
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="54" stroke="#F3F4F6" strokeWidth="8" fill="transparent" />
                      <circle cx="64" cy="64" r="54" stroke="#CCFFBC" strokeWidth="8" fill="transparent" 
                         strokeDasharray={2 * Math.PI * 54} 
                         strokeDashoffset={2 * Math.PI * 54 * (secondsRemaining / (studyHoursGoal * 3600))} 
                         strokeLinecap="round"
                         className="transition-all duration-300"
                      />
                    </svg>
                    <div className="text-center z-10 font-sans">
                      <span className="font-sans text-2xl font-black tabular-nums tracking-tight text-[#0D3B66]">
                        {formatTimerString()}
                      </span>
                      <p className="text-[10px] opacity-60 font-bold font-sans">Goal: {studyHoursGoal}h</p>
                    </div>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={() => setTimerActive(!timerActive)}
                      className={`p-2 rounded-full transition-colors ${timerActive ? 'bg-amber-100 hover:bg-amber-200 text-amber-700' : 'bg-[#CCFFBC] hover:bg-[#b0eaa5] text-[#0D3B66]'}`}
                    >
                      {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => { setTimerActive(false); setSecondsRemaining(studyHoursGoal * 3600); setTotalElapsedSeconds(0); }}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Goal Adjustment */}
                  <div className="flex items-center gap-3 mt-1.5 pt-2 border-t border-gray-100 w-full justify-center font-sans">
                    <button 
                      onClick={() => adjustStudyGoal(-1)}
                      className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold font-sans text-[#0D3B66]">Adjust Hours</span>
                    <button 
                      onClick={() => adjustStudyGoal(1)}
                      className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic urgencies CountdownCard (Module 8) */}
              <CountdownCard 
                title="Anatomy Final Exam" 
                targetDate={new Date(Date.now() + 1000 * 60 * 60 * 24 * 2.8).toISOString()} // 2.8 days out (triggers alert style)
                subtitle="Gross Anatomy & Embryology Review"
              />

            </div>

            {/* STUDY PLANNER (Module 2 CRUD synced in real-time) */}
            <div className="bg-white/80 backdrop-blur-md border border-[#0D3B66]/5 rounded-3xl p-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#0D3B66] mb-2">Real-Time Study Planner</h3>
              <p className="text-xs text-[#0D3B66]/60 mb-6 font-sans">Manage study items. Modifications persist in the database channel.</p>

              {/* Add Task Input Form */}
              <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2.5 mb-6">
                <input
                  type="text"
                  placeholder="What medical concept will you review today?"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 text-sm py-2 px-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#0D3B66]/30 text-[#0D3B66] font-sans"
                />
                
                <select
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value as any)}
                  className="text-xs py-2 px-3 rounded-xl border border-gray-200 bg-white focus:outline-none font-sans font-bold text-[#0D3B66]"
                >
                  {['Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology', 'Medicine', 'Surgery'].map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="bg-[#0D3B66] text-white hover:bg-[#0c2e50] text-xs font-bold px-5 py-2.5 rounded-xl transition-all font-sans"
                >
                  Add Lecture
                </button>
              </form>

              {/* Real-time Task List */}
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {tasks.length === 0 ? (
                  <p className="text-xs text-gray-400 italic font-sans">No tasks planned yet. Add one to start sync logs.</p>
                ) : (
                  <AnimatePresence initial={false}>
                    {tasks.map(task => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-xl font-sans"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleTask(task.id, !task.is_completed)}
                            className="text-[#0D3B66] hover:scale-110 transition-transform"
                          >
                            {task.is_completed ? (
                              <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5 opacity-40" />
                            )}
                          </button>
                          
                          <div>
                            <span className={`text-sm font-sans font-semibold ${task.is_completed ? 'line-through opacity-45' : ''}`}>
                              {task.title}
                            </span>
                            <span className="text-[10px] bg-[#CFC8FF]/30 text-[#0D3B66] px-2 py-0.5 rounded ml-2 font-bold uppercase tracking-wider font-sans">
                              {task.subject}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
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
            <div className="bg-white/80 backdrop-blur-md border border-[#0D3B66]/5 rounded-3xl p-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#0D3B66] mb-2">How are you feeling right now, Ruhi?</h3>
              <p className="text-xs text-[#0D3B66]/65 mb-6 font-sans">Select a mood to log your check-in. It will stream live into your database log.</p>
              
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
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 hover:scale-105 bg-[#FFFDF7] hover:border-[#CFC8FF] text-[#0D3B66] font-sans"
                  >
                    <span className="text-2xl mb-1">{m.emoji}</span>
                    <span className="text-xs font-sans font-semibold text-[#0D3B66]/85">{m.name}</span>
                  </button>
                ))}
              </div>

              {/* Reactive UI comfort text box */}
              {activeMoodResponse && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#CFC8FF]/20 border border-[#CFC8FF]/50 rounded-2xl p-4 text-sm font-sans"
                >
                  <p className="font-bold text-[#0D3B66] mb-1 font-serif">ROOH responds:</p>
                  <p className="italic text-[#0D3B66]/85 font-sans">"{activeMoodResponse}"</p>
                </motion.div>
              )}
            </div>

            {/* SEEDED DAILY COMFORT CARD RECOMMENDATION (Module 5) */}
            <div className="bg-[#FFFDF7] border-2 border-[#CFC8FF] rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#CCFFBC]/30 rounded-full blur-xl animate-pulse" />
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-[#CFC8FF]/40 px-2.5 py-0.5 rounded-full text-[#0D3B66] font-sans">
                  {dailyData.comfortCard.category}
                </span>
                <span className="text-[10px] text-purple-600 font-bold font-sans">Today's Daily Comfort 🌸</span>
              </div>
              <h4 className="font-serif text-xl font-bold mb-2 text-[#0D3B66]">{dailyData.comfortCard.title}</h4>
              <p className="text-sm italic leading-relaxed text-[#0D3B66]/80 font-serif">{dailyData.comfortCard.content}</p>
            </div>

          </div>

          {/* Right Column: Self Care, Sounds, Notes, Secure Vault & Prescriptions */}
          <div className="space-y-8">
            
            {/* DOCTOR'S PRESCRIPTION & SCHEDULE (Health Module) */}
            <div className="bg-white/80 backdrop-blur-md border border-[#0D3B66]/5 rounded-3xl p-6 shadow-sm font-sans">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl font-bold text-[#0D3B66]">Doctor's Prescription</h3>
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
                    className="px-3 py-1 bg-[#CFC8FF]/30 hover:bg-[#CFC8FF]/50 text-[10px] font-bold rounded-full transition-all text-[#0D3B66] font-sans shrink-0 border border-[#0D3B66]/5"
                  >
                    Enable Mobile Alerts
                  </button>
                )}
              </div>
              <p className="text-xs text-[#0D3B66]/65 mb-6 font-sans">Manage scheduled medications. System matches clock and triggers alerts.</p>

              {/* Add Medication form */}
              <div className="flex flex-col gap-2.5 mb-6">
                <input
                  type="text"
                  placeholder="Medicine Name (e.g. Multivitamin)..."
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#0D3B66]/30 text-[#0D3B66] font-sans"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Time (e.g. 08:00 AM)"
                    value={newMedTime}
                    onChange={(e) => setNewMedTime(e.target.value)}
                    className="flex-grow text-xs py-2 px-3 rounded-xl border border-gray-200 bg-white focus:outline-none text-[#0D3B66] font-sans"
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
                      setMedications(prev => [...prev, newMed]);
                      setNewMedName('');
                      setNewMedTime('08:00 AM');
                    }}
                    className="bg-[#0D3B66] text-white hover:bg-[#0c2e50] text-xs font-bold px-4 py-2 rounded-xl transition-all font-sans shrink-0"
                  >
                    Add Schedule
                  </button>
                </div>
              </div>

              {/* Medication list */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {medications.length === 0 ? (
                  <p className="text-xs text-gray-400 italic font-sans">No prescriptions logged yet.</p>
                ) : (
                  medications.map(med => (
                    <div
                      key={med.id}
                      className="flex items-center justify-between p-3.5 bg-[#FFFDF7] border border-gray-100 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setMedications(prev => prev.map(m => m.id === med.id ? { ...m, taken: !m.taken } : m));
                            if (!med.taken) {
                              triggerCelebration("Oshud khavar jonno proud of you, Doctor! 🌸");
                            }
                          }}
                          className="text-[#0D3B66] hover:scale-110 transition-transform shrink-0"
                        >
                          {med.taken ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-5 h-5 opacity-40" />
                          )}
                        </button>

                        <div>
                          <p className={`text-sm font-semibold font-sans text-[#0D3B66] ${med.taken ? 'line-through opacity-45' : ''}`}>
                            {med.name}
                          </p>
                          <p className="text-[10px] text-purple-600 font-bold font-sans">
                            {med.time}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setMedications(prev => prev.filter(m => m.id !== med.id))}
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* WELLNESS & SELF-CARE INTERACTIVE CONTROL MATRIX */}
            <div className="bg-white/80 backdrop-blur-md border border-[#0D3B66]/5 rounded-3xl p-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#0D3B66] mb-6">Wellness & Self-Care</h3>
              
              <div className="space-y-6">
                
                {/* 1. Hydration Module (Lavender Animated Fluid Wave Component) */}
                <div>
                  <div className="flex justify-between items-center text-sm font-semibold mb-3 font-sans">
                    <span className="flex items-center gap-2"><Waves className="w-4 h-4 text-sky-500" /> Hydration</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs">Goal:</span>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={waterGoal}
                        onChange={(e) => handleWaterGoalChange(parseInt(e.target.value, 10))}
                        className="w-10 text-center py-0.5 bg-gray-50 border border-gray-200 rounded font-sans font-bold text-[#0D3B66] text-xs focus:outline-none"
                      />
                      <span className="text-xs font-bold">Glasses</span>
                    </div>
                  </div>

                  {/* Rising Tide Wave Animation Container */}
                  <motion.div 
                    animate={water >= waterGoal ? { scale: [1, 1.02, 1], borderColor: '#CCFFBC' } : { scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-32 bg-gray-50 border border-[#0D3B66]/10 rounded-2xl overflow-hidden flex flex-col justify-end shadow-inner mb-3"
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
                    <div className="z-10 p-4 w-full flex justify-between items-end font-sans">
                      <div className="flex flex-col text-left">
                        <span className="text-2xl font-black text-[#0D3B66]">{water} Glasses</span>
                      </div>
                      {water >= waterGoal && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-[#CCFFBC] border border-emerald-300 px-2 py-0.5 rounded-full">
                          Achieved! 🌸
                        </span>
                      )}
                    </div>
                  </motion.div>

                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => updateWellnessMetric('water_glasses', -1)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg font-bold font-sans transition-colors"
                    >
                      -1 Glass
                    </button>
                    <button 
                      onClick={() => updateWellnessMetric('water_glasses', 1)}
                      className="px-3 py-1 text-xs bg-[#CFC8FF]/30 hover:bg-[#CFC8FF]/50 rounded-lg font-bold font-sans transition-colors"
                    >
                      +1 Glass
                    </button>
                  </div>
                </div>

                {/* 2. Sleep Tracker Module (Mint Accent Progress) */}
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2 font-sans">
                    <span className="flex items-center gap-2"><Coffee className="w-4 h-4 text-emerald-500" /> Sleep Log</span>
                    <span>{sleep}h Logged</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-2">
                    <div 
                      className="bg-[#CCFFBC] h-full rounded-full transition-all duration-300 animate-pulse-slow" 
                      style={{ width: `${Math.min(100, (sleep / 9) * 100)}%` }} 
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => updateWellnessMetric('sleep_hours', -0.5)}
                      className="px-2.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded font-bold font-sans"
                    >
                      -0.5h
                    </button>
                    <button 
                      onClick={() => updateWellnessMetric('sleep_hours', 0.5)}
                      className="px-2.5 py-0.5 text-xs bg-[#CCFFBC]/40 hover:bg-[#CCFFBC]/60 rounded font-bold font-sans"
                    >
                      +0.5h
                    </button>
                  </div>
                </div>

                {/* 3. Rest Breaks Module (Lavender Progress) */}
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2 font-sans">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-purple-500" /> Rest Breaks</span>
                    <span>{breaks} Breaks Taken</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-2">
                    <div 
                      className="bg-[#CFC8FF] h-full rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(100, (breaks / 5) * 100)}%` }} 
                    />
                  </div>
                  <div className="flex justify-end gap-2 text-sans">
                    <button 
                      onClick={() => updateWellnessMetric('breaks_taken', -1)}
                      className="px-2.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded font-bold text-[#0D3B66]"
                      disabled={breaks <= 0}
                    >
                      -1 Break
                    </button>
                    <button 
                      onClick={() => updateWellnessMetric('breaks_taken', 1)}
                      className="px-2.5 py-0.5 text-xs bg-[#CCFFBC] hover:bg-[#b5ebaa] rounded font-bold text-[#0D3B66] shadow-sm"
                    >
                      Log Break 🌸
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK NOTE-TAKING STICKY PAD (Feature 2) */}
            <div className="bg-white/80 backdrop-blur-md border border-[#0D3B66]/5 rounded-3xl p-6 shadow-sm overflow-hidden relative font-sans">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#CCFFBC]/10 rounded-full blur-xl -z-10" />
              
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-serif text-xl font-bold text-[#0D3B66]">Sanctuary Notes</h3>
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              </div>
              <p className="text-xs text-[#0D3B66]/65 mb-4 font-sans">Auto-saves clinical tracking details or daily pathology concepts instantly.</p>
              
              <textarea
                value={stickyNote}
                onChange={(e) => setStickyNote(e.target.value)}
                placeholder="Write your study logs, medical targets, or thoughts here, Ruhi..."
                className="w-full h-32 text-xs p-3.5 rounded-2xl border border-gray-200 bg-[#FFFDF7] focus:outline-none focus:ring-1 focus:ring-[#0D3B66]/20 text-[#0D3B66] font-sans resize-none placeholder-gray-400/80 shadow-inner"
              />
              <div className="flex justify-between items-center mt-2 text-[10px] text-gray-400 font-bold font-sans">
                <span>{stickyNote.length} characters</span>
                <span className="text-[#CCFFBC] bg-[#0D3B66] px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-sans font-black">
                  Auto-saved
                </span>
              </div>
            </div>

            {/* TASBIR'S AUDIO VAULT (Feature 1) */}
            <div className="bg-white/80 backdrop-blur-md border border-[#0D3B66]/5 rounded-3xl p-6 shadow-sm overflow-hidden relative font-sans">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#CFC8FF]/15 rounded-full blur-xl -z-10" />
              
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-serif text-xl font-bold text-[#0D3B66]">Tasbir's Audio Vault</h3>
                <Music className="w-4 h-4 text-purple-600 animate-pulse" />
              </div>
              <p className="text-xs text-[#0D3B66]/65 mb-4 font-sans">A private collection of comforting voice letters for your medical journey.</p>

              <div className="space-y-3 mb-4">
                {AUDIO_LETTERS.map((item) => {
                  const isSelected = activeAudioLetter === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => playAudioLetter(item.path, item.key)}
                      className={`w-full flex justify-between items-center p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                        isSelected 
                          ? 'bg-[#CFC8FF]/20 border-[#CFC8FF] shadow-sm' 
                          : 'bg-[#FFFDF7] border-gray-100 hover:border-[#CFC8FF]/40'
                      }`}
                    >
                      <span className="text-xs font-serif font-semibold text-[#0D3B66]/90 pr-2">
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
                    className="mt-4 p-4 bg-[#FFFDF7] border border-[#CFC8FF]/60 rounded-2xl shadow-inner space-y-3 font-sans"
                  >
                    {/* Header info */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                        <span className="text-[10px] uppercase tracking-wider font-bold text-purple-600 font-sans">
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
                        className="text-[10px] text-gray-400 hover:text-gray-600 font-bold font-sans"
                      >
                        Close
                      </button>
                    </div>

                    {/* Active Track Title */}
                    <p className="text-xs font-serif font-medium text-[#0D3B66] leading-snug">
                      {AUDIO_LETTERS.find(l => l.key === activeAudioLetter)?.label.replace('🔒 ', '')}
                    </p>

                    {/* Progress Slider (Seek Bar) */}
                    <div className="space-y-1.5">
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
                        className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden cursor-pointer relative"
                      >
                        <motion.div 
                          className="bg-[#CFC8FF] h-full rounded-full"
                          style={{ width: `${(audioProgress / (audioDuration || 180)) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-[#0D3B66]/75 font-sans font-bold">
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
                        className="p-2 rounded-full bg-[#0D3B66] hover:bg-[#0c2e50] text-[#FFFDF7] transition-all flex items-center justify-center"
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
                            className="w-1 bg-[#0D3B66]/70 h-full origin-center rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CALM CORNER SOUNDBOARD (Module 12) */}
            <div className="bg-white/80 backdrop-blur-md border border-[#0D3B66]/5 rounded-3xl p-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#0D3B66] mb-1">Calm Corner Soundboard</h3>
              <p className="text-xs text-[#0D3B66]/60 mb-4 font-sans">Toggle study ambient soundtracks to craft your study mix.</p>
              
              <div className="space-y-3 font-sans">
                {[
                  { name: 'Rain', label: 'Rain Sounds 🌧️' },
                  { name: 'Lofi', label: 'Lofi Study Music 🎧' },
                  { name: 'Cafe', label: 'Cafe Ambience ☕' }
                ].map(sound => (
                  <button
                    key={sound.name}
                    onClick={() => toggleSound(sound.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-sm font-semibold transition-all duration-200 ${
                      activeSounds[sound.name] 
                        ? 'bg-[#CCFFBC] border-[#CCFFBC] text-[#0D3B66] scale-[1.01] shadow-sm' 
                        : 'bg-white border-[#0D3B66]/5 hover:bg-gray-50'
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
            </div>

            {/* TASBIR LOCKER VAULT (Module 14) */}
            <div className="bg-white/80 backdrop-blur-md border border-[#0D3B66]/5 rounded-3xl p-6 shadow-sm overflow-hidden relative font-sans">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#CFC8FF]/20 rounded-full blur-xl -z-10" />
              
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-serif text-xl font-bold text-[#0D3B66]">Tasbir Corner</h3>
                <Lock className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-xs text-[#0D3B66]/65 mb-4 font-sans">A private safe space with letters from a loved one. Input code key to reveal.</p>

              {!isVaultUnlocked ? (
                <div className="space-y-3 font-sans">
                  <input 
                    type="password"
                    placeholder="Enter Key Code (try 'tasbir')..."
                    value={vaultPassword}
                    onChange={(e) => setVaultPassword(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-gray-200 bg-white focus:outline-none text-[#0D3B66]"
                  />
                  <button
                    onClick={handleUnlockVault}
                    className="w-full py-2 bg-[#0D3B66] text-white hover:bg-[#0c2e50] text-xs font-bold rounded-xl transition-colors"
                  >
                    Unlock Locker
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in font-sans">
                  <div className="flex justify-between items-center text-xs text-purple-600 font-bold bg-purple-50 px-3 py-1.5 rounded-lg">
                    <span>Locker Unlocked</span>
                    <button 
                      onClick={() => { setIsVaultUnlocked(false); setOpenedLetter(null); }}
                      className="underline text-[10px]"
                    >
                      Lock
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {TASBIR_LETTERS.map((letter, idx) => (
                      <button
                        key={idx}
                        onClick={() => setOpenedLetter(openedLetter === letter.trigger ? null : letter.trigger)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                          openedLetter === letter.trigger 
                            ? 'bg-[#CFC8FF]/30 border-[#CFC8FF] text-[#0D3B66]' 
                            : 'bg-white hover:bg-gray-50 border-gray-100'
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
                            className="mt-2 text-[#0D3B66]/80 font-normal leading-relaxed italic border-t border-[#0D3B66]/10 pt-2 font-serif"
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
        <div className="mt-8 bg-white/80 backdrop-blur-md border border-dashed border-[#0D3B66]/20 rounded-3xl p-6 space-y-6 font-sans">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-serif text-xl font-bold text-[#0D3B66]">Version 2 Scale-Up Integrations</h3>
              <span className="text-[10px] uppercase font-bold tracking-widest text-purple-600 bg-purple-100 px-2 py-0.5 rounded font-sans">Future Roadmap</span>
            </div>
            <p className="text-xs opacity-60 font-sans">Ready slots for drug database searches, flashcards, and AI models.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            
            {/* Hook 1: Flashcards */}
            <div className="bg-[#FFFDF7] border border-[#0D3B66]/10 p-5 rounded-2xl">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Medical Flashcards
                </span>
                <span className="text-[10px] opacity-60">Card {flashcardIndex + 1}/3</span>
              </div>
              
              <div className="min-h-[90px] flex flex-col justify-center items-center text-center p-3 bg-white rounded-xl border border-gray-100 mb-3 shadow-inner">
                <p className="text-sm font-semibold text-[#0D3B66]">
                  {showAnswer ? flashcards[flashcardIndex].answer : flashcards[flashcardIndex].question}
                </p>
              </div>

              <div className="flex gap-2 font-sans">
                <button 
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="flex-1 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-xs font-bold rounded-lg transition-colors"
                >
                  {showAnswer ? "Show Question" : "Reveal Answer"}
                </button>
                <button 
                  onClick={() => {
                    setFlashcardIndex(prev => (prev + 1) % flashcards.length);
                    setShowAnswer(false);
                  }}
                  className="py-1.5 px-3 bg-[#CCFFBC] hover:bg-[#b5ebaa] text-xs font-bold rounded-lg transition-colors"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Hook 2: Drug Database */}
            <div className="bg-[#FFFDF7] border border-[#0D3B66]/10 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1 mb-3">
                  <Search className="w-3.5 h-3.5" /> Drug Database Search
                </span>
                
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Search generic (e.g. Paracetamol)..."
                    value={searchDrug}
                    onChange={(e) => setSearchDrug(e.target.value)}
                    className="w-full text-xs py-2 pl-8 pr-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#0D3B66]/20 bg-white"
                  />
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 opacity-40" />
                </div>
              </div>

              {searchDrug ? (
                <div className="p-2 bg-[#CCFFBC]/20 border border-[#CCFFBC]/60 rounded-lg text-[11px] font-sans">
                  <span className="font-bold">Drug Hook Active:</span> API trigger for <span className="underline font-semibold">{searchDrug}</span> ready.
                </div>
              ) : (
                <p className="text-[10px] text-gray-400 italic">Enter a name above to test endpoint query binding.</p>
              )}
            </div>

          </div>

          {/* Hook 3: AI Companion */}
          <div className="bg-[#FFFDF7] border border-[#0D3B66]/10 p-5 rounded-2xl font-sans">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1 mb-3">
              <MessageSquare className="w-3.5 h-3.5" /> AI Study Assistant & Companion
            </span>

            <div className="bg-white rounded-xl border border-gray-100 p-3 h-28 overflow-y-auto mb-3 text-xs space-y-2 shadow-inner">
              {aiChatLog.map((chat, idx) => (
                <div key={idx} className={`flex ${chat.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2 rounded-xl max-w-[85%] ${chat.sender === 'User' ? 'bg-[#CFC8FF]/40 text-[#0D3B66]' : 'bg-gray-100 text-gray-700'}`}>
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
                className="flex-1 text-xs py-2 px-3 rounded-lg border border-gray-200 focus:outline-none bg-white text-[#0D3B66]"
              />
              <button 
                type="submit"
                className="bg-[#0D3B66] text-white hover:bg-[#092b4d] text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Ask Assistant
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* 4. Permanent Romantic Dedication Footer */}
      <footer className="w-full py-16 mt-auto text-center font-serif text-[#0D3B66]/80 relative z-10 px-6 border-t border-[#0D3B66]/5 bg-white/40 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-lg md:text-xl leading-relaxed">
            This isn't just a website. It's an apology, a promise, and a reminder that you're deeply loved.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            To the girl who acts strong when she's hurting, yet carries the softest heart I've ever known.
          </p>
          <p className="text-lg md:text-xl font-semibold leading-relaxed">
            ROOH belongs to you, Ruhi. 🤍🌙
          </p>
          <p className="font-sans text-[11px] uppercase tracking-widest text-[#0D3B66]/50 font-bold pt-4">
            © 2026 Tasbir. Made with love, reserved for my future doctor.
          </p>
        </div>
      </footer>

      {/* Floating Emergency Comfort Button (Module 7) */}
      <EmergencyButton />
    </div>
  );
}
