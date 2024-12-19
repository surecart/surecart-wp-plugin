/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

export const refundReasons = {
	duplicate: __('Duplicate'),
	fraudulent: __('Fraudulent'),
	requested_by_customer: __('Requested By Customer'),
	unknown: __('Unknown'),
};

export const refundResasonOptions = Object.keys(refundReasons).map((key) => ({
	value: key,
	label: refundReasons[key],
}));
