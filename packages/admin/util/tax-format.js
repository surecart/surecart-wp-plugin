import { __ } from '@wordpress/i18n/build-types';

export function formatTaxDisplay(taxLabel) {
	if (!taxLabel) {
		return __('Tax', 'surecart');
	}

	return `${__('Tax')}: ${taxLabel}`;
}
