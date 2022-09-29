import { fetch as apiFetch } from '../../../../../resources/scripts/admin/store/data/controls';
import { mergeEntities } from './actions';
import { normalizeProducts, normalizePrices } from '@admin/utils/schema';

export default {
	*searchProducts(query) {
		try {
			const products = yield apiFetch({
				path: 'products',
				query: {
					query,
					archived: false,
				},
			});
			const { entities } = normalizeProducts(products);
			return yield mergeEntities(entities);
		} catch (error) {
			console.error(error);
		}
	},

	*selectPricesByProductId(id) {
		try {
			const prices = yield apiFetch({
				path: 'prices',
				product_ids: [id],
			});
			const { entities } = normalizePrices(prices);
			return yield mergeEntities(entities);
		} catch (error) {
			console.error(error);
		}
	},

	*selectPricesByIds(ids) {
		try {
			const product = yield apiFetch({
				path: `prices`,
				query: { ids },
			});
			const { entities } = normalizePrices(product);
			return yield mergeEntities(entities);
		} catch (error) {
			console.error(error);
		}
	},
};
