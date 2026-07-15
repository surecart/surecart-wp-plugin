import { Suspense, lazy, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

import { RouterProvider } from '../router';
import ErrorBoundary from './error-boundary';
import DetailSkeleton from './DetailSkeleton';
import useAdminSpaNavigation from '../hooks/useAdminSpaNavigation';

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
	loadBulkDeleteComponent,
}) {
	const EditComponent = lazy(loadEditComponent);
	const BulkDeleteComponent = loadBulkDeleteComponent
		? lazy(loadBulkDeleteComponent)
		: null;

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

		return (
			<Suspense fallback={<DetailSkeleton />}>
				{navigation.isBulkDelete && BulkDeleteComponent ? (
					<BulkDeleteComponent navigation={navigation} />
				) : (
					<EditComponent navigation={navigation} />
				)}
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
