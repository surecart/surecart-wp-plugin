import { __ } from '@wordpress/i18n/build-types';

export function formatTaxDisplay(taxLabel) {
	return `${__('Tax')}: ${taxLabel || ''}`;
}
