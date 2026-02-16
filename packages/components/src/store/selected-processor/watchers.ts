import state, { onChange } from './store';

// handle manual processors
onChange('id', () => {
  state.manual = !!state?.id && !['paypal', 'stripe', 'mollie', 'paystack', 'razorpay', 'mock'].includes(state.id);
});
