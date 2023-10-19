/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * Internal dependencies.
 */
import { getVariantLabel } from '../util/variation';

export default ({ lineItem, children }) => {
	const variantLabel = getVariantLabel(lineItem?.variant_options);
	const priceName = lineItem?.price?.name;

	return (
		<span
			css={css`
				color: var(
					--sc-price-label-color,
					var(--sc-input-help-text-color)
				);
				font-size: var(
					--sc-price-label-font-size,
					var(--sc-input-help-text-font-size-medium)
				);
				line-height: var(--sc-line-height-dense);
			`}
		>
			<div>{variantLabel}</div>
			{!!variantLabel && !!lineItem?.variant?.sku && (
				<div>
					{__('SKU:', 'surecart')} {lineItem?.variant?.sku}
				</div>
			)}
			{!variantLabel && lineItem?.price?.product?.sku && (
				<div>
					{__('SKU:', 'surecart')} {lineItem?.price?.product?.sku}
				</div>
			)}
			<div>{priceName}</div>
			<div>{children}</div>
		</span>
	);
};
