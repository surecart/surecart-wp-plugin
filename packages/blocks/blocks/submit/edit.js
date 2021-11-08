/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { CeButton } from '@checkout-engine/react';

export default ( { className, attributes, setAttributes } ) => {
	const { type, text, submit, full, size, show_total } = attributes;

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
						<ToggleControl
							label={ __(
								'Show total in button text.',
								'checkout-engine'
							) }
							checked={ show_total }
							onChange={ ( show_total ) =>
								setAttributes( { show_total } )
							}
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
							label={ __( 'Size', 'checkout_engine' ) }
							value={ size }
							onChange={ ( size ) => {
								setAttributes( { size } );
							} }
							options={ [
								{
									value: null,
									label: 'Select a Size',
									disabled: true,
								},
								{
									value: 'small',
									label: __( 'Small', 'checkout_engine' ),
								},
								{
									value: 'medium',
									label: __( 'Medium', 'checkout_engine' ),
								},
								{
									value: 'large',
									label: __( 'Large', 'checkout_engine' ),
								},
							] }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<CeButton
				type={ type }
				submit={ submit }
				{ ...( full ? { full: true } : {} ) }
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
				{ show_total && (
					<span>
						{ '\u00A0' }
						<ce-total></ce-total>
					</span>
				) }
			</CeButton>
		</div>
	);
};
