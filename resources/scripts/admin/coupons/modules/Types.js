/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;
const { useState } = wp.element;
const {
	BaseControl,
	RadioControl,
	TextControl,
	Flex,
	FlexItem,
	FlexBlock,
} = wp.components;

import Box from '../../ui/Box';

export default ( { coupon, updateCoupon } ) => {
	const [ type, setType ] = useState( 'percentage' );
	return (
		<Box title={ __( 'Coupon Type', 'checkout_engine' ) }>
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
							label={ __( 'Percent Off', 'checkout-engine' ) }
							value={ coupon?.percent_off }
							onChange={ ( percent_off ) =>
								updateCoupon( { percent_off } )
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
						value={ coupon?.amount_off }
						onChange={ ( amount_off ) =>
							updateCoupon( { amount_off } )
						}
					/>
				) }
			</BaseControl>
		</Box>
	);
};
