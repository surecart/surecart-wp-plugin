import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { dispatch } from '@wordpress/data';

dispatch(coreStore).addEntities([
	{
		name: 'license',
		kind: 'surecart',
		label: __('License', 'surecart'),
		baseURL: 'surecart/v1/licences',
		baseURLParams: {
			context: 'edit',
			expand: ['purchase', 'purchase.customer', 'purchase.product'],
			cached: 0,
		},
	},
	{
		name: 'activation',
		kind: 'surecart',
		label: __('Activation', 'surecart'),
		baseURL: 'surecart/v1/activations',
		baseURLParams: { context: 'edit', cached: 0 },
	},
]);
