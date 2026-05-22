/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';

export default () => ({
	id: 'stars',
	label: __('Rating', 'surecart'),
	enableSorting: true,
	getValue: ({ item }) => item?.stars ?? 0,
	render: ({ item }) => (
		<div
			css={css`
				display: inline-flex;
				align-items: center;
				gap: 6px;
			`}
		>
			<sc-review-stars
				rating={item?.stars ?? 0}
				color="#fbbf24"
			></sc-review-stars>
			<span
				css={css`
					color: var(--sc-color-gray-500);
					font-size: 13px;
				`}
			>
				({item?.stars ?? 0})
			</span>
		</div>
	),
});
