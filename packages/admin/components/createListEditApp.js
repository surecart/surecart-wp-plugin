import { Suspense, lazy, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

import { RouterProvider } from '../router';
import ErrorBoundary from './error-boundary';
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

		// Prefetch the edit chunk as soon as the app mounts — by the time the
		// user clicks Edit, the module is cached, Suspense resolves
		// synchronously, and the only loading state visible is the edit
		// component's own layout-matched skeleton.
		useEffect(() => {
			loadEditComponent();
		}, []);

		if (navigation.isList) {
			if (!window.scData?.enhanced_admin_views_enabled) {
				window.location.href = addQueryArgs('admin.php', {
					page: pageSlug,
				});
				return null;
			}

			return (
				<div className="wrap">
					<ListComponent navigation={navigation} />
				</div>
			);
		}

		// Fallback is `null` on purpose: the edit component renders its own
		// skeleton that matches its final layout. A generic fallback here
		// causes a double-skeleton flash and layout shift.
		return (
			<Suspense fallback={null}>
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
