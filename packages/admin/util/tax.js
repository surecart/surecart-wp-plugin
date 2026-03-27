import { __ } from '@wordpress/i18n';

export const formatTaxDisplay = (taxLabel, estimated = false) => {
	const label = estimated
		? __('Estimated Tax', 'surecart')
		: __('Tax', 'surecart');
	return !taxLabel ? label : `${label}: ${taxLabel}`;
};
