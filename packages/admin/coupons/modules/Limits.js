/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScInput, ScSwitch } from '@surecart/components-react';
import { BaseControl, DateTimePicker } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';

export default ({ coupon, loading, updateCoupon }) => {
	return (
		<Box title={__('Redemption Limits', 'surecart')} loading={loading}>
			<div
				css={css`
					display: grid;
					gap: 2em;
				`}
			>
				<div
					css={css`
						display: grid;
						gap: 1em;
					`}
				>
					<BaseControl>
						<ScInput
							label={__('Usage limit per coupon', 'surecart')}
							help={__(
								"This limit applies across customers so it won't prevent a single customer from redeeming multiple times.",
								'surecart'
							)}
							placeholder={__('Unlimited Usage', 'surecart')}
							class="max-redemptions-input"
							value={coupon?.max_redemptions}
							onScChange={(e) => {
								updateCoupon({
									max_redemptions: e.target.value,
								});
							}}
							type="number"
						/>
					</BaseControl>
					<BaseControl>
						<ScInput
							label={__('Usage limit per customer', 'surecart')}
							placeholder={__('Unlimited Usage', 'surecart')}
							help={__(
								'This limit applies across per customer.',
								'surecart'
							)}
							class="max-redemptions-input"
							value={coupon?.max_redemptions_per_customer}
							onScChange={(e) => {
								updateCoupon({
									max_redemptions_per_customer:
										e.target.value,
								});
							}}
							type="number"
						/>
					</BaseControl>
				</div>
				<div>
					<ScSwitch
						class="sc-redeem-by"
						checked={!!coupon?.redeem_by}
						onScChange={(e) => {
							updateCoupon({
								redeem_by: e.target.checked ? Date.now() : null,
							});
						}}
					>
						{__('End Date', 'surecart')}
						<span slot="description">
							{__(
								'Limit the end date when customers can redeem this coupon.',
								'surecart'
							)}
						</span>
					</ScSwitch>
					{!!coupon?.redeem_by && (
						<div
							className="sc-redeem-by-date"
							css={css`
								max-width: 288px;
								margin-top: 30px;
							`}
						>
							<BaseControl.VisualLabel>
								{__(
									'Users must redeem this coupon by:',
									'surecart'
								)}
							</BaseControl.VisualLabel>
							<DateTimePicker
								currentDate={new Date(coupon?.redeem_by)}
								onChange={(redeem_by) => {
									updateCoupon({
										redeem_by: new Date(
											redeem_by
										).getTime(),
									});
								}}
							/>
						</div>
					)}
				</div>
			</div>
		</Box>
	);
};
