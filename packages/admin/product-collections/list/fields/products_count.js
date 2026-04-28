/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { addQueryArgs } from '@wordpress/url';

const getProductsUrl = (collectionId) =>
	addQueryArgs('admin.php', {
		page: 'sc-products',
		sc_collection: collectionId,
	});

export default () => ({
	id: 'products_count',
	label: __('Products', 'surecart'),
	enableSorting: true,
	getValue: ({ item }) => item?.products_count ?? 0,
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
