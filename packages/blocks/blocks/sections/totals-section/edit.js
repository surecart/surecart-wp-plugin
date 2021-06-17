/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { CeOrderSummary, CeFormSection } from '@checkout-engine/react';

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
			<RichText
				slot="description"
				aria-label={ __( 'Description' ) }
				placeholder={ __( 'Add a description' ) }
				value={ description }
				onChange={ ( value ) =>
					setAttributes( { description: value } )
				}
				withoutInteractiveFormatting
				allowedFormats={ [ 'core/bold', 'core/italic' ] }
			/>

			<CeOrderSummary></CeOrderSummary>
		</CeFormSection>
	);
};
