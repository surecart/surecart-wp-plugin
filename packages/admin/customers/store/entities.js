import { __ } from '@wordpress/i18n';
import { store as dataStore } from '../../store/data';
import { store as coreStore } from '@wordpress/core-data';
import { dispatch } from '@wordpress/data';

// add entities.
dispatch(dataStore).registerEntities([
	{
		name: 'customers',
		baseURL: 'customers',
		baseURLParams: { context: 'edit' },
	},
]);

dispatch(coreStore).addEntities([
	{
		name: 'purchase',
		kind: 'root',
		label: __('Purchase', 'checkout_engine'),
		baseURL: 'checkout-engine/v1/purchases',
		baseURLParams: { context: 'edit' },
	},
]);
