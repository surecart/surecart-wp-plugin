/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { getVariantLabel } from '../util/variation';
import { getSKUText } from '../util/products';

export default ({ lineItem, children, showPriceName = true }) => {
	const variantLabel = getVariantLabel(lineItem?.variant_options);
	const priceName = lineItem?.price?.name;
	const productSku = getSKUText(lineItem);

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
			{showPriceName && <div>{priceName}</div>}
			{!!productSku && (
				<div>
					{__('SKU:', 'surecart')} {productSku}
				</div>
			)}
			<div>{children}</div>
		</span>
	);
};
