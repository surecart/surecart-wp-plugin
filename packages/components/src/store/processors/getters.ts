import { sortByArray } from '../../functions/util';
import state from './store';
import { state as checkoutState } from '@store/checkout';

/**
 * Gets a sorted array of available processors based on
 * checkout mode, recurring requirements, and if mollie is enabled.
 */
export const availableProcessors = () =>
  sortByArray(state.processors, 'processor_type', state.sortOrder.processors) // sort.
    .filter(processor => processor?.live_mode === (checkoutState?.mode === 'live')) // match mode.
    .filter(processor => !(state.disabled.processors || []).includes(processor.processor_type)) // make sure it's not disabled.
    .filter(processor => (!!checkoutState?.checkout?.reusable_payment_method_required ? !!processor?.recurring_enabled : true)) // recurring.
    .filter((processor, _, filtered) => (filtered.some(p => p.processor_type === 'mollie') ? processor.processor_type === 'mollie' : true)); // only allow mollie if preset.

/**
 * Gets an available processor type.
 */
export const getAvailableProcessor = (type: string) => availableProcessors().find(({ processor_type }) => processor_type === type);

/**
 * Get a sorted array of manual payment methods
 * based on recurring requirements.
 */
export const availableManualPaymentMethods = () =>
  !checkoutState?.checkout?.reusable_payment_method_required
    ? sortByArray(state.manualPaymentMethods, 'id', state.sortOrder.manualPaymentMethods).filter(processor => !(state.disabled.processors || []).includes(processor?.id))
    : [];

/**
 * Get a sorted array of mollie payment method types.
 */
export const availableMethodTypes = () => sortByArray(state.methods, 'id', state.sortOrder.paymentMethods.mollie);

/**
 * Get a combined available processor choices (processors + manual payment methods)
 */
export const availableProcessorChoices = () => [...availableProcessors(), ...availableManualPaymentMethods()];

/**
 * Do we have multiple processors.
 */
export const hasMultipleProcessorChoices = () => availableProcessorChoices()?.length > 1;

/**
 * Get a combined available payment methods (method types + manual payment methods)
 */
export const availableMethodChoices = () => [...availableMethodTypes(), ...availableManualPaymentMethods()];

/**
 * Do we have multiple payment methods.
 */
export const hasMultipleMethodChoices = () => availableMethodChoices()?.length > 1;
