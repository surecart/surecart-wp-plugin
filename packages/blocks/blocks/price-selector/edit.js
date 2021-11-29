/** @jsx jsx */

import { __ } from '@wordpress/i18n';
import { Fragment, useEffect } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	TextControl,
	RangeControl,
	RadioControl,
} from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	InnerBlocks,
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { select, dispatch, useSelect } from '@wordpress/data';

import { css, jsx, Global } from '@emotion/core';
import styles from './editor-styles';

/**
 * Component Dependencies
 */
import { CePriceChoices } from '@checkout-engine/react';

export default ( { attributes, setAttributes, clientId, isSelected } ) => {
	const { label, type, columns } = attributes;

	const insertPrice = () => {
		const innerCount = select( 'core/editor' ).getBlocksByClientId(
			clientId
		)[ 0 ].innerBlocks.length;
		let block = createBlock( 'checkout-engine/price-choice' );
		dispatch( 'core/block-editor' ).insertBlock(
			block,
			innerCount,
			clientId
		);
	};

	const blockProps = useBlockProps();

	const { children, childIsSelected } = useSelect( ( select ) => {
		return {
			children: select( blockEditorStore ).getBlocksByClientId(
				clientId
			)?.[ 0 ].innerBlocks,
			childIsSelected: select( blockEditorStore ).hasSelectedInnerBlock(
				clientId,
				true
			),
		};
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			className: 'ce-choices',
			allowedBlocks: [ 'checkout-engine/price-choice' ],
			renderAppender:
				isSelected || childIsSelected
					? InnerBlocks.ButtonBlockAppender
					: false,
		}
	);

	// update children when type or children changes.
	useEffect( () => {
		if ( ! children.length ) {
			insertPrice();
		}
		children.forEach( function ( child ) {
			dispatch( blockEditorStore ).updateBlockAttributes(
				child.clientId,
				{
					type,
				}
			);
		} );
	}, [ type, children ] );

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

			<div>
				<CePriceChoices
					{ ...blockProps }
					label={ label }
					type={ type }
					columns={ columns }
				>
					<div { ...innerBlocksProps } />
				</CePriceChoices>
			</div>
		</Fragment>
	);
};
