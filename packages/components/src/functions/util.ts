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

export const getVariantFromValues = ({variants, values}) => {
  const variantValueKeys = Object.keys(values);
  let matchedVariant = '';
  for (const variant of variants) {
    const variantValues = (variant?.variant_values?.data || [])?.map(({ id }) => id);
    if (
      variantValues.length === variantValueKeys.length &&
      variantValueKeys.every(key => variantValues.includes(values[key]))
    ) {
      matchedVariant = variant.id;
      break;
    }
  }
  return matchedVariant;
}