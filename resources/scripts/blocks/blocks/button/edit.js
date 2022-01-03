/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { CeButton } from '@checkout-engine/react';

export default ( { className, attributes, setAttributes } ) => {
	const { type, text, submit, full, size } = attributes;

	return (
		<div className={ className }>
			<CeButton type={ type } full={ full } size={ size }>
				<RichText
					aria-label={ __( 'Button text' ) }
					placeholder={ __( 'Add text…' ) }
					value={ text }
					onChange={ ( value ) => setAttributes( { text: value } ) }
					withoutInteractiveFormatting
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>
			</CeButton>
		</div>
	);
};
