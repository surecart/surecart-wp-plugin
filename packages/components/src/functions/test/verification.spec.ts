import { secondsUntil, getBlockedDuplicateSeconds, resendAnchorFrom, RESEND_COOLDOWN_SECONDS } from '../verification';

describe('secondsUntil', () => {
  it('returns 0 for unset values', () => {
    expect(secondsUntil(null)).toBe(0);
    expect(secondsUntil(undefined)).toBe(0);
    expect(secondsUntil(0)).toBe(0);
  });

  it('returns 0 for a timestamp in the past', () => {
    expect(secondsUntil(Date.now() - 10_000)).toBe(0);
  });

  it('returns the whole seconds remaining for a future timestamp', () => {
    expect(secondsUntil(Date.now() + 30_000)).toBeGreaterThan(28);
    expect(secondsUntil(Date.now() + 30_000)).toBeLessThanOrEqual(30);
  });
});

describe('getBlockedDuplicateSeconds', () => {
  const makeError = (seconds: any) => ({
    additional_errors: [{ code: 'verification_code.email.blocked_duplicate', data: { options: { seconds } } }],
  });

  it('reads seconds from a blocked_duplicate error', () => {
    expect(getBlockedDuplicateSeconds(makeError('240'))).toBe(240);
    expect(getBlockedDuplicateSeconds(makeError(120))).toBe(120);
  });

  it('returns null when the error has no blocked_duplicate entry', () => {
    expect(getBlockedDuplicateSeconds({ additional_errors: [{ code: 'other' }] })).toBeNull();
    expect(getBlockedDuplicateSeconds({})).toBeNull();
    expect(getBlockedDuplicateSeconds(null)).toBeNull();
  });

  it('returns null when seconds are missing or zero', () => {
    expect(getBlockedDuplicateSeconds(makeError('0'))).toBeNull();
    expect(getBlockedDuplicateSeconds(makeError(undefined))).toBeNull();
  });
});

describe('resendAnchorFrom', () => {
  it('anchors from a provided seconds value', () => {
    const anchor = resendAnchorFrom(200);
    expect(secondsUntil(anchor)).toBeGreaterThan(198);
    expect(secondsUntil(anchor)).toBeLessThanOrEqual(200);
  });

  it('falls back to the default window when seconds are missing or invalid', () => {
    for (const bad of [null, undefined, 0, -5]) {
      const anchor = resendAnchorFrom(bad as any);
      expect(secondsUntil(anchor)).toBeGreaterThan(RESEND_COOLDOWN_SECONDS - 2);
      expect(secondsUntil(anchor)).toBeLessThanOrEqual(RESEND_COOLDOWN_SECONDS);
    }
  });
});
