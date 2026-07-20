/**
 * BundlesApp — SPA root for `?page=sc-bundles`.
 *
 * Bundles are products with `bundle: true`; the detail chunk reuses the shared
 * EditProduct UI and the bulk-delete confirm is shared with products.
 */
import { addQueryArgs } from '@wordpress/url';

import createListEditApp from '../components/createListEditApp';
import BundlesList from './BundlesList';

const PAGE_SLUG = 'sc-bundles';

export default createListEditApp({
	pageSlug: PAGE_SLUG,
	ListComponent: BundlesList,
	loadEditComponent: () =>
		import(/* webpackChunkName: "sc-bundles-detail" */ './Bundle'),
	loadBulkDeleteComponent: () =>
		import(
			/* webpackChunkName: "sc-bundles-bulk-delete" */ '../products/BulkDeleteConfirm'
		),
});

export function getBundlesUrl(extra = {}) {
	return addQueryArgs('admin.php', { page: PAGE_SLUG, ...extra });
}
