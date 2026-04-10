/**
 * SPA Page Registry — Maps admin page slugs to their components and metadata.
 *
 * To add a new SPA page, import its list and detail components here
 * and add an entry to the PAGES map.
 */
import { __ } from '@wordpress/i18n';

import ProductsList from '../products/ProductsList';
import Product from '../products/Product';
import ProductCollectionsList from '../product-collections/ProductCollectionsList';
import ProductCollections from '../product-collections/ProductCollections';
import SettingsPage from '../settings/SettingsPage';

/**
 * Registry of SPA-enabled admin pages.
 *
 * Each entry maps a page slug to:
 *
 * For list/detail pages (Products, Collections, etc.):
 * - list:     React component for the list view
 * - detail:   React component for the create/edit view
 * - title:    List page title (for the PHP-like header)
 * - newLabel: "Add New" button text (set to null to hide)
 *
 * For single-component pages (Settings, etc.):
 * - component: React component that handles its own layout
 * - title:     Page title (used for sidebar active state, etc.)
 */
const PAGES = {
	'sc-products': {
		list: ProductsList,
		detail: Product,
		title: __('Products', 'surecart'),
		newLabel: __('Add New', 'surecart'),
	},
	'sc-product-collections': {
		list: ProductCollectionsList,
		detail: ProductCollections,
		title: __('Product Collections', 'surecart'),
		newLabel: __('Add New', 'surecart'),
	},
	'sc-settings': {
		component: SettingsPage,
		title: __('Settings', 'surecart'),
	},
};

export default PAGES;

/**
 * Get all registered SPA page slugs.
 *
 * @return {string[]} Array of page slugs.
 */
export function getSpaPageSlugs() {
	return Object.keys(PAGES);
}
