/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { addQueryArgs } from '@wordpress/url';

// Clicking the product name filters the list to that product's reviews.
const reviewsByProductUrl = (productId) =>
	addQueryArgs('admin.php', {
		page: 'sc-reviews',
		sc_product: productId,
	});

// `elements` must be a static array — see products/list/fields/product_collections.js.
export default ({ elements, navigation } = {}) => ({
	id: 'product',
	label: __('Product', 'surecart'),
	enableSorting: false,
	filterBy: { operators: ['isAny'] },
	elements: Array.isArray(elements) ? elements : [],
	getValue: ({ item }) => (item?.product?.id ? [item.product.id] : []),
	render: ({ item }) => {
		const product = item?.product;
		if (!product) return '-';
		if (!product.id) return product.name || '-';
		return (
			<a
				href={reviewsByProductUrl(product.id)}
				title={product.name}
				onClick={(e) => {
					// Modified clicks fall through to native (new tab etc.).
					if (
						navigation &&
						!e.metaKey &&
						!e.ctrlKey &&
						!e.shiftKey &&
						!e.altKey &&
						e.button === 0
					) {
						e.preventDefault();
						navigation.navigateTo({ sc_product: product.id });
					}
				}}
				css={css`
					display: inline-block;
					max-width: 200px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					vertical-align: middle;
					color: var(--sc-color-primary-500);
					text-decoration: none;
					&:hover {
						text-decoration: underline;
					}
				`}
			>
				{product.name}
			</a>
		);
	},
});
