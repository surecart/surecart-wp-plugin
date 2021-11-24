/** @jsx jsx */
import { css, jsx } from '@emotion/core';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	Button,
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { CeButton } from '@checkout-engine/react';
import PriceChoices from '../checkout/components/PriceChoices';

export default ( { className, attributes, setAttributes } ) => {
	const { type, text, submit, full, size, line_items } = attributes;

	const removeLineItem = ( index ) => {
		setAttributes( {
			line_items: line_items.filter( ( item, i ) => i !== index ),
		} );
	};

	const updateLineItem = ( data, index ) => {
		setAttributes( {
			line_items: line_items.map( ( item, i ) => {
				if ( i !== index ) return item;
				return {
					...item,
					...data,
				};
			} ),
		} );
	};

	const addLineItem = () => {
		setAttributes( {
			line_items: [
				...( line_items || [] ),
				{
					quantity: 1,
				},
			],
		} );
	};

	const renderButton = () => {
		if ( ! line_items || line_items?.length ) {
			return (
				<div
					css={ css`
						font-size: 14px;
						display: grid;
						gap: 0.5em;
					` }
				>
					<PriceChoices
						choices={ line_items }
						onAddProduct={ addLineItem }
						onUpdate={ updateLineItem }
						onRemove={ removeLineItem }
						onNew={ () => {} }
					/>
					<div>
						<Button isPrimary>Done</Button>
					</div>
				</div>
			);
		}

		return (
			<CeButton type={ type } submit={ submit } size={ size }>
				<RichText
					aria-label={ __( 'Button text' ) }
					placeholder={ __( 'Add text…' ) }
					value={ text }
					onChange={ ( value ) => setAttributes( { text: value } ) }
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
							value={ text }
							onChange={ ( text ) => setAttributes( { text } ) }
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

			{ renderButton() }
		</div>
	);
};
