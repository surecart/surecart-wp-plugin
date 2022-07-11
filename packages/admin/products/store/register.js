import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { dispatch } from '@wordpress/data';

dispatch(coreStore).addEntities([
	{
		name: 'product',
		kind: 'surecart',
		label: __('Product', 'surecart'),
		baseURL: 'surecart/v1/products',
		baseURLParams: {
			context: 'edit',
			expand: ['files', 'image'],
			cached: 0,
		},
	},
	{
		name: 'price',
		kind: 'surecart',
		label: __('Price', 'surecart'),
		baseURL: 'surecart/v1/prices',
		baseURLParams: { context: 'edit', cached: 0 },
	},
	{
		name: 'media',
		kind: 'surecart',
		label: __('Media', 'surecart'),
		baseURL: 'surecart/v1/medias',
		baseURLParams: { context: 'edit', cached: 0 },
	},
	{
		name: 'download',
		kind: 'surecart',
		label: __('Download', 'surecart'),
		baseURL: 'surecart/v1/downloads',
		baseURLParams: { context: 'edit', cached: 0, expand: ['media'] },
	},
]);
