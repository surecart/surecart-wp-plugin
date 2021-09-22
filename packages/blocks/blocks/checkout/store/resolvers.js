import STORE_KEY from '../../../../../resources/scripts/admin/store/data/constants';
import { fetch as apiFetch } from '../../../../../resources/scripts/admin/store/data/controls';
import { controls } from '@wordpress/data';

export default {
	*selectModelById( path, id ) {
		if ( path != 'product' ) {
			return;
		}

		// fetch
		try {
			const response = yield apiFetch( {
				path: `products/${ id }`,
			} );
			return yield controls.dispatch(
				STORE_KEY,
				'setModelById',
				'products',
				response,
				id
			);
		} catch ( error ) {
			console.error( error );
		}
	},
};
