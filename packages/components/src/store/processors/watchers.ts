/**
 * Internal dependencies.
 */
import { onChange as onChangeCheckout } from '../checkout';
import { onChange as onChangeProcessor, state as selectedProcessor } from '../selected-processor';
import { availableManualPaymentMethods, availableMethodTypes, availableProcessors } from './getters';
import { onChange } from './store';

/**
 * Look through available processors and maybe switch if the processor has been removed.
 */
const maybeUpdateProcessor = () => {
  // get array of manual and regular processors ids.
  const ids = [...availableProcessors().map(({ processor_type }) => processor_type), ...availableManualPaymentMethods().map(({ id }) => id)];
  // selected processor is available.
  if (ids.includes(selectedProcessor.id)) return;

  if (!window?.wp?.hooks?.applyFilters || window.wp.hooks.applyFilters('surecart_auto_select_payment_method', true)) {
    // set to first if we have one, otherwise unset.
    selectedProcessor.id = ids?.length ? ids?.[0] : null;
  }
};

/**
 * Look through available methods and maybe switch if the processor has been removed.
 */
const maybeUpdateMethod = () => {
  // get method ids.
  const ids = (availableMethodTypes() || []).map(({ id }) => id);
  // if the processor is not mollie, unset the method.
  if (selectedProcessor?.id !== 'mollie') {
    selectedProcessor.method = null;
    return;
  }
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
onChange('disabled', () => maybeUpdateProcessor());
onChange('methods', () => maybeUpdateMethod());
