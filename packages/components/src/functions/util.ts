export function pick(o: object, ...props) {
  return Object.assign({}, ...props.map(prop => ({ [prop]: o[prop] })));
}

export function deepEqual(o1, o2) {
  return typeof o1 === 'object' && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length && Object.keys(o1).every(p => deepEqual(o1[p], o2[p]))
    : o1 === o2;
}

export function closestElement(selector, base) {
  function __closestFrom(el) {
    if (!el || el === document || el === window) return null;
    let found = el.closest(selector);
    return found ? found : __closestFrom(el.getRootNode().host);
  }
  return __closestFrom(base);
}

export function findElements(selector, base) {
  function __findFrom(el) {
    if (!el) return null;
    let found = el.querySelectorAll(selector);
    return found && found?.length ? found : __findFrom(el?.shadowRoot);
  }
  return __findFrom(base);
}

export const capitalize = s => s && s[0].toUpperCase() + s.slice(1);

export const isValidURL = str => {
  let url;

  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};

export const getValueFromUrl = (key: string) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(key);
};

export const sortByArray = (item, key, orderArray) =>
  (item || []).sort((a, b) => {
    if (orderArray.indexOf(a?.[key]) === -1) return 1;
    if (orderArray.indexOf(b?.[key]) === -1) return -1;
    return orderArray.indexOf(a?.[key]) - orderArray.indexOf(b?.[key]);
  });

export const getVariantFromValues = ({ variants, values }) => {
  const variantValueKeys = Object.keys(values);

  for (const variant of variants) {
    const variantValues = ['option_1', 'option_2', 'option_3'].map(option => variant[option]).filter(value => value !== null && value !== undefined);

    if (variantValues?.length === variantValueKeys?.length && variantValueKeys.every(key => variantValues.includes(values[key]))) {
      return variant;
    }
  }
  return null;
};

/** WP_Error from apiFetch puts the upstream HTTP status under `data.status`. */
export const isRateLimited = (error: any): boolean => error?.data?.status === 429;

/** Whole seconds from now until an absolute timestamp (ms); 0 if unset or already past. */
export const secondsUntil = (timestampMs?: number | null): number => {
  if (!timestampMs) return 0;
  return Math.max(0, Math.ceil((timestampMs - Date.now()) / 1000));
};

/**
 * The platform's resend backoff (in seconds) carried in a verification-code error.
 * Present on `blocked_duplicate` responses; returns null when absent.
 */
export const getBlockedDuplicateSeconds = (error: any): number | null => {
  const blocked = (error?.additional_errors || []).find((e: any) => e?.code === 'verification_code.email.blocked_duplicate');
  const seconds = blocked?.data?.options?.seconds;
  return seconds ? parseInt(seconds, 10) : null;
};

export const isInRange = (value, price) => {
  const valueInt = parseInt(value);
  if (!price) return true;
  if (!price?.ad_hoc_max_amount && !price?.ad_hoc_min_amount) return true;
  if (price?.ad_hoc_max_amount && valueInt > price?.ad_hoc_max_amount) return false;
  if (price?.ad_hoc_min_amount && valueInt < price?.ad_hoc_min_amount) return false;
  return true;
};
