/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { __, sprintf } from '@wordpress/i18n';

export default function StockCell({ tracked, available }) {
	if (!tracked) {
		return (
			<span
				css={css`
					color: var(--sc-color-gray-500);
				`}
			>
				∞
			</span>
		);
	}

	const isOutOfStock = available === 0;

	return (
		<span
			css={
				isOutOfStock
					? css`
							color: var(--sc-color-danger-500);
							font-weight: 500;
					  `
					: undefined
			}
		>
			{sprintf(
				/* translators: %d is the number of available units in stock */
				__('%d available', 'surecart'),
				available
			)}
		</span>
	);
}
