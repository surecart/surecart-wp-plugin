/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { BaseControl, DateTimePicker } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import {
	ScAlert,
	ScInput,
	ScPriceInput,
	ScSwitch,
} from '@surecart/components-react';

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
								'The number of times a single customer can use this coupon.',
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
					<BaseControl>
						<ScPriceInput
							className="sc-coupon-minimum-subtotal-amount"
							help={__(
								'The minimum order subtotal amount required to apply this coupon.',
								'surecart'
							)}
							currencyCode={coupon?.currency}
							placeholder={__('No Minimum', 'surecart')}
							attribute="min_subtotal_amount"
							label={__('Minimum order subtotal', 'surecart')}
							value={coupon?.min_subtotal_amount || null}
							onScInput={(e) =>
								updateCoupon({
									min_subtotal_amount: e.target.value,
								})
							}
						/>
					</BaseControl>
				</div>
				<div>
					<ScSwitch
						class="sc-redeem-by"
						checked={!!coupon?.redeem_by}
						onScChange={(e) => {
							updateCoupon({
								redeem_by: e.target.checked
									? Date.now() / 1000
									: null,
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
								currentDate={new Date(coupon?.redeem_by * 1000)}
								onChange={(redeem_by) =>
									updateCoupon({
										redeem_by:
											Date.parse(new Date(redeem_by)) /
											1000,
									})
								}
							/>
						</div>
					)}
				</div>

				<ScAlert open type="info">
					{__(
						'Note: Redemption limits are not applied in test mode.',
						'surecart'
					)}
				</ScAlert>
			</div>
		</Box>
	);
};
