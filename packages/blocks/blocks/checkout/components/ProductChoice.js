/** @jsx jsx */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useEffect, useState } from '@wordpress/element';
import { Icon, external, menu, moreHorizontal, close } from '@wordpress/icons';
import { Container, Draggable } from 'react-smooth-dnd';
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

export default ( { attributes, setAttributes, id } ) => {
	// styles
	const border = '--ce-color-gray-200';
	const bg = '--ce-color-white';
	const bgHover = '--ce-color-gray-50';
	const color = '--ce-color-gray-900';
	const muted = '--ce-color-gray-500';

	const { products } = attributes;

	const [ product, setProduct ] = useState( null );
	const [ isOpen, setIsOpen ] = useState( true );
	const [ loading, setLoading ] = useState( false );
	const [ error, setError ] = useState( null );

	useEffect( () => {
		fetchProduct();
	}, [ id ] );

	const fetchProduct = async () => {
		setLoading( true );
		let result;

		try {
			result = await apiFetch( {
				path: `checkout-engine/v1/products/${ id }`,
			} );
		} catch ( e ) {
			setError(
				e?.message || __( 'Something went wrong', 'checkout_engine' )
			);
		} finally {
			setLoading( false );
		}

		setProduct( result );
	};

	const removeChoice = ( id ) => {
		const r = confirm(
			__(
				'Are you sure you want to remove this product from the form?',
				'checkout_engine'
			)
		);
		if ( r ) {
			const { [ id ]: value, ...withoutProduct } = products;
			setAttributes( {
				products: withoutProduct,
			} );
		}
	};

	if ( loading || ! product ) {
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

	if ( error ) {
		return <div>{ error }</div>;
	}

	const navigateToEditProduct = () => {
		window.location.href = addQueryArgs( 'admin.php', {
			page: 'ce-products',
			action: 'edit',
			id,
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
					<Container>
						{ product.prices.map( ( price, index ) => {
							return (
								<Draggable
									key={ price.id }
									css={ css`
										overflow: visible !important;
									` }
								>
									<div
										key={ price.id }
										css={ css`
											background: var( ${ bg } );
											&:hover {
												background: var( ${ bgHover } );
											}
											color: var( ${ color } );
											${ index === 0 &&
											`border-top-right-radius: var(--ce-border-radius-medium); border-top-left-radius: var(--ce-border-radius-medium);` }
											${ index ===
												product?.prices?.length - 1 &&
											`border-bottom-right-radius: var(--ce-border-radius-medium); border-bottom-left-radius: var(--ce-border-radius-medium);` }
										  box-shadow: inset 0 0 0 1px var(${ border });
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
													!! products[ id ]?.prices?.[
														price.id
													]?.enabled
												}
												onChange={ ( checked ) => {
													setAttributes( {
														products: dotProp.set(
															products,
															`${ id }.prices.${ price.id }.enabled`,
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
														products: dotProp.set(
															products,
															`${ id }.prices.${ price.id }.quantity`,
															parseInt( number )
														),
													} );
												} }
												shiftStep={ 10 }
												value={
													products?.[ id ]?.prices?.[
														price.id
													]?.quantity
												}
											/>
											{ /* <CeQuantitySelect
												onCeChange={ ( e ) => {
													// setTimeout( () => {
													// 	setAttributes( {
													// 		choices: dotProp.set(
													// 			attributes.choices,
													// 			`${ id }.prices.${ price.id }.quantity`,
													// 			parseInt(
													// 				e.detail
													// 			)
													// 		),
													// 	} );
													// }, 50 );
												} }
												css={ css`
													color: var( ${ muted } );
												` }
											/> */ }
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
