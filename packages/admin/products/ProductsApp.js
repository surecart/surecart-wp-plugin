/**
 * ProductsApp — SPA root for `?page=sc-products`.
 */
import { Suspense, lazy } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

import { RouterProvider } from '../router';
import ErrorBoundary from '../components/error-boundary';
import PageLoader from '../components/PageLoader';
import ProductsList from './ProductsList';
import useAdminSpaNavigation from '../hooks/useAdminSpaNavigation';

const Product = lazy(() =>
	import(/* webpackChunkName: "sc-products-detail" */ './Product')
);

const PAGE_SLUG = 'sc-products';

function ProductsRouter() {
	const navigation = useAdminSpaNavigation(PAGE_SLUG);

	if (navigation.isList) {
		return (
			<div className="wrap">
				<ProductsList navigation={navigation} />
			</div>
		);
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

export function getProductsUrl(extra = {}) {
	return addQueryArgs('admin.php', { page: PAGE_SLUG, ...extra });
}
