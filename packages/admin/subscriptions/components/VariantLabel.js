/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * Internal dependencies.
 */
import { getVariantLabel } from '../../util/variation';

export default ({ variantOptions = [] }) => {
	if (!variantOptions.length) {
		return '';
	}

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
			{''} ( {getVariantLabel(variantOptions)} ){''}
		</span>
	);
};
