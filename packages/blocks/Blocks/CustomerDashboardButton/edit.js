/** @jsx jsx */
import { css, jsx } from '@emotion/core';
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
import { CeButton } from '@checkout-engine/components-react';
import Placeholder from './Placeholder';

export default ( { className, attributes, setAttributes } ) => {
	const { type, label, submit, size, show_icon } = attributes;

	return (
		<div className={ className } css={ css`` }>
			<InspectorControls>
				<PanelBody title={ __( 'Attributes', 'checkout-engine' ) }>
					<PanelRow>
						<TextControl
							label={ __( 'Button Text', 'checkout-engine' ) }
							value={ label }
							onChange={ ( label ) => setAttributes( { label } ) }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							checked={ show_icon }
							label={ __( 'Show Icon', 'checkout-engine' ) }
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
					<PanelRow>
						<SelectControl
							label={ __( 'Type', 'checkout_engine' ) }
							value={ type }
							onChange={ ( type ) => {
								setAttributes( { type } );
							} }
							options={ [
								{
									value: 'primary',
									label: __( 'Button', 'checkout_engine' ),
								},
								{
									value: 'info',
									label: __( 'Info', 'checkout_engine' ),
								},
							] }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<CeButton
				type={ type }
				submit={ submit }
				size={ size }
				type={ type }
			>
				{ show_icon && (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						slot="prefix"
						width="18"
						height="18"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={ 2 }
							d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				) }

				<RichText
					aria-label={ __( 'Button text' ) }
					placeholder={ __( 'Add text…' ) }
					value={ label }
					onChange={ ( label ) => setAttributes( { label } ) }
					withoutInteractiveFormatting
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>
			</CeButton>
		</div>
	);
};
