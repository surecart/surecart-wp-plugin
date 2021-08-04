/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;

const {
	BaseControl,
	CheckboxControl,
	TextControl,
	DateTimePicker,
} = wp.components;

import Box from '../../ui/Box';

export default ( { coupon, updateCoupon } ) => {
	return (
		<Box title={ __( 'Redemption Limits', 'checkout_engine' ) }>
			<BaseControl>
				<CheckboxControl
					label={ __(
						'Limit the end date when customers can redeem this coupon.'
					) }
					checked={ coupon?.redeem_by }
					onChange={ ( val ) => {
						updateCoupon( {
							redeem_by: val ? new Date() : null,
						} );
					} }
				/>
				{ !! coupon?.redeem_by && (
					<div
						css={ css`
							max-width: 288px;
							margin-top: 30px;
						` }
					>
						<BaseControl.VisualLabel>
							Redeem By
						</BaseControl.VisualLabel>
						<DateTimePicker
							currentDate={ coupon?.redeem_by }
							onChange={ ( redeem_by ) =>
								updateCoupon( {
									redeem_by,
								} )
							}
						/>
					</div>
				) }
				<CheckboxControl
					label={ __(
						'Limit the total number of times this coupon can be redeemed'
					) }
					checked={ false }
					checked={ coupon?.max_redemptions }
					onChange={ ( val ) => {
						updateCoupon( {
							max_redemptions: val ? 1 : null,
						} );
					} }
				/>
			</BaseControl>
			{ !! coupon?.max_redemptions && (
				<BaseControl>
					<TextControl
						label={ __( 'Number of Times', 'checkout_engine' ) }
						help={ __(
							"This limit applies across customers so it won't prevent a single customer from redeeming multiple times.",
							'checkout_engine'
						) }
						value={ coupon?.max_redemptions || 1 }
						type="number"
					/>
				</BaseControl>
			) }
		</Box>
	);
};
