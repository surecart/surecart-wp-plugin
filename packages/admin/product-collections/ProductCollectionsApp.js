/**
 * ProductCollectionsApp — Single-page router for the product collections admin.
 *
 * Renders the list, create, or edit view based on URL state,
 * using pushState navigation (no full page reloads).
 */
import useProductCollectionsNavigation from './useProductCollectionsNavigation';
import AdminSpaLayout from '../components/AdminSpaLayout';
import ProductCollectionsList from './ProductCollectionsList';
import ProductCollections from './ProductCollections';

export default function ProductCollectionsApp() {
	const navigation = useProductCollectionsNavigation();

	return (
		<AdminSpaLayout
			navigation={navigation}
			renderList={(nav) => <ProductCollectionsList navigation={nav} />}
			renderDetail={(nav) => <ProductCollections navigation={nav} />}
		/>
	);
}
