/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import {
	BaseControl,
	CheckboxControl,
	TextControl,
	DateTimePicker,
} from '@wordpress/components';

import useCouponData from '../hooks/useCouponData';

import Box from '../../ui/Box';
import { CeCheckbox, CeInput } from '@checkout-engine/react';

export default () => {
	const { coupon, loading, updateCoupon } = useCouponData();

	return (
		<Box
			title={ __( 'Redemption Limits', 'checkout_engine' ) }
			loading={ loading }
		>
			<CeCheckbox
				className="ce-redeem-by"
				label={ __(
					'Limit the end date when customers can redeem this coupon.'
				) }
				checked={ coupon?.redeem_by }
				onCeChange={ ( e ) => {
					updateCoupon( {
						redeem_by: e.target.checked ? Date.now() : null,
					} );
				} }
			>
				{ __(
					'Limit the end date when customers can redeem this coupon.'
				) }
			</CeCheckbox>
			{ !! coupon?.redeem_by && (
				<div
					className="redeem-by-date"
					css={ css`
						max-width: 288px;
						margin-top: 30px;
					` }
				>
					<BaseControl.VisualLabel>
						{ __(
							'Users must redeem this coupon by:',
							'checkout_engine'
						) }
					</BaseControl.VisualLabel>
					<DateTimePicker
						currentDate={ new Date( coupon?.redeem_by ) }
						onChange={ ( redeem_by ) => {
							updateCoupon( {
								redeem_by: new Date( redeem_by ).getTime(),
							} );
						} }
					/>
				</div>
			) }

			<CeCheckbox
				className="ce-max-redemptions"
				label={ __(
					'Limit the end date when customers can redeem this coupon.'
				) }
				checked={ coupon?.max_redemptions }
				onCeChange={ ( e ) => {
					updateCoupon( {
						max_redemptions: e.target.checked ? 1 : null,
					} );
				} }
			>
				{ __(
					'Limit the total number of times this coupon can be redeemed',
					'checkout_engine'
				) }
			</CeCheckbox>

			{ !! coupon?.max_redemptions && (
				<BaseControl>
					<CeInput
						label={ __( 'Number of Times', 'checkout_engine' ) }
						help={ __(
							"This limit applies across customers so it won't prevent a single customer from redeeming multiple times.",
							'checkout_engine'
						) }
						class="max-redemptions-input"
						value={ coupon?.max_redemptions || 1 }
						onCeChange={ ( e ) => {
							updateCoupon( {
								max_redemptions: e.target.value,
							} );
						} }
						type="number"
					/>
				</BaseControl>
			) }
		</Box>
	);
};
