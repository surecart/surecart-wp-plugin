/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import state from './store';

/**
 * Get all of the error messages by concatenating comma separated strings.
 *
 * @returns {String}
 */
export const getAdditionalErrorMessages = () => (state?.additional_errors || []).map(error => error.message).join(', ');
