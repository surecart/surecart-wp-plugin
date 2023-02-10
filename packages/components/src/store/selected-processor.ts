import { createStore } from '@stencil/store';

const { state, onChange } = createStore<any>(
  () => ({
    id: '',
    method: '',
    manual: false,
  }),
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

// handle manual processors
onChange('id', () => {
  state.manual = !['paypal', 'stripe', 'mollie'].includes(state.id);
});

export default state;
export { onChange };
