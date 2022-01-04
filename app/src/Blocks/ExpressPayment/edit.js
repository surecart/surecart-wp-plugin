/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Disabled } from '@wordpress/components';

/**
 * Component Dependencies
 */
import { CeExpressPayment } from '@checkout-engine/react';

export default ( { attributes } ) => {
	const { divider_text } = attributes;
	return (
		<Disabled>
			<CeExpressPayment>{ divider_text }</CeExpressPayment>
		</Disabled>
	);
};
