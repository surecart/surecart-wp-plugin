import { store as coreStore } from '@wordpress/core-data';
import { dispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

dispatch(coreStore).addEntities([
	{
		name: 'store',
		kind: 'surecart',
		label: __('Store', 'surecart'),
		baseURL: 'surecart/v1',
		key: 'object',
		baseURLParams: { context: 'edit', cached: 0 },
	},
	{
		name: 'media',
		kind: 'surecart',
		label: __('Media', 'surecart'),
		baseURL: 'surecart/v1/medias',
		baseURLParams: { context: 'edit', cached: 0 },
	},
]);
