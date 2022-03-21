/**
 * Component Dependencies
 */
import { ScExpressPayment } from '@surecart/components-react';
import { Disabled } from '@wordpress/components';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export default ({ attributes }) => {
	const { divider_text } = attributes;
	return (
		<Disabled>
			<ScExpressPayment
				dividerText={divider_text}
				debug
			></ScExpressPayment>
		</Disabled>
	);
};
