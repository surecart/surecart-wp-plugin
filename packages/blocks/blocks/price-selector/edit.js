/** @jsx jsx */

import { __ } from '@wordpress/i18n';
import { useState, Fragment, useEffect } from '@wordpress/element';
import {
	Button,
	Placeholder,
	PanelBody,
	PanelRow,
	TextControl,
	RangeControl,
	ToggleControl,
	RadioControl,
} from '@wordpress/components';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { buttons as icon } from '@wordpress/icons';
import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect, select, dispatch, useDispatch } from '@wordpress/data';

import { css, jsx, Global } from '@emotion/core';
import styles from './editor-styles';

/**
 * Component Dependencies
 */
import { CePriceChoices } from '@checkout-engine/react';
import SelectProduct from '../checkout/components/SelectProduct';

export default ( { attributes, setAttributes, isSelected, clientId } ) => {
	const { choices, label, type, columns } = attributes;
	const [ open, setOpen ] = useState( false );

	// check if inner block is selected
	const childSelected = useSelect( ( select ) =>
		select( blockEditorStore ).hasSelectedInnerBlock( clientId, true )
	);

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			className: 'ce-choices',
			allowedBlocks: [ 'checkout-engine/price-choice' ],
		}
	);

	const blockProps = useBlockProps( {
		// style: {
		// 	display: 'block',
		// 	borderRadius: '4px',
		// 	transition: 'all 0.2s ease',
		// 	border:
		// 		( childSelected || isSelected ) &&
		// 		'1px dashed rgba(0,0,0,0.35)',
		// 	padding: childSelected || isSelected ? '2em' : 0,
		// },
	} );

	const { replaceInnerBlocks } = useDispatch( blockEditorStore );

	// update children when type changes.
	useEffect( () => {
		const children = select( blockEditorStore ).getBlocksByClientId(
			clientId
		)?.[ 0 ].innerBlocks;
		children.forEach( function ( child ) {
			dispatch( blockEditorStore ).updateBlockAttributes(
				child.clientId,
				{
					type,
				}
			);
		} );
	}, [ type ] );

	const createTemplateFromChoices = ( choices ) => {
		return choices.map( ( choice, index ) => {
			return [
				'checkout-engine/price-choice',
				{
					price_id: choice.id,
					quantity: 1,
					checked: index === 0,
				},
			];
		} );
	};

	const onAddProduct = ( choices ) => {
		setAttributes( { choices } );
		replaceInnerBlocks(
			clientId,
			createBlocksFromInnerBlocksTemplate(
				createTemplateFromChoices( choices )
			),
			false
		);
	};

	if ( ! choices?.length ) {
		return (
			<Fragment>
				<Placeholder
					icon={ icon }
					instructions={ __(
						'Get started by selecting a form or start build a new form.',
						'checkout_engine'
					) }
					label={ __( 'Price Choices', 'checkout_engine' ) }
				>
					<div>
						<Button isPrimary onClick={ () => setOpen( true ) }>
							{ __( 'Add Product', 'checkout_engine' ) }
						</Button>
						<Button isSecondary onClick={ () => setOpen( true ) }>
							{ __( 'Create Product', 'checkout_engine' ) }
						</Button>
					</div>
				</Placeholder>
				{ open && (
					<SelectProduct
						onChoose={ onAddProduct }
						onRequestClose={ () => setOpen( false ) }
					/>
				) }
			</Fragment>
		);
	}

	return (
		<Fragment>
			<Global styles={ styles } />
			<InspectorControls>
				<PanelBody title={ __( 'Attributes', 'checkout-engine' ) }>
					<PanelRow>
						<TextControl
							label={ __( 'Label', 'checkout-engine' ) }
							value={ label }
							onChange={ ( label ) => setAttributes( { label } ) }
						/>
					</PanelRow>
					<PanelRow>
						<RadioControl
							label={ __( 'Type', 'checkout_engine' ) }
							help="The type of product selection"
							selected={ type }
							options={ [
								{
									label: __( 'Choose one', 'checkout_egine' ),
									value: 'radio',
								},
								{
									label: __(
										'Choose many',
										'checkout_engine'
									),
									value: 'checkbox',
								},
							] }
							onChange={ ( type ) => setAttributes( { type } ) }
						/>
					</PanelRow>
					<PanelRow>
						<RangeControl
							label={ __( 'Columns', 'checkout_engine' ) }
							value={ columns }
							onChange={ ( columns ) =>
								setAttributes( { columns } )
							}
							min={ 1 }
							max={ 3 }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<CePriceChoices
				{ ...blockProps }
				label={ label }
				type={ type }
				columns={ columns }
			>
				<div { ...innerBlocksProps } />
			</CePriceChoices>
		</Fragment>
	);
};
