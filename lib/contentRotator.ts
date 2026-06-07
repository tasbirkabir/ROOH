// Seeded daily content rotator utility for Ruhi's ROOH Sanctuary

const DAILY_AFFIRMATIONS = [
  "You are enough, Ruhi. One step is still progress.",
  "Your worth is not measured by the number of pages you read today.",
  "Deep breaths. You have solved hard problems before, and you will solve this too.",
  "Taking care of your mind is just as important as studying medicine.",
  "Trust your journey. You are growing into a wonderful, healing presence.",
  "You do not have to be perfect to be a great physician. Be caring, be you.",
  "Rest is not a reward for work; it is a prerequisite for life.",
  "One exam does not define your capability or your heart.",
  "You are doing the best you can, and that is more than enough.",
  "Slow down, stretch your shoulders, and remind yourself: you are exactly where you need to be.",
  "Focus on the next 10 minutes. The rest will unfold naturally.",
  "Your empathy is your greatest clinical tool. Protect it by being kind to yourself.",
  "Inhale peace, exhale pressure. You are doing beautiful work.",
  "It is okay to ask for help. Even the strongest hearts need a place to rest.",
  "Your voice is calming, your eyes are kind, and your capacity to learn is vast.",
  "Believe in the silent, daily steps you are taking. They are moving you forward.",
  "Ruhi, remember to speak to yourself with the same love you would give a dear friend.",
  "Every chapter you read adds to the future physician you are becoming.",
  "Give yourself permission to pause. The books will wait; your peace matters first.",
  "You are a force of healing. Start by healing your own mind with gentleness today."
];

const COMFORT_CARDS = [
  {
    category: "Study Stress",
    title: "The Books Will Wait 📚",
    content: "If the anatomy diagrams are blurring, close the book. The cells inside you need rest more than the cells on the page need memorization. Sleep is productive."
  },
  {
    category: "Exam Anxiety",
    title: "Beyond the Scores 🎯",
    content: "No exam test score can measure the warmth of your hands, the kindness of your words, or the depth of your care. You are not a number."
  },
  {
    category: "Self Doubt",
    title: "Imposter Syndrome is a Lie 🧠",
    content: "You earned your place here. Every struggle you face is not proof that you don't belong; it's proof that you are learning something challenging."
  },
  {
    category: "Burnout",
    title: "Pace Over Speed 🌸",
    content: "A candle that burns twice as bright burns half as long. Pacing yourself is how you protect your long-term passion to heal."
  },
  {
    category: "Loneliness",
    title: "Connected in Spirit 🤍",
    content: "Even in the quietest hours of study, know that you are deeply loved and missed. You are building a future, and we are right beside you."
  },
  {
    category: "Motivation",
    title: "The Empathy Advantage ✨",
    content: "Your patience and care will heal more people than your exam scores ever will. Remember the human at the end of the text."
  },
  {
    category: "Study Stress",
    title: "One Page at a Time 📖",
    content: "Don't look at the mountain of pathology lectures. Just read the next paragraph. You don't need to cross the finish line today; just take one step."
  },
  {
    category: "Self Doubt",
    title: "You are the Answer 🌸",
    content: "Your patient won't care if you got a perfect score. They will care that you listened, that you saw them, and that you cared. You already have that gift."
  }
];

// Generate a deterministic integer seed based on date string (YYYY-MM-DD)
function getSeedForDate(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

// Seeded pseudorandom index selector
function selectSeededIndex(arrayLength: number, seed: number): number {
  const x = Math.sin(seed) * 10000;
  const rand = x - Math.floor(x);
  return Math.floor(rand * arrayLength);
}

export function getDailyContent() {
  const todayStr = new Date().toISOString().split('T')[0];
  const seed = getSeedForDate(todayStr);

  const affirmationIndex = selectSeededIndex(DAILY_AFFIRMATIONS.length, seed);
  const comfortIndex = selectSeededIndex(COMFORT_CARDS.length, seed + 1); // offset seed for second selection

  return {
    date: todayStr,
    affirmation: DAILY_AFFIRMATIONS[affirmationIndex],
    comfortCard: COMFORT_CARDS[comfortIndex]
  };
}
