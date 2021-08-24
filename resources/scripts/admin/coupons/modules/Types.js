/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;
const { useState, useEffect } = wp.element;
const { BaseControl, RadioControl } = wp.components;

import Box from '../../ui/Box';
import TextControl from '../../components/TextControl';

export default ( { coupon, updateCoupon, loading } ) => {
	const [ type, setType ] = useState( 'percentage' );

	useEffect( () => {
		if ( coupon?.percent_off ) {
			updateCoupon( { amount_off: null } );
		}
		if ( coupon?.amount_off ) {
			updateCoupon( { percent_off: null } );
		}
	}, [ coupon?.percent_off, coupon?.amount_off ] );

	useEffect( () => {
		if ( coupon?.amount_off ) {
			setType( 'fixed' );
		}
	}, [ coupon?.amount_off ] );

	return (
		<Box title={ __( 'Amount', 'checkout_engine' ) } loading={ loading }>
			<BaseControl>
				<RadioControl
					className="ce-type"
					label={ __( 'Choose a type', 'checkout_engine' ) }
					selected={ type }
					options={ [
						{
							label: __(
								'Percentage Discount',
								'checkout_engine'
							),
							value: 'percentage',
						},
						{
							label: __( 'Fixed Discount', 'checkout_engine' ),
							value: 'fixed',
						},
					] }
					onChange={ ( val ) => {
						setType( val );
					} }
				/>
			</BaseControl>
			<BaseControl>
				{ type === 'percentage' ? (
					<div
						css={ css`
							position: relative;
						` }
					>
						<TextControl
							css={ css`
								.components-text-control__input {
									padding-right: 20px;
									&:focus,
									&:hover,
									&:active {
										padding-right: 30px;
									}
								}
							` }
							className="ce-percent-off"
							type="number"
							min="0"
							max="100"
							attribute="percent_off"
							label={ __( 'Percent Off', 'checkout-engine' ) }
							value={ coupon?.percent_off || null }
							onChange={ ( percent_off ) =>
								updateCoupon( {
									percent_off: parseFloat( percent_off ),
								} )
							}
							required={ type === 'percentage' }
						/>

						<div
							css={ css`
								position: absolute;
								right: 10px;
								height: 35px;
								top: 35px;
							` }
						>
							%
						</div>
					</div>
				) : (
					<div
						css={ css`
							position: relative;
						` }
					>
						<div
							css={ css`
								position: absolute;
								left: 10px;
								height: 35px;
								top: 36px;
								opacity: 0.5;
							` }
						></div>
						<TextControl
							css={ css`
								.components-text-control__input[type='number'] {
									padding-left: 18px;
								}
							` }
							className="ce-amount-off"
							attribute="amount_off"
							label={ __( 'Amount Off', 'checkout-engine' ) }
							type="number"
							min="0.00"
							step="0.001"
							value={ coupon?.amount_off / 100 || null }
							onChange={ ( amount_off ) => {
								updateCoupon( {
									amount_off: amount_off * 100,
								} );
							} }
							required={ type === 'fixed' }
						/>
					</div>
				) }
			</BaseControl>
		</Box>
	);
};
