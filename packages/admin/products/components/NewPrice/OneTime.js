/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import { ScPriceInput, ScSwitch } from '@surecart/components-react';

export default ({ price, updatePrice }) => {
	return (
		<div
			css={css`
				display: grid;
				gap: var(--sc-form-row-spacing);
			`}
		>
			<div
				css={css`
					display: grid;
					gap: var(--sc-spacing-small);
				`}
			>
				<ScPriceInput
					css={css`
						flex: 1 1 75%;
					`}
					label={__('Price', 'surecart')}
					className="sc-price-amount"
					showCode
					currencyCode={scData.currency_code}
					value={price?.amount}
					name="price"
					onScChange={(e) => {
						updatePrice({ amount: e.target.value });
					}}
					autofocus
					required
				/>
				<ScSwitch
					checked={price?.ad_hoc}
					onScChange={(e) =>
						updatePrice({ ad_hoc: e.target.checked })
					}
				>
					{__('Allow customers to pay what they want', 'surecart')}
				</ScSwitch>
			</div>

			{price?.ad_hoc && (
				<div
					css={css`
						display: flex;
						gap: var(--sc-form-row-spacing);

						> * {
							flex: 1;
						}
					`}
				>
					<ScPriceInput
						label={__('Minimum Amount', 'surecart')}
						className="sc-ad-hoc-min-amount"
						currencyCode={scData.currency_code}
						value={price?.ad_hoc_min_amount}
						onScChange={(e) =>
							updatePrice({
								ad_hoc_min_amount: e.target.value,
							})
						}
					/>
					<ScPriceInput
						label={__('Maximum Amount', 'surecart')}
						className="sc-ad-hoc-max-amount"
						currencyCode={scData.currency_code}
						value={price?.ad_hoc_max_amount}
						min={price?.ad_hoc_min_amount / 100}
						onScChange={(e) =>
							updatePrice({
								ad_hoc_max_amount: e.target.value,
							})
						}
					/>
				</div>
			)}
		</div>
	);
};
