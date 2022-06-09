import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { dispatch } from '@wordpress/data';

dispatch(coreStore).addEntities([
	{
		name: 'subscription_protocol',
		kind: 'surecart',
		label: __('Subscription Protocol', 'surecart'),
		baseURL: 'surecart/v1',
		key: 'object',
		baseURLParams: { context: 'edit' },
	},
]);
