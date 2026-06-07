// Web Push Notification Helper via OneSignal SDK client integration

interface OneSignalType {
  init(config: { appId: string; allowLocalhostAsSecureOrigin?: boolean }): Promise<void>;
  showSlidedownPrompt(): Promise<void>;
  push(fn: () => void): void;
}

// Global OneSignal object declaration helper
declare global {
  interface Window {
    OneSignal?: OneSignalType[];
  }
}

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '';

/**
 * Initialize OneSignal web push SDK safely on the browser client
 */
export async function initializeOneSignal(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const OneSignal = (window.OneSignal || []) as unknown as OneSignalType;

    // Check if script is already present and initialized
    if (!ONESIGNAL_APP_ID) {
      console.warn('⚠️ ROOH OneSignal Warning: NEXT_PUBLIC_ONESIGNAL_APP_ID is not configured.');
      return;
    }

    // Load OneSignal SDK dynamically
    if (!document.getElementById('onesignal-sdk')) {
      const script = document.createElement('script');
      script.id = 'onesignal-sdk';
      script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
      script.defer = true;
      document.head.appendChild(script);
    }
  } catch (error) {
    console.error('Failed to configure OneSignal notifications:', error);
  }
}

/**
 * Trigger study break reminder push notification mock API
 */
export function triggerBreakReminder(minutes: number): void {
  if (typeof window === 'undefined') return;

  console.log(`[OneSignal Push Trigger] Break prompt: "Ruhi, you've studied for ${minutes} minutes straight. Time to stretch and drink some water 🌸"`);

  // Request browser Notification API permissions fallback if OneSignal client is in sandbox
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('ROOH Sanctuary 🌸', {
      body: `Ruhi, you've studied for ${minutes} minutes straight. Time to stretch and drink some water.`,
      icon: '/icons/icon-192x192.png'
    });
  }
}

/**
 * Trigger custom motivation alert
 */
export function triggerCustomMotivation(message: string): void {
  if (typeof window === 'undefined') return;

  console.log(`[OneSignal Push Trigger] Motivation alert: "${message}"`);

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('ROOH Reassurance ✨', {
      body: message,
      icon: '/icons/icon-192x192.png'
    });
  }
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}
