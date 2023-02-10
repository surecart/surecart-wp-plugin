import { createStore } from '@stencil/store';

import selectedProcessor from './selected-processor';

const { state, onChange } = createStore<any>(
  () => ({
    processors: [],
    methods: [],
    loadingMethods: false,
  }),
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

/**
 * This handles when a selected processor is no longer available.
 */
onChange('processors', () => {
  // get method ids.
  const ids = (state.processors || []).map(({ id }) => id);
  // we don't have any methods.
  if (!ids?.length) return;
  // if the current method is not available, set the first method.
  if (!ids.includes(selectedProcessor.id) && ids?.length) {
    selectedProcessor.id = ids?.[0];
  }
});

/**
 * This handles when a selected method is no longer available.
 */
onChange('methods', () => {
  // get method ids.
  const methodIds = (state.methods || []).map(({ id }) => id);
  // we don't have any methods.
  if (!methodIds?.length) return;
  // if the current method is not available, set the first method.
  if (!methodIds.includes(selectedProcessor.method) && methodIds?.length) {
    selectedProcessor.method = methodIds?.[0];
  }
});

export default state;
export { onChange };
