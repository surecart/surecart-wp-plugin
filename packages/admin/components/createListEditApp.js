/**
 * createListEditApp — SPA root factory for admin pages that follow the
 * `list + lazy-loaded edit` shape (Products, Product Collections, …).
 *
 * The list is bundled eagerly (first paint); the edit view is split off into
 * its own webpack chunk and fetched on first navigation.
 *
 * @example
 *   export default createListEditApp({
 *     pageSlug: 'sc-products',
 *     ListComponent: ProductsList,
 *     loadEditComponent: () =>
 *       import(\/* webpackChunkName: "sc-products-detail" *\/ './Product'),
 *   });
 *
 * @param {Object}   config
 * @param {string}   config.pageSlug           WP admin page slug (e.g. 'sc-products').
 * @param {Function} config.ListComponent      React component for the list view.
 * @param {Function} config.loadEditComponent  Dynamic import returning the edit component.
 */
import { Suspense, lazy, useEffect } from '@wordpress/element';

import { RouterProvider } from '../router';
import ErrorBoundary from './error-boundary';
import PageLoader from './PageLoader';
import useAdminSpaNavigation from '../hooks/useAdminSpaNavigation';

/**
 * Toggle the PHP-rendered `#sc-admin-header` in sync with the SPA route.
 *
 * The server-side header (breadcrumb bar) is rendered on first load for the
 * list view. When the SPA navigates client-side to edit/create, the edit view
 * renders its own breadcrumb, so the server-side bar has to be hidden to avoid
 * two stacked headers. It's restored when the user returns to the list.
 */
function useServerHeaderVisibility(isVisible) {
	useEffect(() => {
		const header = document.getElementById('sc-admin-header');
		if (!header) return undefined;

		const previous = header.style.display;
		header.style.display = isVisible ? previous || '' : 'none';

		return () => {
			header.style.display = previous;
		};
	}, [isVisible]);
}

export default function createListEditApp({
	pageSlug,
	ListComponent,
	loadEditComponent,
}) {
	const EditComponent = lazy(loadEditComponent);

	function Router() {
		const navigation = useAdminSpaNavigation(pageSlug);

		useServerHeaderVisibility(navigation.isList);

		if (navigation.isList) {
			return (
				<div className="wrap">
					<ListComponent navigation={navigation} />
				</div>
			);
		}

		return (
			<Suspense fallback={<PageLoader />}>
				<EditComponent navigation={navigation} />
			</Suspense>
		);
	}

	return function App() {
		return (
			<RouterProvider>
				<ErrorBoundary>
					<Router />
				</ErrorBoundary>
			</RouterProvider>
		);
	};
}
