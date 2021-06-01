/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { PrestoButton } from '@checkout-engine/react/dist/index';

export default ( { className, attributes, setAttributes } ) => {
	const { type, text, submit, full, size } = attributes;

	return (
		<div className={ className }>
			<PrestoButton
				type={ type }
				submit={ submit }
				full={ full }
				size={ size }
			>
				<RichText
					aria-label={ __( 'Button text' ) }
					placeholder={ __( 'Add text…' ) }
					value={ text }
					onChange={ ( value ) => setAttributes( { text: value } ) }
					withoutInteractiveFormatting
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>
			</PrestoButton>
		</div>
	);
};
