/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import { ScInput, ScPriceInput, ScSwitch } from '@surecart/components-react';

export default ({ price, updatePrice }) => {
	const onToggleSwitch = (e) => {
		const setupFeeEnabled = e.target.checked;
		if (!setupFeeEnabled) {
			updatePrice({
				setup_fee_enabled: false,
				setup_fee_name: null,
				setup_fee_amount: 0,
			});

			return;
		}
		updatePrice({ setup_fee_enabled: true });
	};

	return (
		<>
			<ScSwitch
				checked={price.setup_fee_enabled}
				onScChange={onToggleSwitch}
			>
				{__('Add setup fee', 'surecart')}
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
					/>
				</div>
			)}
		</>
	);
};
