/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef, Fragment } from '@wordpress/element';
import { dispatch } from '@wordpress/data';

import FlashError from '../../../components/FlashError';
import { store as coreStore } from '../../../store/data';

import {
	CeInput,
	CeChoice,
	CePriceInput,
	CeSwitch,
	CeFormControl,
	CeButton,
	CeDropdown,
	CeMenu,
	CeMenuItem,
	CeChoices,
} from '@checkout-engine/components-react';

import Header from './Header';
import { translate } from '../../../util';

// hooks
import useProductData from '../../hooks/useProductData';
import useValidationErrors from '../../../hooks/useValidationErrors';

// hocs
import withConfirm from '../../../hocs/withConfirm';

export default withConfirm( ( { price, index, open } ) => {
	const {
		duplicatePrice: duplicatePriceAction,
		updatePrice: updatePriceAction,
		isInvalid,
		togglePriceArchive,
	} = useProductData();

	const { errors, getValidation } = useValidationErrors( 'prices', index );

	const [ isOpen, setIsOpen ] = useState( index === 0 );
	const input = useRef();

	// if invalid, toggle open.
	useEffect( () => {
		if ( isInvalid ) {
			setIsOpen( true );
		}
	}, [ isInvalid ] );

	// focus on first input when opened.
	useEffect( () => {
		if ( open === index && input?.current ) {
			setIsOpen( true );
			setTimeout( () => {
				input.current.triggerFocus();
			}, 50 );
			return;
		}
	}, [ open ] );

	// if invalid, toggle open.
	useEffect( () => {
		if ( errors?.length ) {
			setIsOpen( true );
		}
	}, [ errors ] );

	// update price
	const updatePrice = ( value ) => {
		updatePriceAction( index, value );
	};

	// delete
	const deletePrice = () => {
		dispatch( coreStore ).deleteModel( 'prices', index );
	};

	// archive
	const toggleArchive = () => {
		togglePriceArchive( index );
	};

	// duplicate
	const duplicatePrice = () => {
		duplicatePriceAction( price );
	};

	return (
		<div>
			<Header
				isOpen={ isOpen }
				setIsOpen={ setIsOpen }
				price={ price }
				onDuplicate={ duplicatePrice }
				onArchive={ toggleArchive }
				onDelete={ deletePrice }
			/>

			<div
				css={ css`
					display: grid;
					gap: var( --ce-form-row-spacing );
					margin-top: ${ isOpen ? '2em' : '0' };
					height: ${ isOpen ? 'auto' : 0 };
					overflow: ${ isOpen ? 'visible' : 'hidden' };
					visibility: ${ isOpen ? 'visibile' : 'hidden' };
				` }
			>
				<FlashError path="prices" index={ index } scrollIntoView />

				<CeInput
					ref={ input }
					label={ __( 'Price Name', 'checkout_engine' ) }
					className="ce-price-name"
					help={ __(
						'A short name for your price (i.e Professional Plan).',
						'checkout_engine'
					) }
					value={ price?.name }
					onCeChange={ ( e ) =>
						updatePrice( { name: e.target.value } )
					}
					required
				/>

				<CeChoices style={ { '--columns': 2 } }>
					<div>
						<CeChoice
							checked={ ! price?.recurring }
							value="single"
							onCeChange={ ( e ) => {
								if ( ! e.target.checked ) return;
								updatePrice( { recurring: false } );
							} }
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
							onCeChange={ ( e ) => {
								if ( ! e.target.checked ) return;
								updatePrice( {
									recurring: true,
									recurring_interval:
										price?.recurring_interval || 'year',
									recurring_interval_count:
										price?.recurring_interval_count || 1,
								} );
							} }
						>
							{ __( 'Subscription', 'checkout_engine' ) }
							<span slot="description">
								{ __(
									'Charge an ongoing fee.',
									'checkout_engine'
								) }
							</span>
						</CeChoice>
					</div>
				</CeChoices>

				{ ! price?.ad_hoc && (
					<CePriceInput
						label={ __( 'Price', 'checkout_engine' ) }
						className="ce-price-amount"
						currencyCode={ ceData.currecy_code }
						value={ price?.amount }
						name="price"
						onCeChange={ ( e ) => {
							updatePrice( { amount: e.target.value } );
						} }
						required
					/>
				) }

				{ !! price?.ad_hoc && (
					<div
						css={ css`
							display: grid;
							gap: var( --ce-form-row-spacing );
						` }
					>
						<CePriceInput
							label={ __( 'Min Amount', 'checkout_engine' ) }
							className="ce-ad-hoc-min-amount"
							value={ price?.ad_hoc_min_amount }
							onCeChange={ ( e ) =>
								updatePrice( {
									ad_hoc_min_amount: e.target.value,
								} )
							}
							required
						/>
						<CePriceInput
							label={ __( 'Max Amount', 'checkout_engine' ) }
							className="ce-ad-hoc-max-amount"
							value={ price?.ad_hoc_max_amount }
							min={ price?.ad_hoc_min_amount / 100 }
							onCeChange={ ( e ) =>
								updatePrice( {
									ad_hoc_max_amount: e.target.value,
								} )
							}
						/>
					</div>
				) }

				{ ! price?.recurring && (
					<div>
						<CeSwitch
							checked={ price?.ad_hoc }
							onCeChange={ ( e ) =>
								updatePrice( { ad_hoc: e.target.checked } )
							}
						>
							{ __(
								'Allow customers to pay what they want',
								'checkout_engine'
							) }
						</CeSwitch>
					</div>
				) }

				{ price?.recurring && (
					<Fragment>
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
									errorMessage={ getValidation(
										'recurring_interval_count'
									) }
									onCeChange={ ( e ) =>
										updatePrice( {
											recurring_interval_count:
												e.target.value,
										} )
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
												updatePrice( {
													recurring_interval: 'day',
												} )
											}
										>
											{ __( 'Day', 'checkout_engine' ) }
										</CeMenuItem>
										<CeMenuItem
											onClick={ () =>
												updatePrice( {
													recurring_interval: 'month',
												} )
											}
										>
											{ __( 'Month', 'checkout_engine' ) }
										</CeMenuItem>
										<CeMenuItem
											onClick={ () =>
												updatePrice( {
													recurring_interval: 'year',
												} )
											}
										>
											{ __( 'Year', 'checkout_engine' ) }
										</CeMenuItem>
									</CeMenu>
								</CeDropdown>
							</div>
						</CeFormControl>
						<CeInput
							css={ css`
								max-width: 350px;
							` }
							label={ __( 'Free Trial Days', 'checkout_engine' ) }
							className="ce-free-trial"
							help={ __(
								'If you want to add a free trial, enter the number of days.',
								'checkout_engine'
							) }
							value={ price?.trial_duration_days }
							onCeChange={ ( e ) =>
								updatePrice( {
									trial_duration_days: e.target.value,
								} )
							}
						>
							<span slot="suffix">
								{ __( 'Days', 'checkout_engine' ) }
							</span>
						</CeInput>
					</Fragment>
				) }
			</div>
		</div>
	);
} );
