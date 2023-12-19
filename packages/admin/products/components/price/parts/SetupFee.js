/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __, sprintf } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

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
	fee: __('fee', 'surecart'),
	discount: __('discount', 'surecart'),
};

export default ({ price, updatePrice }) => {
	const [amountType, setAmountType] = useState(() => {
		if (price.setup_fee_amount < 0) {
			return 'discount';
		}

		return 'fee';
	});

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
				{__('Add discount/fee', 'surecart')}
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
							__('Setup %s name', 'surecart'),
							SETUP_AMOUNT_TYPES[amountType]
						)}
						value={price?.setup_fee_name}
						onScInput={(e) => {
							updatePrice({
								setup_fee_name: e.target.value,
							});
						}}
						name="name"
						required
					/>
					<ScPriceInput
						label={sprintf(
							__('Setup %s amount', 'surecart'),
							SETUP_AMOUNT_TYPES[amountType]
						)}
						currencyCode={price?.currency || scData.currency_code}
						value={Math.abs(price?.setup_fee_amount)}
						onScInput={(e) =>
							updatePrice({
								setup_fee_amount:
									amountType === 'fee'
										? e.target.value
										: -e.target.value,
							})
						}
						required
					>
						<ScDropdown
							slot="suffix"
							placement="bottom-end"
							css={css`
								margin-right: var(--sc-spacing-x-small);
							`}
						>
							<ScButton
								type="text"
								slot="trigger"
								circle
								css={css`
									text-transform: capitalize;
								`}
							>
								{SETUP_AMOUNT_TYPES[amountType]}
								<ScIcon name="chevron-down" />
							</ScButton>
							<ScMenu>
								{Object.keys(SETUP_AMOUNT_TYPES).map((type) => (
									<ScMenuItem
										onClick={() => {
											setAmountType(type);
											updatePrice({
												setup_fee_amount:
													type === 'fee'
														? Math.abs(
																price.setup_fee_amount
														  )
														: -Math.abs(
																price.setup_fee_amount
														  ),
											});
										}}
										key={type}
										css={css`
											text-transform: capitalize;
										`}
									>
										{SETUP_AMOUNT_TYPES[type]}
									</ScMenuItem>
								))}
							</ScMenu>
						</ScDropdown>
					</ScPriceInput>
				</div>
			)}
		</ScUpgradeRequired>
	);
};
