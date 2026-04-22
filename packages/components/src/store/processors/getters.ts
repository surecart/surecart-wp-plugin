import { sortByArray } from '../../functions/util';
import state from './store';
import { state as checkoutState } from '@store/checkout';
import { state as selectedProcessor } from '@store/selected-processor';

/**
 * Processors that use the method-types endpoint and expose a method selector.
 */
export const METHOD_AWARE_PROCESSORS = ['mollie', 'razorpay'] as const;

/**
 * Type guard for method-aware processors.
 */
export const isMethodAwareProcessor = (id?: string | null): id is (typeof METHOD_AWARE_PROCESSORS)[number] => !!id && (METHOD_AWARE_PROCESSORS as readonly string[]).includes(id);

/**
 * Gets a sorted array of available processors based on
 * checkout mode, recurring requirements, and if mollie is enabled.
 */
export const availableProcessors = () =>
  sortByArray(state.processors, 'processor_type', state.sortOrder.processors) // sort.
    .filter(processor => processor?.live_mode === (checkoutState?.mode === 'live')) // match mode.
    .filter(processor => !(state.disabled.processors || []).includes(processor.processor_type)) // make sure it's not disabled.
    .filter(processor => (!!checkoutState?.checkout?.reusable_payment_method_required ? !!processor?.recurring_enabled : true)) // recurring.
    .filter((processor, _, filtered) => (filtered.some(p => p.processor_type === 'mollie') ? processor.processor_type === 'mollie' || processor.processor_type === 'mock' : true)); // only allow mollie if preset.

/**
 * Gets the processor by type
 *
 * @param {string} type The processor type.
 *
 * @returns {Object | null} The processor data.
 */
export const getProcessorByType = (type: string) => availableProcessors().find(({ processor_type }) => processor_type === type);

/**
 * Gets an available processor type.
 */
export const getAvailableProcessor = (type: string) => availableProcessors().find(({ processor_type }) => processor_type === type);

/**
 * Check if there is any available credit card processor except the given processor type.
 */
export const hasOtherAvailableCreditCardProcessor = (type: string) =>
  availableProcessors().some(({ processor_type }) => processor_type !== type && 'paypal' !== processor_type && 'mock' !== processor_type);

/**
 * Get a sorted array of manual payment methods
 * based on recurring requirements.
 */
export const availableManualPaymentMethods = () =>
  sortByArray(state.manualPaymentMethods, 'id', state.sortOrder.manualPaymentMethods)
    .filter(processor => !(state.disabled.processors || []).includes(processor?.id))
    .filter(processor => (!!checkoutState?.checkout?.reusable_payment_method_required ? !!processor?.reusable : true)); // recurring.

/**
 * Get a sorted array of payment method types for the currently selected method-aware processor
 * (e.g. mollie, razorpay).
 */
export const availableMethodTypes = () => {
  const processorId = selectedProcessor?.id;
  const sortKey = isMethodAwareProcessor(processorId) ? state.sortOrder.paymentMethods[processorId] : [];
  return sortByArray(state.methods, 'id', sortKey || []).filter(method => {
    if (method.id === 'applepay') {
      return (window as any)?.ApplePaySession && (window as any)?.ApplePaySession?.canMakePayments?.();
    }
    return true;
  });
};

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
export const availableMethodChoices = () => [...availableMethodTypes(), ...availableManualPaymentMethods(), ...[getProcessorByType('mock')]].filter(Boolean);

/**
 * Do we have multiple payment methods.
 */
export const hasMultipleMethodChoices = () => availableMethodChoices()?.length > 1;
