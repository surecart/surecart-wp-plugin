import state, { onChange } from './store';
import selectedProcessor from '../selected-processor';
import { onChange as onChangeCheckout } from '../checkout';
import { availableManualPaymentMethods, availableProcessors } from './getters';

const maybeUpdateProcessor = () => {
  // get array of manual and regular processors ids.
  const ids = [...availableProcessors().map(({ processor_type }) => processor_type), ...availableManualPaymentMethods().map(({ id }) => id)];
  // selected processor is available.
  if (ids.includes(selectedProcessor.id)) return;
  // set to first if we have one, otherwise unset.
  selectedProcessor.id = ids?.length ? ids?.[0] : null;
};

const maybeUpdateMethod = () => {
  // get method ids.
  const ids = (state.methods || []).map(({ id }) => id);
  // selected method is available
  if (ids.includes(selectedProcessor.method)) return;
  // if the current method is not available, set the first method.
  selectedProcessor.method = ids?.length ? ids?.[0] : null;
};

// when the checkout changes, maybe update selection.
onChangeCheckout('checkout', () => {
  maybeUpdateProcessor();
  maybeUpdateMethod();
});

// when processors and methods are first loaded, select first one.
onChange('processors', () => maybeUpdateProcessor());
onChange('methods', () => maybeUpdateMethod());
