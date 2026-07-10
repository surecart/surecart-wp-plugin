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
 * seconds value.
 *
 * - `null`/`undefined` means the window is unknown → fall back to the default so
 *   callers always get a concrete anchor (never an unset cooldown).
 * - A numeric `0` (or negative) is a real "available now" signal (e.g. the window
 *   lapsed by the time the request resolved) → anchor at now so the resend link
 *   shows immediately instead of imposing another full cooldown.
 */
export const resendAnchorFrom = (seconds?: number | null): number => {
  const window = seconds == null ? RESEND_COOLDOWN_SECONDS : Math.max(0, seconds);
  return Date.now() + window * 1000;
};
