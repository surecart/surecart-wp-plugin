import { store } from '../../store/data';
import { fetch as apiFetch } from '../../store/data/controls';
import { controls } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default {
	*selectCustomer() {
		// maybe get from url.
		const id = yield controls.resolveSelect( store, 'selectPageId' );
		if ( ! id ) return {};

		const request = yield controls.resolveSelect(
			store,
			'prepareFetchRequest',
			'customers',
			{ id, expand: [ 'billing_address', 'shipping_address', 'user' ] }
		);

		// fetch and normalize
		try {
			// we need prices.
			const customer = yield apiFetch( request );
			if ( ! customer?.id ) return;
			return yield controls.dispatch( store, 'addModels', {
				customerss: [ customers ],
			} );
		} catch ( error ) {
			// set critical error. We don't want to display the UI if we can't load the model.
			yield controls.dispatch( store, 'setError', error );
		}
	},
};
