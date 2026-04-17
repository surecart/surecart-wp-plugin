/**
 * ProductCollectionsApp — SPA root for `?page=sc-product-collections`.
 */
import { Suspense, lazy } from '@wordpress/element';

import { RouterProvider } from '../router';
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

function ProductCollectionsRouter() {
	const navigation = useAdminSpaNavigation(PAGE_SLUG);

	if (navigation.isList) {
		return (
			<div className="wrap">
				<ProductCollectionsList navigation={navigation} />
			</div>
		);
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
