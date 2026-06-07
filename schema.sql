-- Create Enum Types for Strict Data Integrity
CREATE TYPE medical_subject AS ENUM (
    'Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology', 'Medicine', 'Surgery'
);

CREATE TYPE mood_type AS ENUM (
    'Happy', 'Calm', 'Tired', 'Stressed', 'Sad', 'Lonely', 'Motivated'
);

CREATE TYPE vault_trigger AS ENUM (
    'Stressed', 'Post_Anatomy', 'Miss_Me', 'General_Encouragement'
);

-- 1. Study Planner Table
CREATE TABLE public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    subject medical_subject NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Mood Logs Table
CREATE TABLE public.mood_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mood mood_type NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Achievements Table
CREATE TABLE public.achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    badge_key TEXT NOT NULL, -- e.g., 'streak_7', 'anatomy_master'
    title TEXT NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, badge_key)
);

-- 4. Wellness Tracker Table
CREATE TABLE public.wellness_tracker (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    log_date DATE DEFAULT CURRENT_DATE NOT NULL,
    water_glasses INT DEFAULT 0 CHECK (water_glasses >= 0),
    water_goal INT DEFAULT 8 CHECK (water_goal >= 1),
    sleep_hours NUMERIC(3,1) DEFAULT 0.0 CHECK (sleep_hours >= 0.0),
    steps INT DEFAULT 0 CHECK (steps >= 0),
    breaks_taken INT DEFAULT 0 CHECK (breaks_taken >= 0),
    study_streak INT DEFAULT 12 CHECK (study_streak >= 0),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, log_date)
);

-- 5. Tasbir Vault Table (Highly Personalized Encryption-Ready Storage)
CREATE TABLE public.tasbir_vault (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trigger_context vault_trigger NOT NULL,
    title TEXT NOT NULL,
    letter_content TEXT NOT NULL,
    voice_note_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Optimization Indexes
CREATE INDEX idx_tasks_user_subject ON public.tasks(user_id, subject);
CREATE INDEX idx_mood_logs_user_date ON public.mood_logs(user_id, created_at DESC);
CREATE INDEX idx_wellness_user_date ON public.wellness_tracker(user_id, log_date DESC);

-- Automated Updated_At Trigger Function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_modtime BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_wellness_modtime BEFORE UPDATE ON public.wellness_tracker FOR EACH ROW EXECUTE FUNCTION update_modified_column();
