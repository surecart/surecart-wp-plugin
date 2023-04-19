import state from './store';
/**
 * Get a line item by product id.
 */
export const currentFormState = () => state.formState.value;

/**
 * Is the form loading.
 */
export const formLoading = () => state.formState.value === 'loading';

/**
 * Is the form busy.
 */
export const formBusy = () => ['updating', 'finalizing', 'paying', 'confirming'].includes(state.formState.value);

/**
 * Is the form paying
 */
export const formPaying = () => ['finalizing', 'paying', 'confirming'].includes(state.formState.value);
