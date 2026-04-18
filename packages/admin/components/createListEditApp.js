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
import { Suspense, lazy } from '@wordpress/element';

import { RouterProvider } from '../router';
import ErrorBoundary from './error-boundary';
import PageLoader from './PageLoader';
import useAdminSpaNavigation from '../hooks/useAdminSpaNavigation';

export default function createListEditApp({
	pageSlug,
	ListComponent,
	loadEditComponent,
}) {
	const EditComponent = lazy(loadEditComponent);

	function Router() {
		const navigation = useAdminSpaNavigation(pageSlug);

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
