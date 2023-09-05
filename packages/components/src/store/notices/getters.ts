/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import state from './store';

/**
 * Get the notice title.
 *
 * @returns {String}
 */
export const getNoticeTitle = (): string => {
  return state.message;
};

/**
 * Get the error message by concatenating all the error messages in a single string.
 *
 * @returns {String}
 */
export const getErrorMessage = () => {
  // Check if we have additional errors, if yes, then process all the error messages.
  if (!!state.additional_errors?.length) {
    return state.additional_errors.map(error => error.message).join(', ');
  }

  return state.message;
};

/**
 * Get all of the error messages in an array.
 *
 * @returns {Array<String>}
 */
export const getErrorMessages = () => {
  // Check if we have additional errors, if yes, then process all the error messages.
  if (!!state.additional_errors?.length) {
    return state.additional_errors.map(error => error.message) || [];
  }

  return [state.message];
};
