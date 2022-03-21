/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { BaseControl, DateTimePicker } from '@wordpress/components';

import Box from '../../ui/Box';
import {
	CeCheckbox,
	CeInput,
	CeSwitch,
} from '@checkout-engine/components-react';

export default ({ coupon, loading, updateCoupon }) => {
	return (
		<Box title={__('Redemption Limits', 'surecart')} loading={loading}>
			<div
				css={css`
					display: grid;
					gap: 2em;
				`}
			>
				<div>
					<CeSwitch
						checked={!!coupon?.redeem_by}
						onCeChange={(e) => {
							updateCoupon({
								redeem_by: e.target.checked ? Date.now() : null,
							});
						}}
					>
						{__('End Date')}
						<span slot="description">
							{__(
								'Limit the end date when customers can redeem this coupon.'
							)}
						</span>
					</CeSwitch>
					{!!coupon?.redeem_by && (
						<div
							className="redeem-by-date"
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

				<div
					css={css`
						display: grid;
						gap: 1em;
					`}
				>
					<CeSwitch
						checked={!!coupon?.max_redemptions}
						onCeChange={(e) => {
							updateCoupon({
								max_redemptions: e.target.checked ? 1 : null,
							});
						}}
					>
						{__('Max Redemptions')}
						<span slot="description">
							{__(
								'Limit the total number of times this coupon can be redeemed.'
							)}
						</span>
					</CeSwitch>

					{!!coupon?.max_redemptions && (
						<BaseControl>
							<CeInput
								label={__('Number of Times', 'surecart')}
								help={__(
									"This limit applies across customers so it won't prevent a single customer from redeeming multiple times.",
									'surecart'
								)}
								class="max-redemptions-input"
								value={coupon?.max_redemptions || 1}
								onCeChange={(e) => {
									updateCoupon({
										max_redemptions: e.target.value,
									});
								}}
								type="number"
							/>
						</BaseControl>
					)}
				</div>
			</div>
		</Box>
	);
};
