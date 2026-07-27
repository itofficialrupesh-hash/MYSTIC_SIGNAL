import { supabaseService } from './supabase';

// Helper to get browser info
function getBrowserName(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Trident')) return 'Internet Explorer';
  if (ua.includes('Edge') || ua.includes('Edg')) return 'Microsoft Edge';
  if (ua.includes('Chrome')) return 'Google Chrome';
  if (ua.includes('Safari')) return 'Apple Safari';
  return 'Unknown Browser';
}

// Helper to get device category
function getDeviceCategory(): string {
  const ua = navigator.userAgent;
  const width = window.innerWidth;
  
  if (/tablet|ipad|playbook|silk/i.test(ua) || (width >= 768 && width <= 1024)) {
    return 'Tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|webos/i.test(ua) || width < 768) {
    return 'Mobile';
  }
  return 'Desktop';
}

// Helper to retrieve or initialize a persistent Session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('ruu_chat_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2, 11);
    sessionStorage.setItem('ruu_chat_session_id', sessionId);
    
    // Log session start
    const browser = getBrowserName();
    const device = getDeviceCategory();
    supabaseService.activityLogs.log('Session Started', `Device: ${device}, Browser: ${browser}`);
  }
  return sessionId;
}

/**
 * Reusable function to log user interactions to Supabase & LocalStorage.
 * Saves activity name, current page title/hash, browser, device, and unique session ID.
 * 
 * Usage:
 *   import { logActivity } from '../lib/activityLogger';
 *   logActivity("Opened Gallery");
 * 
 * @param activityName The name of the action performed by the user
 * @param extraDetails Optional description/payload
 */
export function logActivity(activityName: string, extraDetails: string = ''): void {
  const browser = getBrowserName();
  const device = getDeviceCategory();
  const sessionId = getSessionId();
  const pageName = document.title || window.location.pathname || 'Our Secret Sanctuary';

  // Construct the payload matching the required db schema
  const payload = {
    activity: activityName,
    page: pageName,
    browser: browser,
    device: device,
    session_id: sessionId,
    details: extraDetails
  };

  // Log to Supabase using our extended logging service
  supabaseService.activityLogs.log(activityName, JSON.stringify(payload)).catch(err => {
    console.warn("Supabase activity logging failed, running fallback:", err);
  });
}
