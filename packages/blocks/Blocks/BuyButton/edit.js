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
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { CeButton } from '@checkout-engine/components-react';
import Placeholder from './Placeholder';

export default ( { className, attributes, setAttributes } ) => {
	const { type, label, submit, size, line_items } = attributes;

	const renderButton = () => {
		if ( ! line_items || ! line_items?.length ) {
			return <Placeholder setAttributes={ setAttributes } />;
		}

		return (
			<CeButton
				type={ type }
				submit={ submit }
				size={ size }
				type={ type }
			>
				<RichText
					aria-label={ __( 'Button text' ) }
					placeholder={ __( 'Add text…' ) }
					value={ label }
					onChange={ ( label ) => setAttributes( { label } ) }
					withoutInteractiveFormatting
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>
			</CeButton>
		);
	};

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
									value: 'text',
									label: __( 'Text Link', 'checkout_engine' ),
								},
							] }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			{ renderButton() }
		</div>
	);
};
