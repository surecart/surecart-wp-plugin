/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { CeFormSection } from '@checkout-engine/react';

export default ( { className, attributes, setAttributes, isSelected } ) => {
	const { label, description } = attributes;

	return (
		<CeFormSection label={ label } className={ className }>
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
			<InnerBlocks
				allowedBlocks={ [
					'checkout-engine/submit',
					'checkout-engine/email',
					'checkout-engine/input',
				] }
			/>
		</CeFormSection>
	);
};
