import { createStore } from '@stencil/store';
import { Checkout } from '../../types';

interface Store {
  formId: number;
  mode: 'live' | 'test';
  locks: string[];
  checkout: Checkout;
}

const { state, onChange, on } = createStore<Store>(
  {
    formId: null,
    mode: 'live',
    locks: [],
    checkout: null,
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

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

export default state;
export { state, onChange, on };
