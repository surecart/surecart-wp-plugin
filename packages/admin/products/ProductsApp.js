/**
 * ProductsApp — Standalone SPA root for the Products admin page.
 *
 * Replaces the cross-page SPA shell for `?page=sc-products`. Mirrors the
 * pattern used by @wordpress/edit-site: a single RouterProvider at the top,
 * `useLocation()` for view selection, lazy-loaded heavy detail chunk.
 *
 * No sidebar interception, no MutationObserver, no DOM mutation effects.
 * The wp-admin sidebar behaves normally — clicking a different menu item
 * is a full page load, exactly like Gutenberg.
 */
import { Suspense, lazy, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

import { RouterProvider, useHistory } from '../router';
import ErrorBoundary from '../components/error-boundary';
import PageLoader from '../components/PageLoader';
import ProductsList from './ProductsList';
import useAdminSpaNavigation from '../hooks/useAdminSpaNavigation';

const Product = lazy(() =>
	import(/* webpackChunkName: "sc-products-detail" */ './Product')
);

const PAGE_SLUG = 'sc-products';

/**
 * Sync the PHP-rendered list header with the current view.
 *
 * The header markup is rendered server-side (see views/admin/products/spa.php).
 * On detail/create views we hide it; on list view we show it and intercept
 * the "Add Product" anchor so it pushes a client-side route instead of
 * reloading the page.
 */
function useHeaderSync(isList) {
	const history = useHistory();

	useEffect(() => {
		const header = document.getElementById('sc-products-list-header');
		if (header) {
			header.style.display = isList ? '' : 'none';
		}
		// Also hide the PHP-rendered breadcrumb bar on edit/create views.
		const breadcrumb = document.getElementById('sc-admin-container');
		if (breadcrumb) {
			breadcrumb.style.display = isList ? '' : 'none';
		}
	}, [isList]);

	useEffect(() => {
		const button = document.querySelector(
			'#sc-products-list-header [data-test-id="add-new-button"]'
		);
		if (!button) {
			return;
		}
		const handleClick = (e) => {
			if (
				e.metaKey ||
				e.ctrlKey ||
				e.shiftKey ||
				e.altKey ||
				e.button !== 0
			) {
				return;
			}
			e.preventDefault();
			history.push({ page: PAGE_SLUG, action: 'edit' });
		};
		button.addEventListener('click', handleClick);
		return () => button.removeEventListener('click', handleClick);
	}, [history]);
}

/**
 * Toggle .wrap on the app container — list view inherits wp-admin gutters,
 * detail view goes full-bleed (matching the legacy edit screen).
 */
function useWrapClass(isList) {
	useEffect(() => {
		const el = document.getElementById('sc-products-app');
		if (!el) {
			return;
		}
		el.classList.toggle('wrap', isList);
	}, [isList]);
}

function ProductsRouter() {
	const navigation = useAdminSpaNavigation(PAGE_SLUG);
	useHeaderSync(navigation.isList);
	useWrapClass(navigation.isList);

	if (navigation.isList) {
		return <ProductsList navigation={navigation} />;
	}

	return (
		<Suspense fallback={<PageLoader />}>
			<Product navigation={navigation} />
		</Suspense>
	);
}

export default function ProductsApp() {
	return (
		<RouterProvider>
			<ErrorBoundary>
				<ProductsRouter />
			</ErrorBoundary>
		</RouterProvider>
	);
}

/**
 * Convenience for non-router callers (e.g. legacy PHP-rendered links) to
 * compute a list-view URL for the products page. Kept here so the page slug
 * lives in one place.
 *
 * @param {Object} [extra]
 * @return {string}
 */
export function getProductsUrl(extra = {}) {
	return addQueryArgs('admin.php', { page: PAGE_SLUG, ...extra });
}
