import { fetch as apiFetch } from '../../../../../resources/scripts/admin/store/data/controls';
import { mergeEntities } from './actions';
import {
	normalizeProducts,
	normalizePrices,
	normalizeProduct,
} from '../../../utils/schema';

export default {
	*searchProducts( query ) {
		try {
			const products = yield apiFetch( {
				path: 'products',
				query: {
					query,
					archived: false,
				},
			} );
			const { entities } = normalizeProducts( products );
			return yield mergeEntities( entities );
		} catch ( error ) {
			console.error( error );
		}
	},

	*selectPricesByProductId( id ) {
		try {
			const prices = yield apiFetch( {
				path: 'prices',
				product_ids: [ id ],
			} );
			const { entities } = normalizePrices( prices );
			return yield mergeEntities( entities );
		} catch ( error ) {
			console.error( error );
		}
	},

	*selectProductById( id ) {
		try {
			const product = yield apiFetch( {
				path: `products/${ id }`,
			} );
			const { entities } = normalizeProduct( product );
			return yield mergeEntities( entities );
		} catch ( error ) {
			console.error( error );
		}
	},

	*selectPricesByIds( ids ) {
		try {
			const product = yield apiFetch( {
				path: `prices`,
				ids,
			} );
			const { entities } = normalizePrices( product );
			return yield mergeEntities( entities );
		} catch ( error ) {
			console.error( error );
		}
	},
};
