/** @jsx jsx */
import { __, sprintf } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';

// Static elements — labels visible to the user, values match `stars` ints.
export const STARS_ELEMENTS = [
	{ value: '5', label: sprintf(__('%d stars', 'surecart'), 5) },
	{ value: '4', label: sprintf(__('%d stars', 'surecart'), 4) },
	{ value: '3', label: sprintf(__('%d stars', 'surecart'), 3) },
	{ value: '2', label: sprintf(__('%d stars', 'surecart'), 2) },
	{ value: '1', label: sprintf(__('%d star', 'surecart'), 1) },
];

export default () => ({
	id: 'stars',
	label: __('Rating', 'surecart'),
	enableSorting: true,
	filterBy: { operators: ['isAny'] },
	elements: STARS_ELEMENTS,
	getValue: ({ item }) =>
		item?.stars != null ? [String(item.stars)] : [],
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
