/** @jsx jsx */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';
import { Icon, external, menu, moreHorizontal, close } from '@wordpress/icons';
import { Container, Draggable } from 'react-smooth-dnd';
import { useSelect, select } from '@wordpress/data';
import ToggleHeader from '../../../../../resources/scripts/admin/components/ToggleHeader';

import dotProp from 'dot-prop-immutable';

import {
	CeButton,
	CeFormatNumber,
	CeDropdown,
	CeMenu,
	CeMenuItem,
} from '@checkout-engine/react';

import {
	CheckboxControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';

import { css, jsx } from '@emotion/core';
import { applyDrag } from '../../../utils/drag-drop';
import { BLOCKS_STORE_KEY } from '../store';

export default ( { attributes, setAttributes, id } ) => {
	// styles
	const border = '--ce-color-gray-200';
	const bg = '--ce-color-white';
	const bgHover = '--ce-color-gray-50';
	const color = '--ce-color-gray-900';
	const muted = '--ce-color-gray-500';

	const { prices } = attributes;
	const [ isOpen, setIsOpen ] = useState( true );

	const { pricesData, isResolvingPrices } = useSelect(
		( select ) => {
			const { isResolving, selectPricesByIds } = select(
				BLOCKS_STORE_KEY
			);
			const priceIds = prices.map( ( p ) => p.id );
			return {
				pricesData: selectPricesByIds( priceIds ),
				isResolvingPrices: isResolving( 'selectPricesByIds', [
					priceIds,
				] ),
			};
		},
		[ id ]
	);

	const { product } = useSelect(
		( select ) => {
			if ( ! Object.keys( pricesData ).length ) {
				return {
					product: null,
					isResolvingProduct: false,
				};
			}
			const { isResolving, selectProductById } = select(
				BLOCKS_STORE_KEY
			);
			return {
				product: selectProductById( id ),
				isResolvingProduct: isResolving( 'selectProductById', [ id ] ),
			};
		},
		[ pricesData ]
	);

	const removeChoice = () => {
		const r = confirm(
			__(
				'Are you sure you want to remove this product from the form?',
				'checkout_engine'
			)
		);
		if ( r ) {
			setAttributes( {
				prices: prices.filter( ( p ) => p.product_id !== id ),
			} );
		}
	};

	if ( isResolvingPrices ) {
		return (
			<div
				css={ css`
					display: flex;
					flex-direction: column;
					gap: 1em;
					margin-bottom: 1em;
				` }
			>
				<div>
					<ce-skeleton
						style={ {
							width: '120px',
							display: 'inline-block',
						} }
					></ce-skeleton>
				</div>
				<div>
					<ce-skeleton
						style={ {
							width: '300px',
							display: 'inline-block',
						} }
					></ce-skeleton>
				</div>
			</div>
		);
	}

	const navigateToEditProduct = () => {
		window.location.href = addQueryArgs( 'admin.php', {
			page: 'ce-products',
			action: 'edit',
			id,
		} );
	};

	const onDrop = ( dropResult ) => {
		const removedIndex = prices.indexOf( dropResult.payload );
		const offset = removedIndex - dropResult.removedIndex;
		dropResult.addedIndex = dropResult.addedIndex + offset;
		dropResult.removedIndex = removedIndex;
		setAttributes( {
			prices: applyDrag( prices, dropResult ),
		} );
	};

	const buttons = (
		<div>
			<CeDropdown slot="suffix" position="bottom-right">
				<CeButton type="text" slot="trigger" circle>
					<Icon icon={ moreHorizontal } size={ 24 } />
				</CeButton>
				<CeMenu>
					<CeMenuItem onClick={ navigateToEditProduct }>
						<Icon
							slot="prefix"
							css={ css`
								opacity: 0.5;
								margin-right: 8px;
							` }
							icon={ external }
							size={ 16 }
						/>
						{ __( 'Edit', 'checkout_engine' ) }
					</CeMenuItem>
					<CeMenuItem onClick={ removeChoice }>
						<Icon
							slot="prefix"
							css={ css`
								opacity: 0.5;
								margin-right: 8px;
							` }
							icon={ close }
							size={ 16 }
						/>
						{ __( 'Remove', 'checkout_engine' ) }
					</CeMenuItem>
				</CeMenu>
			</CeDropdown>
		</div>
	);

	const productPrices = ( prices || [] ).filter(
		( price ) => price.product_id === id
	);

	return (
		<div
			css={ css`
				.product-choice__icon {
					opacity: 0;
					visibility: hidden;
					transition: opacity 0.35s ease;
				}

				&:hover .product-choice__icon {
					opacity: 1;
					visibility: visible;
				}
			` }
		>
			<ToggleHeader
				css={ css`
					margin-bottom: 1em;
				` }
				isOpen={ isOpen }
				setIsOpen={ setIsOpen }
				buttons={ buttons }
			>
				<div
					css={ css`
						display: flex;
						align-items: center;
						gap: 1em;
					` }
				>
					<Icon
						css={ css`
							cursor: move;
							svg {
								fill: var( ${ muted } );
							}
						` }
						icon={ menu }
						size={ 18 }
					/>
					{ product?.name }
				</div>
			</ToggleHeader>

			{ isOpen && (
				<div
					css={ css`
						margin: 1em auto;
					` }
				>
					<Container
						onDrop={ onDrop }
						getChildPayload={ ( index ) => {
							return productPrices[ index ];
						} }
					>
						{ productPrices.map( ( priceChoice, index ) => {
							const price = pricesData[ priceChoice.id ];
							if ( ! price ) return;
							return (
								<Draggable
									key={ priceChoice.id }
									css={ css`
										overflow: visible !important;
									` }
								>
									<div
										key={ priceChoice.id }
										css={ css`
											background: var( ${ bg } );
											&:hover {
												background: var( ${ bgHover } );
											}
											color: var( ${ color } );
											box-shadow: inset 0 0 0 1px
												var( ${ border } );
											display: grid;
											margin-top: -1px;
											padding: 1.2em;
											grid-template-columns: repeat(
												3,
												minmax( 0, 1fr )
											);
											justify-content: space-between;
											align-content: center;
											gap: 1em;
											transition: background-color 0.35s
												ease;
										` }
									>
										<div
											css={ css`
												display: flex;
												gap: 1em;
												color: var( ${ color } );
												align-items: center;
											` }
										>
											<CheckboxControl
												css={ css`
													white-space: nowrap;
													.components-base-control__field {
														margin-bottom: 0;
													}
												` }
												label={ price.name }
												checked={
													!! priceChoice?.enabled
												}
												onChange={ ( checked ) => {
													setAttributes( {
														prices: dotProp.set(
															prices,
															`${ index }.enabled`,
															!! checked
														),
													} );
												} }
											/>
											<NumberControl
												label={ __(
													'Qty:',
													'checkout_engine'
												) }
												labelPosition="side"
												onChange={ ( number ) => {
													setAttributes( {
														prices: dotProp.set(
															prices,
															`${ index }.quanity`,
															parseInt( number )
														),
													} );
												} }
												shiftStep={ 10 }
												value={ priceChoice?.quantity }
											/>
										</div>
										<span
											css={ css`
												text-align: center;
											` }
										>
											<CeFormatNumber
												type="currency"
												currency={ price.currency }
												value={ price.amount }
											/>{ ' ' }
											<span
												css={ css`
													color: var( ${ muted } );
												` }
											>
												{ price.recurring_interval
													? `/ ${ price.recurring_interval }`
													: __(
															'once',
															'checkout_engine'
													  ) }
											</span>
										</span>
										<span
											css={ css`
												text-align: right;
												svg {
													fill: var( ${ muted } );
													stroke-width: 2;
												}
											` }
										>
											<Icon
												css={ css`
													cursor: move;
												` }
												icon={ menu }
												size={ 18 }
											/>
										</span>
									</div>
								</Draggable>
							);
						} ) }
					</Container>
				</div>
			) }
		</div>
	);
};
