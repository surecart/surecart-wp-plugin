/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { CeCheckout } from '@checkout-engine/react';
import { ALLOWED_BLOCKS } from '../../blocks';
import { Fragment, useState } from '@wordpress/element';
import { parse } from '@wordpress/blocks';
import {
	PanelRow,
	PanelBody,
	Button,
	SelectControl,
	Dropdown,
} from '@wordpress/components';

import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import * as templates from '../../templates';
import SelectProduct from '../../components/SelectProduct';
import Cart from './components/Cart';
import Settings from './components/Settings';

export default function edit( { clientId, attributes, setAttributes } ) {
	const { align, className, prices, font_size, choice_type } = attributes;
	const [ tab, setTab ] = useState( '' );
	const blockCount = useSelect( ( select ) =>
		select( blockEditorStore ).getBlockCount( clientId )
	);
	const [ template, setTemplate ] = useState( 'sections' );
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );
	const changeTemplate = async () => {
		replaceInnerBlocks(
			clientId,
			createBlocksFromInnerBlocksTemplate(
				parse( templates[ template ] )
			),
			false
		);
	};

	const onAddProduct = ( prices ) => {
		setAttributes( { prices } );
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Form Template', 'checkout_engine' ) }>
					<PanelRow>
						<div>
							<SelectControl
								label={ __( 'Template' ) }
								value={ template }
								onChange={ ( name ) => setTemplate( name ) }
								options={ [
									{
										value: null,
										label: 'Select a Template',
										disabled: true,
									},
									{ value: 'sections', label: 'Sections' },
									{ value: 'simple', label: 'Simple' },
								] }
							/>
							<Button isPrimary onClick={ changeTemplate }>
								Change
							</Button>
						</div>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div>
				<div
					css={ css`
						padding: 10px 16px;
						border-radius: 8px;
						display: grid;
						gap: 0.5em;
						border: 1px solid transparent;
						background: var( --ce-color-gray-100, #f9fafb );
					` }
				>
					<div
						css={ css`
							display: flex;
							justify-content: space-between;
							align-items: center;
						` }
					>
						<div
							css={ css`
								cursor: pointer;
								flex: 1;
								user-select: none;
								display: inline-block;
								color: var( --ce-input-label-color );
								font-size: 15px;
								font-weight: var(
									--ce-input-label-font-weight
								);
								text-transform: var(
									--ce-input-label-text-transform,
									none
								);
								letter-spacing: var(
									--ce-input-label-letter-spacing,
									0
								);
							` }
						>
							{ __( 'Form', 'checkout_engine' ) }
						</div>
						<div
							css={ css`
								display: flex;
								align-items: center;
							` }
						>
							<div
								css={ css`
									display: flex;
									align-items: center;
								` }
							>
								<Button
									onClick={ () =>
										setTab( tab === 'cart' ? '' : 'cart' )
									}
								>
									<span
										css={ css`
											display: inline-block;
											vertical-align: top;
											box-sizing: border-box;
											margin: 1px 0 -1px 2px;
											padding: 0 5px;
											min-width: 18px;
											height: 18px;
											border-radius: 9px;
											background-color: currentColor;
											font-size: 11px;
											line-height: 1.6;
											text-align: center;
											z-index: 26;
										` }
									>
										<span
											css={ css`
												color: #fff;
											` }
										>
											{
												( prices || [] ).filter(
													( p ) => p?.id
												)?.length
											}
										</span>
									</span>

									<svg
										xmlns="http://www.w3.org/2000/svg"
										css={ css`
											width: 18px;
											height: 18px;
											fill: none !important;
										` }
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={ 2 }
											d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
										/>
									</svg>
								</Button>
							</div>
						</div>
					</div>

					{ tab === 'cart' && (
						<Cart
							attributes={ attributes }
							setAttributes={ setAttributes }
						/>
					) }

					{ tab === 'settings' && (
						<Settings
							attributes={ attributes }
							setAttributes={ setAttributes }
						/>
					) }
				</div>
				<CeCheckout
					keys={ ceData?.keys }
					css={ css`
						margin-top: 2em;
						font-size: ${ font_size }px;
					` }
					persistSession={ false }
					alignment={ align }
					className={ className }
					choiceType={ choice_type }
					prices={ prices }
				>
					<InnerBlocks
						style={ {
							'--global--spacing-vertical': '0',
						} }
						allowedBlocks={ ALLOWED_BLOCKS }
						templateLock={ false }
						renderAppender={
							blockCount
								? undefined
								: InnerBlocks.ButtonBlockAppender
						}
					/>
				</CeCheckout>
			</div>
		</Fragment>
	);
}
