/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

export const refundReasons = {
	duplicate: __('Duplicate', 'surecart'),
	fraudulent: __('Fraudulent', 'surecart'),
	requested_by_customer: __('Requested By Customer', 'surecart'),
};

export const refundResasonOptions = Object.keys(refundReasons).map((key) => ({
	value: key,
	label: refundReasons[key],
}));
