/**
 * Component Dependencies
 */
import { CeExpressPayment } from '@checkout-engine/components-react';
import { Disabled } from '@wordpress/components';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export default ( { attributes } ) => {
	const { divider_text } = attributes;
	return (
		<Disabled>
			<CeExpressPayment dividerText={divider_text}></CeExpressPayment>
		</Disabled>
	);
};
