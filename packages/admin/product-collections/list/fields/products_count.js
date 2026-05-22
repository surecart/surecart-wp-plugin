/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { addQueryArgs } from '@wordpress/url';

const getProductsUrl = (collectionId) =>
	addQueryArgs('admin.php', {
		page: 'sc-products',
		sc_collection: collectionId,
	});

// Filterable on the visible column itself so the column-header gets "Add filter".
export default ({ elements } = {}) => ({
	id: 'products_count',
	label: __('Products', 'surecart'),
	enableSorting: true,
	filterBy: { operators: ['isAny'] },
	elements: Array.isArray(elements) ? elements : [],
	getValue: ({ item }) =>
		(item?.products?.data || []).map((p) => p.id),
	render: ({ item }) => (
		<a
			href={getProductsUrl(item?.id)}
			css={css`
				color: var(--sc-color-primary-500);
				text-decoration: none;
				&:hover {
					text-decoration: underline;
				}
			`}
		>
			{item?.products_count ?? 0}
		</a>
	),
});
