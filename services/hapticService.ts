/**
 * Haptic Feedback Service
 * Uses the Vibration API to provide tactile feedback for user interactions.
 * Note: Works primarily on Android. iOS Safari requires specific user interaction contexts
 * and may ignore navigator.vibrate in standard web views.
 */

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'error';

export const triggerHaptic = (type: HapticType = 'light') => {
  // Check for browser support
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;

  try {
    switch (type) {
      case 'light':
        // Crisp, short tap for standard buttons
        navigator.vibrate(10);
        break;
      case 'medium':
        // Slightly longer for toggles or important tabs
        navigator.vibrate(15);
        break;
      case 'heavy':
        // Noticeable thud
        navigator.vibrate(30);
        break;
      case 'success':
        // Double pulse pattern: Short-Wait-Longer
        navigator.vibrate([10, 30, 40]);
        break;
      case 'error':
        // Triple shake
        navigator.vibrate([50, 50, 50, 50, 50]);
        break;
      default:
        navigator.vibrate(10);
    }
  } catch (e) {
    // Fail silently if vibration is blocked by system
    console.debug('Haptic feedback failed', e);
  }
};