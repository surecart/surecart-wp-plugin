import { ScNoticeStore } from '../types';

/**
 * Get any additional error messages.
 */
export const getAdditionalErrorMessages = error => (error?.additional_errors || []).map(error => error.message);

/**
 * Get the top level error
 */
export const getTopLevelError = (error: ScNoticeStore) => {
  // checkout invalid is not friendly.
  if (error?.code === 'checkout.invalid' && getAdditionalErrorMessages(error)?.length) {
    return '';
  }
  return error?.message;
};
