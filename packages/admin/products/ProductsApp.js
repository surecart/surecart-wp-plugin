/**
 * ProductsApp — Single-page router for the products admin.
 *
 * Renders the list, create, or edit view based on URL state,
 * using pushState navigation (no full page reloads).
 */
import useProductsNavigation from './useProductsNavigation';
import AdminSpaLayout from '../components/AdminSpaLayout';
import ProductsList from './ProductsList';
import Product from './Product';

export default function ProductsApp() {
	const navigation = useProductsNavigation();

	return (
		<AdminSpaLayout
			navigation={navigation}
			renderList={(nav) => <ProductsList navigation={nav} />}
			renderDetail={(nav) => <Product navigation={nav} />}
		/>
	);
}
