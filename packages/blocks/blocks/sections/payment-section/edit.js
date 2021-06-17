/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import {
	CeFormRow,
	CeStripeElement,
	CeSecureNotice,
	CeFormSection,
} from '@checkout-engine/react';

export default ( { attributes, setAttributes } ) => {
	const { label, description } = attributes;

	return (
		<CeFormSection>
			<RichText
				slot="label"
				aria-label={ __( 'Label' ) }
				placeholder={ __( 'Add a title' ) }
				value={ label }
				onChange={ ( value ) => setAttributes( { label: value } ) }
				withoutInteractiveFormatting
				allowedFormats={ [ 'core/bold', 'core/italic' ] }
			/>
			<CeSecureNotice slot="description">
				<RichText
					aria-label={ __( 'Description' ) }
					placeholder={ __( 'Add a description' ) }
					value={ description }
					onChange={ ( value ) =>
						setAttributes( { description: value } )
					}
					withoutInteractiveFormatting
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>
			</CeSecureNotice>

			<CeFormRow>
				<CeStripeElement publishable-key="pk_test_51IGqEQFOGhs5FBqkukQRgXOUWl4zEUF8t9NAEz9QdTozrZ9QlWNXbKROsKICnpY808sEfhZYLfSAeSX3arrT8A6K00gf5F5845"></CeStripeElement>
			</CeFormRow>
		</CeFormSection>
	);
};
