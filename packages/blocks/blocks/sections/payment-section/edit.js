/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import {
	CeFormRow,
	CeStripeElement,
	CeSecureNotice,
	CeFormSection,
} from '@checkout-engine/react';

export default ( { className, attributes, setAttributes, isSelected } ) => {
	return (
		<CeFormSection label="Card Details">
			<CeSecureNotice slot="description">
				This is a secure, encrypted payment.
			</CeSecureNotice>

			<CeFormRow>
				<CeStripeElement publishable-key="pk_test_51IGqEQFOGhs5FBqkukQRgXOUWl4zEUF8t9NAEz9QdTozrZ9QlWNXbKROsKICnpY808sEfhZYLfSAeSX3arrT8A6K00gf5F5845"></CeStripeElement>
			</CeFormRow>
		</CeFormSection>
	);
};
