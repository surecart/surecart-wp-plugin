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

export default ( { promotion, updatePromotion, loading } ) => {
	return (
		<Box
			title={ __( 'Redemption Limits', 'checkout_engine' ) }
			loading={ loading }
		>
			<BaseControl>
				<div className="ce-redeem-by">
					<CheckboxControl
						label={ __(
							'Limit the end date when customers can redeem this coupon.'
						) }
						checked={ promotion?.redeem_by }
						onChange={ ( val ) => {
							updatePromotion( {
								redeem_by: val ? Date.now() : null,
							} );
						} }
					/>
					{ !! promotion?.redeem_by && (
						<div
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
								currentDate={ new Date( promotion?.redeem_by ) }
								onChange={ ( redeem_by ) => {
									updatePromotion( {
										redeem_by: new Date(
											redeem_by
										).getTime(),
									} );
								} }
							/>
						</div>
					) }
				</div>
				<div className="ce-max-redemptions">
					<CheckboxControl
						label={ __(
							'Limit the total number of times this coupon can be redeemed'
						) }
						checked={ false }
						checked={ promotion?.max_redemptions }
						onChange={ ( val ) => {
							updatePromotion( {
								max_redemptions: val ? 1 : null,
							} );
						} }
					/>

					{ !! promotion?.max_redemptions && (
						<BaseControl>
							<TextControl
								label={ __(
									'Number of Times',
									'checkout_engine'
								) }
								help={ __(
									"This limit applies across customers so it won't prevent a single customer from redeeming multiple times.",
									'checkout_engine'
								) }
								value={ promotion?.max_redemptions || 1 }
								onChange={ ( max_redemptions ) => {
									updatePromotion( {
										max_redemptions,
									} );
								} }
								type="number"
							/>
						</BaseControl>
					) }
				</div>
			</BaseControl>
		</Box>
	);
};
