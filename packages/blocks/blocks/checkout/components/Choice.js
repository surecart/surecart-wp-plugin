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
	CeCheckbox,
	CeFormControl,
	CeFormRow,
	CeButton,
	CeQuantitySelect,
	CeFormatNumber,
	CeDropdown,
	CeMenu,
	CeMenuItem,
} from '@checkout-engine/react';

import { css, jsx } from '@emotion/core';

export default ( { choice, attributes, setAttributes, id } ) => {
	// styles
	const border = '--ce-color-gray-200';
	const bg = '--ce-color-white';
	const bgHover = '--ce-color-gray-50';
	const color = '--ce-color-gray-900';
	const muted = '--ce-color-gray-500';

	const { choices } = attributes;
	const [ product, setProduct ] = useState( null );
	const [ isOpen, setIsOpen ] = useState( true );
	const [ loading, setLoading ] = useState( false );
	const [ error, setError ] = useState( null );

	useEffect( () => {
		fetchProduct();
	}, [ id ] );

	const removeProduct = () => {
		const r = confirm(
			__(
				'Are you sure you want to remove this product from the form?',
				'checkout_engine'
			)
		);
		if ( r ) {
			const { [ id ]: value, ...withoutProduct } = choices;
			setAttributes( {
				choices: withoutProduct,
			} );
		}
	};

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

	if ( loading ) {
		return (
			<CeFormRow>
				<CeFormControl>
					<ce-skeleton
						slot="label"
						style={ { width: '20px', display: 'block' } }
					></ce-skeleton>
					{ Object.keys( choice.prices || {} ).map( () => {
						return (
							<ce-skeleton
								style={ {
									width: '140px',
									display: 'block',
								} }
							></ce-skeleton>
						);
					} ) }
				</CeFormControl>
			</CeFormRow>
		);
	}

	if ( error ) {
		return <div>{ error }</div>;
	}

	if ( ! product ) {
		return (
			<ce-choices>
				<ce-choice name="loading" disabled>
					<ce-skeleton
						style={ { width: '60px', display: 'inline-block' } }
					></ce-skeleton>
					<ce-skeleton
						style={ { width: '140px', display: 'inline-block' } }
						slot="description"
					></ce-skeleton>
					<ce-skeleton
						style={ { width: '20px', display: 'inline-block' } }
						slot="price"
					></ce-skeleton>
					<ce-skeleton
						style={ { width: '40px', display: 'inline-block' } }
						slot="per"
					></ce-skeleton>
				</ce-choice>
			</ce-choices>
		);
	}

	const addPrice = ( priceId ) => {
		setAttributes( {
			choices: dotProp.set(
				choices,
				`${ id }.prices.${ priceId }.enabled`,
				true
			),
		} );
	};

	const removePrice = ( priceId ) => {
		setAttributes( {
			choices: dotProp.set(
				choices,
				`${ id }.prices.${ priceId }.enabled`,
				false
			),
		} );
	};

	const priceIsChecked = ( price ) => {
		return choices?.[ id ]?.prices?.[ price.id ]?.enabled;
	};

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
					<CeMenuItem onClick={ removeProduct }>
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
											<CeCheckbox
												key={ price.id }
												value={ price.id }
												onCeChange={ ( e ) => {
													if ( e.target.checked ) {
														addPrice(
															e.target.value
														);
													} else {
														removePrice(
															e.target.value
														);
													}
												} }
												checked={ priceIsChecked(
													price
												) }
											>
												{ price.name }
											</CeCheckbox>
											<CeQuantitySelect
												css={ css`
													color: var( ${ muted } );
												` }
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
