import state, { onChange } from './store';

// handle manual processors
onChange('id', () => {
  state.manual = !['paypal', 'stripe', 'mollie'].includes(state.id);
});
