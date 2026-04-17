/**
 * ProductCollectionsApp — Standalone SPA root for the Product Collections page.
 *
 * Mirrors `ProductsApp.js`: RouterProvider at the top, useLocation-driven
 * view selection, lazy-loaded detail chunk. No shell, no sidebar hijack.
 */
import { Suspense, lazy, useEffect } from '@wordpress/element';

import { RouterProvider, useHistory } from '../router';
import ErrorBoundary from '../components/error-boundary';
import PageLoader from '../components/PageLoader';
import ProductCollectionsList from './ProductCollectionsList';
import useAdminSpaNavigation from '../hooks/useAdminSpaNavigation';

const ProductCollections = lazy(() =>
	import(
		/* webpackChunkName: "sc-product-collections-detail" */ './ProductCollections'
	)
);

const PAGE_SLUG = 'sc-product-collections';

/**
 * Sync the PHP-rendered list header with the current view.
 *
 * On detail/create views we hide it; on list view we show it and intercept
 * the "Add Collection" anchor so it pushes a client-side route.
 */
function useHeaderSync(isList) {
	const history = useHistory();

	useEffect(() => {
		const header = document.getElementById(
			'sc-product-collections-list-header'
		);
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
			'#sc-product-collections-list-header [data-test-id="add-new-button"]'
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

function useWrapClass(isList) {
	useEffect(() => {
		const el = document.getElementById('sc-product-collections-app');
		if (!el) {
			return;
		}
		el.classList.toggle('wrap', isList);
	}, [isList]);
}

function ProductCollectionsRouter() {
	const navigation = useAdminSpaNavigation(PAGE_SLUG);
	useHeaderSync(navigation.isList);
	useWrapClass(navigation.isList);

	if (navigation.isList) {
		return <ProductCollectionsList navigation={navigation} />;
	}

	return (
		<Suspense fallback={<PageLoader />}>
			<ProductCollections navigation={navigation} />
		</Suspense>
	);
}

export default function ProductCollectionsApp() {
	return (
		<RouterProvider>
			<ErrorBoundary>
				<ProductCollectionsRouter />
			</ErrorBoundary>
		</RouterProvider>
	);
}
