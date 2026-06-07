'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Task {
  id: string;
  title: string;
  subject: 'Anatomy' | 'Physiology' | 'Biochemistry' | 'Pathology' | 'Pharmacology' | 'Medicine' | 'Surgery';
  is_completed: boolean;
  created_at?: string;
}

export interface MoodLog {
  id: string;
  mood: 'Happy' | 'Calm' | 'Tired' | 'Stressed' | 'Sad' | 'Lonely' | 'Motivated';
  note: string;
  created_at: string;
}

export interface WellnessTracker {
  log_date: string;
  water_glasses: number;
  sleep_hours: number;
  steps: number;
  breaks_taken: number;
}

export function useRoohRealtime() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [wellness, setWellness] = useState<WellnessTracker>({
    log_date: new Date().toISOString().split('T')[0],
    water_glasses: 5,
    sleep_hours: 6.5,
    steps: 4000,
    breaks_taken: 3
  });
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Load Initial Data from LocalStorage (Fallback) and sync with Supabase
  useEffect(() => {
    // 1. Load Local Fallbacks
    const localTasks = localStorage.getItem('rooh_tasks');
    const localMoods = localStorage.getItem('rooh_moods');
    const localWellness = localStorage.getItem('rooh_wellness');

    if (localTasks) setTasks(JSON.parse(localTasks));
    if (localMoods) setMoodLogs(JSON.parse(localMoods));
    if (localWellness) setWellness(JSON.parse(localWellness));

    // Check if Supabase is connected
    const checkSupabaseSession = async () => {
      try {
        setSyncStatus('syncing');
        
        // Retrieve session / check user auth
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // No active auth session, fall back to offline demo mode
          setSyncStatus('offline');
          return;
        }

        // Fetch Tasks
        const { data: dbTasks, error: errT } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (!errT && dbTasks) {
          setTasks(dbTasks);
          localStorage.setItem('rooh_tasks', JSON.stringify(dbTasks));
        }

        // Fetch Mood Logs
        const { data: dbMoods, error: errM } = await supabase
          .from('mood_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        if (!errM && dbMoods) {
          setMoodLogs(dbMoods);
          localStorage.setItem('rooh_moods', JSON.stringify(dbMoods));
        }

        // Fetch Wellness log for today
        const todayStr = new Date().toISOString().split('T')[0];
        const { data: dbWellness, error: errW } = await supabase
          .from('wellness_tracker')
          .select('*')
          .eq('user_id', user.id)
          .eq('log_date', todayStr)
          .single();
        if (!errW && dbWellness) {
          setWellness(dbWellness);
          localStorage.setItem('rooh_wellness', JSON.stringify(dbWellness));
        }

        setSyncStatus('synced');
      } catch (error) {
        console.warn('Realtime hook sync fallback triggered. System operating offline.');
        setSyncStatus('offline');
      }
    };

    checkSupabaseSession();
  }, []);

  // 2. Set Up Real-Time Subscriptions
  useEffect(() => {
    const setupRealtimeSubscriptions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Realtime Tasks listener
      const tasksChannel = supabase.channel('realtime-tasks-changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'tasks',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          setSyncStatus('syncing');
          if (payload.eventType === 'INSERT') {
            setTasks(prev => {
              const updated = [payload.new as Task, ...prev];
              localStorage.setItem('rooh_tasks', JSON.stringify(updated));
              return updated;
            });
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => {
              const updated = prev.filter(t => t.id !== payload.old.id);
              localStorage.setItem('rooh_tasks', JSON.stringify(updated));
              return updated;
            });
          } else if (payload.eventType === 'UPDATE') {
            setTasks(prev => {
              const updated = prev.map(t => t.id === payload.new.id ? payload.new as Task : t);
              localStorage.setItem('rooh_tasks', JSON.stringify(updated));
              return updated;
            });
          }
          setSyncStatus('synced');
        })
        .subscribe();

      // Realtime Wellness listener
      const wellnessChannel = supabase.channel('realtime-wellness-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'wellness_tracker',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          setSyncStatus('syncing');
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const updated = payload.new as WellnessTracker;
            setWellness(updated);
            localStorage.setItem('rooh_wellness', JSON.stringify(updated));
          }
          setSyncStatus('synced');
        })
        .subscribe();

      // Realtime Mood listener
      const moodChannel = supabase.channel('realtime-mood-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'mood_logs',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          setSyncStatus('syncing');
          if (payload.eventType === 'INSERT') {
            setMoodLogs(prev => {
              const updated = [payload.new as MoodLog, ...prev].slice(0, 10);
              localStorage.setItem('rooh_moods', JSON.stringify(updated));
              return updated;
            });
          }
          setSyncStatus('synced');
        })
        .subscribe();

      return () => {
        supabase.removeChannel(tasksChannel);
        supabase.removeChannel(wellnessChannel);
        supabase.removeChannel(moodChannel);
      };
    };

    setupRealtimeSubscriptions();
  }, []);

  // 3. Mutator Helper Actions (With Optimistic UI updates)
  const addTask = useCallback(async (title: string, subject: Task['subject']) => {
    const tempId = crypto.randomUUID();
    const newTask: Task = { id: tempId, title, subject, is_completed: false };
    
    // Optimistic Update
    setTasks(prev => {
      const updated = [newTask, ...prev];
      localStorage.setItem('rooh_tasks', JSON.stringify(updated));
      return updated;
    });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setSyncStatus('syncing');
        const { error } = await supabase.from('tasks').insert({
          id: tempId,
          user_id: user.id,
          title,
          subject,
          is_completed: false
        });
        if (error) throw error;
        setSyncStatus('synced');
      }
    } catch (err) {
      console.warn('Task saved locally. Sync with cloud failed.');
      setSyncStatus('offline');
    }
  }, []);

  const toggleTask = useCallback(async (id: string, is_completed: boolean) => {
    // Optimistic Update
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, is_completed } : t);
      localStorage.setItem('rooh_tasks', JSON.stringify(updated));
      return updated;
    });

    try {
      const { error } = await supabase.from('tasks').update({ is_completed }).eq('id', id);
      if (error) throw error;
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Task update logged locally. Sync failed.');
      setSyncStatus('offline');
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    // Optimistic Update
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem('rooh_tasks', JSON.stringify(updated));
      return updated;
    });

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Task deletion logged locally. Sync failed.');
      setSyncStatus('offline');
    }
  }, []);

  const logMood = useCallback(async (mood: MoodLog['mood'], note: string = '') => {
    const tempId = crypto.randomUUID();
    const newLog: MoodLog = {
      id: tempId,
      mood,
      note,
      created_at: new Date().toISOString()
    };

    // Optimistic Update
    setMoodLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 10);
      localStorage.setItem('rooh_moods', JSON.stringify(updated));
      return updated;
    });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setSyncStatus('syncing');
        const { error } = await supabase.from('mood_logs').insert({
          id: tempId,
          user_id: user.id,
          mood,
          note
        });
        if (error) throw error;
        setSyncStatus('synced');
      }
    } catch (err) {
      console.warn('Mood check-in saved offline.');
      setSyncStatus('offline');
    }
  }, []);

  const updateWellness = useCallback(async (field: keyof Omit<WellnessTracker, 'log_date'>, amount: number) => {
    // Optimistic Update
    const updatedWellness = {
      ...wellness,
      [field]: Math.max(0, wellness[field] + amount)
    };
    setWellness(updatedWellness);
    localStorage.setItem('rooh_wellness', JSON.stringify(updatedWellness));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setSyncStatus('syncing');
        const { error } = await supabase.from('wellness_tracker').upsert({
          user_id: user.id,
          log_date: wellness.log_date,
          water_glasses: updatedWellness.water_glasses,
          sleep_hours: updatedWellness.sleep_hours,
          steps: updatedWellness.steps,
          breaks_taken: updatedWellness.breaks_taken
        }, { onConflict: 'user_id,log_date' });
        if (error) throw error;
        setSyncStatus('synced');
      }
    } catch (err) {
      console.warn('Wellness updates saved offline.');
      setSyncStatus('offline');
    }
  }, [wellness]);

  return {
    tasks,
    moodLogs,
    wellness,
    syncStatus,
    addTask,
    toggleTask,
    deleteTask,
    logMood,
    updateWellness
  };
}
