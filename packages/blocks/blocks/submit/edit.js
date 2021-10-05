/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { CeButton } from '@checkout-engine/react';

export default ( { className, attributes, setAttributes } ) => {
	const { type, text, submit, full, size } = attributes;

	return (
		<div className={ className }>
			<InspectorControls>
				<PanelBody title={ __( 'Attributes', 'checkout-engine' ) }>
					<PanelRow>
						<TextControl
							label={ __( 'Button Text', 'checkout-engine' ) }
							value={ text }
							onChange={ ( text ) => setAttributes( { text } ) }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __( 'Full', 'checkout-engine' ) }
							checked={ full }
							onChange={ ( full ) => setAttributes( { full } ) }
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={ __( 'Size', 'checkout-engine' ) }
							value={ size }
							onChange={ ( size ) => setAttributes( { size } ) }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<CeButton
				type={ type }
				submit={ submit }
				full={ !! full }
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
			</CeButton>
		</div>
	);
};
