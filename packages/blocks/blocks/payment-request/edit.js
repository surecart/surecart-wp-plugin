/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Component Dependencies
 */
import { CePaymentRequest } from '@checkout-engine/react';

export default ( { className, attributes, setAttributes } ) => {
	const { divider_text } = attributes;
	return <CePaymentRequest>{ divider_text }</CePaymentRequest>;
};
