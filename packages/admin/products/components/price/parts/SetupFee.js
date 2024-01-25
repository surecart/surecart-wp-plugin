/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __, sprintf } from '@wordpress/i18n';

import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScInput,
	ScMenu,
	ScMenuItem,
	ScPremiumTag,
	ScPriceInput,
	ScSwitch,
	ScUpgradeRequired,
} from '@surecart/components-react';

const SETUP_AMOUNT_TYPES = {
	fee: __('Setup Fee', 'surecart'),
	discount: __('Setup Discount', 'surecart'),
};

export default ({ price, updatePrice }) => {
	const amountType = price.setup_fee_amount < 0 ? 'discount' : 'fee';

	return (
		<ScUpgradeRequired
			required={!scData?.entitlements?.subscription_setup_fees}
			css={css`
				display: grid;
				gap: var(--sc-spacing-small);
			`}
		>
			<ScSwitch
				checked={price.setup_fee_enabled}
				onScChange={(e) =>
					updatePrice({ setup_fee_enabled: e.target.checked })
				}
			>
				{__('Setup fee or discount', 'surecart')}
				{!scData?.entitlements?.subscription_setup_fees && (
					<>
						{' '}
						<ScPremiumTag />
					</>
				)}
			</ScSwitch>

			{price.setup_fee_enabled && (
				<div
					css={css`
						display: flex;
						gap: var(--sc-form-row-spacing);
						margin-bottom: var(--sc-spacing-small);
						> * {
							flex: 1;
						}
					`}
				>
					<ScInput
						label={sprintf(
							__('%s Name', 'surecart'),
							SETUP_AMOUNT_TYPES[amountType]
						)}
						value={price?.setup_fee_name}
						onScInput={(e) =>
							updatePrice({
								setup_fee_name: e.target.value,
							})
						}
						name="name"
						required
					/>
					<ScPriceInput
						label={SETUP_AMOUNT_TYPES[amountType]}
						currencyCode={price?.currency || scData.currency_code}
						value={Math.abs(price?.setup_fee_amount)}
						max={amountType === 'fee' ? null : price?.amount}
						onScInput={(e) => {
							updatePrice({
								setup_fee_amount:
									amountType === 'fee'
										? Math.abs(e.target.value)
										: -Math.abs(e.target.value),
							});
						}}
						required
					>
						<ScDropdown slot="suffix" placement="bottom-end">
							<ScButton
								type="text"
								slot="trigger"
								css={css`
									&::part(label) {
										padding-right: 0;
									}
								`}
							>
								<span>
									{amountType === 'fee'
										? __('Fee', 'surecart')
										: __('Discount', 'surecart')}
								</span>
								<ScIcon name="chevron-down" />
							</ScButton>
							<ScMenu>
								<ScMenuItem
									onClick={() =>
										updatePrice({
											setup_fee_amount: Math.abs(
												price.setup_fee_amount
											),
										})
									}
								>
									{__('Fee', 'surecart')}
								</ScMenuItem>
								<ScMenuItem
									onClick={() =>
										updatePrice({
											setup_fee_amount: -Math.abs(
												price.setup_fee_amount
											),
											setup_fee_trial_enabled: true,
										})
									}
								>
									{__('Discount', 'surecart')}
								</ScMenuItem>
							</ScMenu>
						</ScDropdown>
					</ScPriceInput>
				</div>
			)}
		</ScUpgradeRequired>
	);
};
