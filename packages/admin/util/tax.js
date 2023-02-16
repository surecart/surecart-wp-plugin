import { __ } from '@wordpress/i18n';

export const formatTaxDisplay = (taxLabel) =>
	!taxLabel ? __('Tax', 'surecart') : `${__('Tax')}: ${taxLabel}`;
