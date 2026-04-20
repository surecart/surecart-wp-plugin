/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScIcon } from '@surecart/components-react';

/**
 * Inline preview of bundle components shown under a bundle price row in
 * the product's Pricing module. Read-only — editing happens in the price
 * sidebar. Bundle items are expected to be expanded on the price via the
 * `useSelectPrices` hook.
 *
 * @param {object} props
 * @param {object} props.price Price entity (with bundle_items expanded).
 */
export default ({ price }) => {
	if (!price?.bundle) return null;

	const items = price?.bundle_items?.data || [];
	if (!items.length) return null;

	return (
		<ul
			css={css`
				list-style: none;
				padding: 0;
				margin: 16px 0 0 24px;
				display: grid;
				gap: 4px;
				font-size: 13px;
				color: var(--sc-color-gray-700);
			`}
		>
			{items.map((item) => {
				const product = item?.product || item?.price?.product;
				const name = product?.name || __('Item', 'surecart');
				const amount = item?.price?.display_amount || '';
				const variantName = item?.variant?.name || '';
				const qty = item?.quantity > 1 ? ` × ${item.quantity}` : '';

				return (
					<li
						key={item.id}
						css={css`
							display: grid;
							grid-template-columns: 16px 1fr auto;
							gap: 8px;
							align-items: center;
						`}
					>
						<ScIcon
							name="chevron-right"
							style={{ fontSize: '12px', opacity: 0.5 }}
						/>
						<span
							css={css`
								display: inline-flex;
								gap: 6px;
								align-items: baseline;
								flex-wrap: wrap;
							`}
						>
							<strong>{name}</strong>
							{variantName && (
								<span
									css={css`
										color: var(--sc-color-gray-500);
										font-size: 12px;
									`}
								>
									({variantName})
								</span>
							)}
						</span>
						<span
							css={css`
								color: var(--sc-color-gray-600);
								font-variant-numeric: tabular-nums;
							`}
						>
							{amount}
							{qty}
						</span>
					</li>
				);
			})}
		</ul>
	);
};
