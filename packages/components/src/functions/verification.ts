/**
 * Verification code utility functions.
 */

/** Fallback resend window (seconds) used when the platform doesn't provide one. */
export const RESEND_COOLDOWN_SECONDS = 60;

/** Whole seconds from now until an absolute timestamp (ms); 0 if unset or already past. */
export const secondsUntil = (timestampMs?: number | null): number => {
  if (!timestampMs) return 0;
  return Math.max(0, Math.ceil((timestampMs - Date.now()) / 1000));
};

/**
 * The platform's resend backoff (in seconds) carried in a verification-code error.
 * Present on `blocked_duplicate` responses; returns null when absent or non-positive.
 */
export const getBlockedDuplicateSeconds = (error: any): number | null => {
  const blocked = (error?.additional_errors || []).find((e: any) => e?.code === 'verification_code.email.blocked_duplicate');
  const seconds = parseInt(blocked?.data?.options?.seconds, 10);
  return seconds > 0 ? seconds : null;
};

/**
 * Absolute ms timestamp when a resend becomes available, from a platform-provided
 * seconds value. Falls back to the default window when seconds are missing or <= 0,
 * so callers always end up with a concrete anchor (never an unset cooldown).
 */
export const resendAnchorFrom = (seconds?: number | null): number => Date.now() + (seconds && seconds > 0 ? seconds : RESEND_COOLDOWN_SECONDS) * 1000;
