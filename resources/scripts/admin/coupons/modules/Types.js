/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;
const { useState, useEffect } = wp.element;
const { BaseControl, RadioControl, TextControl } = wp.components;

import Box from '../../ui/Box';
import useCouponData from '../hooks/useCouponData';

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

	return (
		<Box
			title={ __( 'Coupon Type', 'checkout_engine' ) }
			loading={ loading }
		>
			<BaseControl>
				<RadioControl
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
								}
							` }
							type="number"
							label={ __( 'Percent Off', 'checkout-engine' ) }
							value={ coupon?.percent_off || null }
							onChange={ ( percent_off ) =>
								updateCoupon( {
									percent_off: parseFloat( percent_off ),
								} )
							}
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
					<TextControl
						label={ __( 'Amount Off', 'checkout-engine' ) }
						value={ coupon?.amount_off || null }
						onChange={ ( amount_off ) =>
							updateCoupon( {
								amount_off: parseFloat( amount_off ),
							} )
						}
					/>
				) }
			</BaseControl>
		</Box>
	);
};
