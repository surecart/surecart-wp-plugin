/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import {
	ScInput,
	ScPremiumTag,
	ScPriceInput,
	ScSwitch,
	ScUpgradeRequired,
} from '@surecart/components-react';

export default ({ price, updatePrice }) => {
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
				{__('Setup fee', 'surecart')}
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
						> * {
							flex: 1;
						}
					`}
				>
					<ScInput
						label={__('Setup fee name', 'surecart')}
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
						label={__('Setup fee amount', 'surecart')}
						currencyCode={price?.currency || scData.currency_code}
						value={price?.setup_fee_amount}
						onScInput={(e) =>
							updatePrice({
								setup_fee_amount: e.target.value,
							})
						}
						required
					/>
				</div>
			)}
		</ScUpgradeRequired>
	);
};
