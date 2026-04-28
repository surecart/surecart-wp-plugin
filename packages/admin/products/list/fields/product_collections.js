/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';

// `elements` must be a static array — the bundled `@wordpress/dataviews/wp`
// silently drops filters whose `elements` is a function.
export default ({ elements } = {}) => ({
	id: 'product_collections',
	label: __('Collections', 'surecart'),
	enableSorting: false,
	filterBy: { operators: ['isAny'] },
	elements: Array.isArray(elements) ? elements : [],
	getValue: ({ item }) =>
		(item?.product_collections?.data || []).map((c) => c.id),
	render: ({ item }) => {
		const itemCollections = item?.product_collections?.data || [];
		if (!itemCollections.length) return '-';
		return (
			<div
				css={css`
					display: flex;
					flex-wrap: wrap;
					gap: 4px;
				`}
			>
				{itemCollections.map((collection) => (
					<span key={collection.id}>{collection.name}</span>
				))}
			</div>
		);
	},
});
