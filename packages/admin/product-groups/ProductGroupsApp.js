/**
 * ProductGroupsApp — SPA root for `?page=sc-product-groups`.
 */
import createListEditApp from '../components/createListEditApp';
import ProductGroupsList from './ProductGroupsList';

export default createListEditApp({
	pageSlug: 'sc-product-groups',
	ListComponent: ProductGroupsList,
	loadEditComponent: () =>
		import(
			/* webpackChunkName: "sc-product-groups-detail" */ './ProductGroup'
		),
});
