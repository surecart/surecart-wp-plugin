import { on } from './store';

export const listenTo = (prop, propKey: string | string[], callback) =>
  on('set', (key, newValue, oldValue) => {
    // ignore non-keys
    if (key !== prop) return;

    // handle an array, if one has changed, run callback.
    if (Array.isArray(propKey)) {
      if (propKey.some(key => JSON.stringify(newValue?.[key]) !== JSON.stringify(oldValue?.[key]))) {
        return callback(newValue, oldValue);
      }
    }

    // handle string.
    if (typeof propKey === 'string') {
      if (JSON.stringify(newValue?.[propKey]) === JSON.stringify(oldValue?.[propKey])) return;
      return callback(newValue?.[propKey], oldValue?.[propKey]);
    }
  });
