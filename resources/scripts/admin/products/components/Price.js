/** @jsx jsx */
import { css, jsx } from '@emotion/core';
const { __ } = wp.i18n;
const { useState, useEffect, useRef } = wp.element;
import FlashError from '../../components/FlashError';
const { useSelect, dispatch } = wp.data;
import { STORE_KEY as UI_STORE_KEY } from '../../store/ui';

import useProductData from '../hooks/useProductData';

import {
	CeInput,
	CeFormRow,
	CeChoice,
	CePriceInput,
	CeSwitch,
	CeFormControl,
	CeButton,
	CeDropdown,
	CeMenu,
	CeMenuItem,
	CeChoices,
} from '@checkout-engine/react';

import ToggleHeader from '../../components/ToggleHeader';
import { translate } from '../../util';

export default ( { price, prices, index, open = true } ) => {
	const {
		duplicatePrice,
		updatePrice,
		deletePrice,
		updateModel,
		isInvalid,
	} = useProductData();

	// get model errors
	const errors = useSelect( ( select ) =>
		select( UI_STORE_KEY ).selectErrors( 'price', index )
	);

	const [ isOpen, setIsOpen ] = useState( true );
	const input = useRef();

	// focus on input when opened by default.
	useEffect( () => {
		if ( open && input?.current ) {
			setTimeout( () => {
				input.current.triggerFocus();
			}, 50 );
		}
		setIsOpen( open );
	}, [ open ] );

	// if invalid, toggle open.
	useEffect( () => {
		if ( isInvalid ) {
			setIsOpen( true );
		}
	}, [ isInvalid ] );

	// if invalid, toggle open.
	useEffect( () => {
		if ( errors?.length ) {
			setIsOpen( true );
		}
	}, [ errors ] );

	const headerName = () => {
		if ( ! price?.name || prices?.length === 1 ) {
			return __( 'Pricing Details', 'checkout_engine' );
		}

		if ( isOpen ) {
			return price?.name;
		}

		return `${ price?.name } - ${ ( price?.amount || 0 ) / 100 } ${ (
			price?.currency || ceData.currency_code
		)?.toUpperCase() } ${
			price?.recurring && price?.recurring_interval ? '/' : ''
		} ${ translate( price?.recurring_interval ) || '' }`;
	};

	const buttons = (
		<CeDropdown slot="suffix" position="bottom-right">
			<CeButton type="text" slot="trigger" circle>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="12" cy="12" r="1"></circle>
					<circle cx="19" cy="12" r="1"></circle>
					<circle cx="5" cy="12" r="1"></circle>
				</svg>
			</CeButton>
			<CeMenu>
				<CeMenuItem
					onClick={ ( e ) => {
						e.preventDefault();
						duplicatePrice( price );
					} }
				>
					<span
						slot="prefix"
						style={ {
							opacity: 0.5,
						} }
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect
								x="9"
								y="9"
								width="13"
								height="13"
								rx="2"
								ry="2"
							></rect>
							<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
						</svg>
					</span>
					{ __( 'Duplicate', 'checkout_engine' ) }
				</CeMenuItem>
				{ price?.id && (
					<CeMenuItem onClick={ () => deletePrice( index ) }>
						<span
							slot="prefix"
							style={ {
								opacity: 0.5,
							} }
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<polyline points="21 8 21 21 3 21 3 8"></polyline>
								<rect x="1" y="3" width="22" height="5"></rect>
								<line x1="10" y1="12" x2="14" y2="12"></line>
							</svg>
						</span>
						{ __( 'Archive', 'checkout_engine' ) }
					</CeMenuItem>
				) }
				<CeMenuItem
					onClick={ ( e ) => {
						e.preventDefault();
						deletePrice( index );
					} }
				>
					<span
						slot="prefix"
						style={ {
							opacity: 0.5,
						} }
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polyline points="3 6 5 6 21 6"></polyline>
							<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
							<line x1="10" y1="11" x2="10" y2="17"></line>
							<line x1="14" y1="11" x2="14" y2="17"></line>
						</svg>
					</span>
					{ __( 'Delete', 'checkout_engine' ) }
				</CeMenuItem>
			</CeMenu>
		</CeDropdown>
	);

	return (
		<div>
			<ToggleHeader
				isOpen={ isOpen }
				setIsOpen={ setIsOpen }
				buttons={ buttons }
				shadowed
			>
				{ headerName() }
			</ToggleHeader>

			<div
				css={ css`
					margin-top: ${ isOpen ? '2em' : '0' };
					height: ${ isOpen ? 'auto' : 0 };
					overflow: ${ isOpen ? 'visible' : 'hidden' };
					visibility: ${ isOpen ? 'visibile' : 'hidden' };
				` }
			>
				<FlashError
					error={ errors?.[ 0 ] }
					scrollIntoView
					onClose={ ( e ) => {
						dispatch( UI_STORE_KEY ).clearErrors( index );
					} }
				/>

				{ prices?.length > 1 && (
					<CeFormRow>
						<CeInput
							ref={ input }
							label={ __( 'Name', 'checkout_engine' ) }
							className="ce-price-name"
							help={ __(
								'A short name for your price (i.e Professional Plan).',
								'checkout_engine'
							) }
							value={ price?.name }
							onCeChange={ ( e ) => {
								updateModel( `prices.${ index }`, {
									name: e.target.value,
								} );
								// updatePrice( { name: e.target.value }, index );
							} }
							required
						/>
					</CeFormRow>
				) }

				<CeFormRow>
					<CeChoices style={ { '--columns': 2 } }>
						<CeChoice
							checked={ ! price?.recurring }
							value="single"
							onCeChange={ ( e ) =>
								e.target.value === 'single' &&
								updatePrice(
									{
										recurring: false,
									},
									index
								)
							}
						>
							{ __( 'Single Payment', 'checkout_engine' ) }
							<span slot="description">
								{ __(
									'Charge a one-time fee.',
									'checkout_engine'
								) }
							</span>
						</CeChoice>
						<CeChoice
							checked={ price?.recurring }
							value="subscription"
							onCeChange={ ( e ) =>
								e.target.checked &&
								updatePrice(
									{
										recurring: true,
										recurring_interval:
											price?.recurring_interval || 'year',
										recurring_interval_count:
											price?.recurring_interval_count ||
											1,
									},
									index
								)
							}
						>
							{ __( 'Subscription', 'checkout_engine' ) }
							<span slot="description">
								{ __(
									'Charge an ongoing fee.',
									'checkout_engine'
								) }
							</span>
						</CeChoice>
					</CeChoices>
				</CeFormRow>

				<CeFormRow>
					<CePriceInput
						label={
							price?.ad_hoc
								? __( 'Recommended Price', 'checkout_engine' )
								: __( 'Price', 'checkout_engine' )
						}
						className="ce-price-amount"
						currencyCode={ ceData.currecy_code }
						value={ price?.amount }
						onCeChange={ ( e ) => {
							updatePrice( { amount: e.target.value }, index );
						} }
						required
					/>
				</CeFormRow>

				{ !! price?.ad_hoc && (
					<CeFormRow
						css={ css`
							margin-top: -20px;
						` }
					>
						<CePriceInput
							label={ __( 'Min Amount', 'checkout_engine' ) }
							className="ce-ad-hoc-min-amount"
							value={ price?.ad_hoc_min_amount }
							onCeChange={ ( e ) => {
								updatePrice(
									{ ad_hoc_min_amount: e.target.value },
									index
								);
							} }
							required
						/>
						<CePriceInput
							label={ __( 'Max Amount', 'checkout_engine' ) }
							className="ce-ad-hoc-max-amount"
							value={ price?.ad_hoc_max_amount }
							min={ price?.ad_hoc_min_amount / 100 }
							onCeChange={ ( e ) => {
								updatePrice(
									{ ad_hoc_max_amount: e.target.value },
									index
								);
							} }
						/>
					</CeFormRow>
				) }

				{ ! price?.recurring && (
					<CeFormRow
						css={ css`
							margin-top: -20px;
						` }
					>
						<CeSwitch
							checked={ price?.ad_hoc }
							onCeChange={ ( e ) => {
								updatePrice(
									{ ad_hoc: e.target.checked },
									index
								);
							} }
						>
							{ __(
								'Allow customers to pay what they want',
								'checkout_engine'
							) }
						</CeSwitch>
					</CeFormRow>
				) }

				{ price?.recurring && (
					<CeFormRow>
						<CeFormControl
							label={ __(
								'Repeat payment every',
								'checkout_engine'
							) }
						>
							<div
								css={ css`
									display: flex;
									align-items: center;
									gap: 0.5em;
								` }
							>
								<CeInput
									css={ css`
										flex: 1;
										max-width: 150px;
									` }
									value={ price?.recurring_interval_count }
									onCeChange={ ( e ) =>
										updatePrice(
											{
												recurring_interval_count:
													e.target.value,
											},
											index
										)
									}
									required
								></CeInput>
								<CeDropdown
									slot="suffix"
									position="bottom-right"
								>
									<CeButton slot="trigger" caret>
										{ translate(
											price?.recurring_interval
										) }
									</CeButton>
									<CeMenu>
										<CeMenuItem
											onClick={ () =>
												updatePrice(
													{
														recurring_interval:
															'day',
													},
													index
												)
											}
										>
											{ __( 'Day', 'checkout_engine' ) }
										</CeMenuItem>
										<CeMenuItem
											onClick={ () =>
												updatePrice(
													{
														recurring_interval:
															'month',
													},
													index
												)
											}
										>
											{ __( 'Month', 'checkout_engine' ) }
										</CeMenuItem>
										<CeMenuItem
											onClick={ () =>
												updatePrice(
													{
														recurring_interval:
															'year',
													},
													index
												)
											}
										>
											{ __( 'Year', 'checkout_engine' ) }
										</CeMenuItem>
									</CeMenu>
								</CeDropdown>
							</div>
						</CeFormControl>
					</CeFormRow>
				) }
			</div>
		</div>
	);
};
