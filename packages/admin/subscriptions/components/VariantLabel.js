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
				opacity: 0.65;
				font-size: 12px;
				line-height: 1.2;
			`}
		>
			{''} ( {getVariantLabel(variantOptions)} ){''}
		</span>
	);
};
