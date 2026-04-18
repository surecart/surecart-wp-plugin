/**
 * ProductCollectionsApp — SPA root for `?page=sc-product-collections`.
 */
import createListEditApp from '../components/createListEditApp';
import ProductCollectionsList from './ProductCollectionsList';

export default createListEditApp({
	pageSlug: 'sc-product-collections',
	ListComponent: ProductCollectionsList,
	loadEditComponent: () =>
		import(
			/* webpackChunkName: "sc-product-collections-detail" */ './ProductCollections'
		),
});
