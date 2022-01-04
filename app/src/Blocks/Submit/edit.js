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
	const {
		type,
		text,
		submit,
		full,
		size,
		show_total,
		show_icon,
	} = attributes;

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
						<ToggleControl
							label={ __(
								'Show a secure lock icon.',
								'checkout-engine'
							) }
							checked={ show_icon }
							onChange={ ( show_icon ) =>
								setAttributes( { show_icon } )
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
				{ show_icon && (
					<svg
						slot="prefix"
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={ 2 }
							d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
						/>
					</svg>
				) }
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
