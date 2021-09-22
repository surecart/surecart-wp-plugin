/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { useSelect, dispatch } from '@wordpress/data';

import FlashError from '../../components/FlashError';

import { STORE_KEY as UI_STORE_KEY } from '../../store/ui';
import { STORE_KEY as DATA_STORE_KEY } from '../../store/data';

import {
	CeInput,
	CeFormRow,
	CeChoice,
	CePriceInput,
	CeSwitch,
	CeTag,
	CeFormControl,
	CeButton,
	CeDropdown,
	CeMenu,
	CeMenuItem,
	CeChoices,
} from '@checkout-engine/react';

import ToggleHeader from '../../components/ToggleHeader';
import { translate } from '../../util';

// hooks
import useProductData from '../hooks/useProductData';
import useValidationErrors from '../../hooks/useValidationErrors';

// hocs
import withConfirm from '../../hocs/withConfirm';

export default withConfirm(
	( { price, prices, index, open = true, setConfirm } ) => {
		const {
			duplicateModel,
			updateModel,
			isInvalid,
			toggleArchiveModel,
		} = useProductData();

		const { errors, getValidation } = useValidationErrors(
			'prices',
			index
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

		const deletePrice = ( index ) => {
			dispatch( DATA_STORE_KEY ).deleteModel( 'prices', index );
		};

		const toggleArchive = async () => {
			setConfirm( {} );
			toggleArchiveModel( 'prices', index );
		};

		const priceName = price?.name || __( 'Price', 'checkout_engine' );

		const confirmToggleArchive = async () => {
			setConfirm( {
				title: price?.archived_at
					? sprintf(
							__( 'Un-Archive %s?', 'checkout_engine' ),
							priceName
					  )
					: sprintf(
							__( 'Archive %s?', 'checkout_engine' ),
							priceName
					  ),
				message: price?.archived_at
					? __(
							'This will make the price purchaseable again.',
							'checkout_engine'
					  )
					: __(
							'This price will not be purchaseable and all unsaved changes to this price will be lost.',
							'checkout_engine'
					  ),
				confirmButtonText: price?.archived_at
					? sprintf(
							__( 'Un-Archive %s?', 'checkout_engine' ),
							priceName
					  )
					: sprintf(
							__( 'Archive %s?', 'checkout_engine' ),
							priceName
					  ),
				open: true,
				isDestructive: true,
				onRequestClose: () => setConfirm( {} ),
				onRequestConfirm: toggleArchive,
			} );
		};

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
			<div>
				{ price?.archived && (
					<CeTag type="warning">
						{ __( 'Archived', 'checkout_engine' ) }
					</CeTag>
				) }
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
								duplicateModel( 'prices', price );
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
							<CeMenuItem
								onClick={ () => confirmToggleArchive() }
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
										<polyline points="21 8 21 21 3 21 3 8"></polyline>
										<rect
											x="1"
											y="3"
											width="22"
											height="5"
										></rect>
										<line
											x1="10"
											y1="12"
											x2="14"
											y2="12"
										></line>
									</svg>
								</span>
								{ price?.archived
									? __( 'Un-Archive', 'checkout_engine' )
									: __( 'Archive', 'checkout_engine' ) }
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
									<line
										x1="10"
										y1="11"
										x2="10"
										y2="17"
									></line>
									<line
										x1="14"
										y1="11"
										x2="14"
										y2="17"
									></line>
								</svg>
							</span>
							{ __( 'Delete', 'checkout_engine' ) }
						</CeMenuItem>
					</CeMenu>
				</CeDropdown>
			</div>
		);

		return (
			<div>
				<ToggleHeader
					isOpen={ isOpen }
					setIsOpen={ setIsOpen }
					buttons={ buttons }
					type={ price.archived ? 'warning' : '' }
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
					<FlashError path="prices" index={ index } scrollIntoView />

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
									updateModel(
										'prices',
										{
											name: e.target.value,
										},
										index
									);
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
									updateModel(
										'prices',
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
									updateModel(
										'prices',
										{
											recurring: true,
											recurring_interval:
												price?.recurring_interval ||
												'year',
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
									? __(
											'Recommended Price',
											'checkout_engine'
									  )
									: __( 'Price', 'checkout_engine' )
							}
							className="ce-price-amount"
							currencyCode={ ceData.currecy_code }
							value={ price?.amount }
							name="price"
							onCeChange={ ( e ) => {
								updateModel(
									'prices',
									{ amount: e.target.value },
									index
								);
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
									updateModel(
										'prices',
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
									updateModel(
										'prices',
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
									updateModel(
										'prices',
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
										value={
											price?.recurring_interval_count
										}
										errorMessage={ getValidation(
											'recurring_interval_count'
										) }
										onCeChange={ ( e ) =>
											updateModel(
												'prices',
												{
													recurring_interval_count:
														e.target.value,
												},
												index
											)
										}
										type="number"
										max={
											price?.recurring_interval === 'year'
												? 1
												: null
										}
										required
									/>
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
													updateModel(
														'prices',
														{
															recurring_interval:
																'day',
														},
														index
													)
												}
											>
												{ __(
													'Day',
													'checkout_engine'
												) }
											</CeMenuItem>
											<CeMenuItem
												onClick={ () =>
													updateModel(
														'prices',
														{
															recurring_interval:
																'month',
														},
														index
													)
												}
											>
												{ __(
													'Month',
													'checkout_engine'
												) }
											</CeMenuItem>
											<CeMenuItem
												onClick={ () =>
													updateModel(
														'prices',
														{
															recurring_interval:
																'year',
														},
														index
													)
												}
											>
												{ __(
													'Year',
													'checkout_engine'
												) }
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
	}
);
