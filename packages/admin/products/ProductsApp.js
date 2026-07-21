/**
 * ProductsApp — SPA root for `?page=sc-products`.
 */
import { addQueryArgs } from '@wordpress/url';

import createListEditApp from '../components/createListEditApp';
import ProductsList from './ProductsList';

const PAGE_SLUG = 'sc-products';

export default createListEditApp({
	pageSlug: PAGE_SLUG,
	ListComponent: ProductsList,
	loadEditComponent: () =>
		import(/* webpackChunkName: "sc-products-detail" */ './Product'),
	loadBulkDeleteComponent: () =>
		import(
			/* webpackChunkName: "sc-products-bulk-delete" */ './BulkDeleteConfirm'
		),
});

export function getProductsUrl(extra = {}) {
	return addQueryArgs('admin.php', { page: PAGE_SLUG, ...extra });
}
