import state, { onChange } from './store';
import { state as selectedProcessor, onChange as onChangeProcessor } from '../selected-processor';
import { onChange as onChangeCheckout } from '../checkout';
import { availableManualPaymentMethods, availableProcessors } from './getters';

/**
 * Look through available processors and maybe switch if the processor has been removed.
 */
const maybeUpdateProcessor = () => {
  // get array of manual and regular processors ids.
  const ids = [...availableProcessors().map(({ processor_type }) => processor_type), ...availableManualPaymentMethods().map(({ id }) => id)];
  // selected processor is available.
  if (ids.includes(selectedProcessor.id)) return;
  // set to first if we have one, otherwise unset.
  selectedProcessor.id = ids?.length ? ids?.[0] : null;
};

/**
 * Look through available methods and maybe switch if the processor has been removed.
 */
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
onChangeProcessor('id', () => maybeUpdateProcessor());

// when processors and methods are first loaded, select first one.
onChange('processors', () => maybeUpdateProcessor());
onChange('methods', () => maybeUpdateMethod());
