# ROOH — Personal Sanctuary & Medical Study Companion

> "This isn't just a website. It's an apology, a promise, and a reminder that you're deeply loved."

Welcome to **ROOH**, a bespoke, interactive digital workspace and sanctuary designed specifically for my future doctor, **Ruhi**. This application blends clinical utility (such as medication schedules and a study planner) with soft emotional grounding modules to serve as a high-stress companion during long exam seasons.

---

## 🌸 Core Features

### 1. Doctor's Prescription & Schedule
* **Prescription Checklist**: Log scheduled medications (e.g., Multivitamins, Iron Supplements) and mark them as taken.
* **Midnight Auto-Reset**: Local checklist states automatically clear at midnight for a fresh start.
* **Precision Push Engine**: A high-accuracy client-side background timer checks the clock every 30 seconds. The exact minute the system clock matches a scheduled medication, it deploys a native desktop alert:
  * **Title**: `ROOH Care Matrix 🌸`
  * **Message**: `ei jaan oshud ta kheye neo`

### 2. Tasbir's Audio Letters Vault
* **Emotional Shortcuts**: Elegant private voice letters locked under specific prompts:
  * 🔒 *Open when you are failing to memorize Anatomy...*
  * 🔒 *Open after a long, exhausting exam day...*
  * 🔒 *Open at 3 AM when you feel lonely...*
* **Custom Audio Player**: Free from ugly browser defaults, featuring seekable progress bars, running track time formatting, fluid play/pause buttons, and a pulsing 10-bar rhythmic wave animation.
* **Sandbox Fallback Ticker**: Automatically falls back to simulate progress in sandbox environments where local `.mp3` files are missing.

### 3. Interactive Mindful Breathing Guide
* **Sensory Grounding**: Integrated directly into the **"I Need Comfort"** emergency modal overlay.
* **4-4-4 Box Breathing Cycle**: Follow the glowing Framer Motion ring:
  * **Inhale (4s)**: Ring expands with calming Lavender layout glow (`bg-[#CFC8FF]/30`).
  * **Hold (4s)**: Ring remains still, pulsing slightly with color shifts.
  * **Exhale (4s)**: Ring contracts back to baseline with Mint Cream glow (`bg-[#CCFFBC]/30`).

### 4. Real-Time Study Planner & Sync
* **Database Synchronizer**: Configured to sync streak badge multipliers, hydration fluid levels, sleep hours, and break logs instantaneously across tabs.
* **Supabase Realtime Channel**: Bound via a wildcard subscription listener to postgres changes.
* **Study Session Countdown**: Active timer alerting on 1-hour milestones and goal exhaustion.

### 5. Comfort soundboard & notes Pad
* **Sanctuary Notes**: A debounced auto-saving text pad backed up to local storage.
* **Calm soundboard**: Toggle rain, lofi study tunes, or cafe ambience to craft a personalized study soundtrack.

---

## 🎨 Brand Design Specifications

* **Color Tokens**:
  * Canvas base: Ivory (`#FFFDF7`)
  * Contrast Text: Deep Navy (`#0D3B66`)
  * Comfort elements: Lavender (`#CFC8FF`)
  * Fresh accents: Mint Cream (`#CCFFBC`)
* **Typography**:
  * Serif font: **Cormorant Garamond** (`font-serif`) for structural main titles, vault options, deep quote text, and the romantic footer.
  * Sans font: **Manrope** (`font-sans`) for progress metrics, timers, notes, and checklist labels.

---

## 🛠️ Technology Stack
* **Framework**: Next.js (React)
* **Animations**: Framer Motion
* **Database / Realtime**: Supabase Client (Replication & Realtime Channels)
* **Styling**: Tailwind CSS / Vanilla CSS

---

## 🚀 Getting Started

To run the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/tasbirkabir/ROOH.git
   cd ROOH
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```

---

## 🤍 Dedication

*To the girl who acts strong when she's hurting, yet carries the softest heart I've ever known.*  
*ROOH belongs to you, Ruhi. 🤍🌙*  
*© 2026 Tasbir. Made with love, reserved for my future doctor.*