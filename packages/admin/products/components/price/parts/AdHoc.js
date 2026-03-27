/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import { ScPriceInput, ScSwitch } from '@surecart/components-react';

export default ({ price, updatePrice }) => {
	return (
		<div
			css={css`
				> *:not(:last-child) {
					margin-bottom: var(--sc-spacing-medium);
				}
			`}
		>
			<ScSwitch
				checked={price?.ad_hoc}
				onScChange={(e) => updatePrice({ ad_hoc: e.target.checked })}
			>
				{__('Pay what you want', 'surecart')}
				<span slot="description">
					{__(
						'Allow customers to pay any amount they want, ideal for donations or perceived value they place on your cause or service.',
						'surecart'
					)}
				</span>
			</ScSwitch>

			{!!price?.ad_hoc && (
				<div
					css={css`
						display: grid;
					`}
				>
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
							label={__('Minimum price', 'surecart')}
							className="sc-ad-hoc-min-amount"
							currencyCode={
								price?.currency || scData.currency_code
							}
							value={price?.ad_hoc_min_amount}
							onScInput={(e) =>
								updatePrice({
									ad_hoc_min_amount: e.target.value,
								})
							}
						/>
						<ScPriceInput
							label={__('Maximum price', 'surecart')}
							className="sc-ad-hoc-max-amount"
							currencyCode={
								price?.currency || scData.currency_code
							}
							value={price?.ad_hoc_max_amount}
							min={price?.ad_hoc_min_amount / 100}
							onScInput={(e) =>
								updatePrice({
									ad_hoc_max_amount: e.target.value,
								})
							}
						/>
					</div>
				</div>
			)}
		</div>
	);
};
