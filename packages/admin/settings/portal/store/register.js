import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { dispatch } from '@wordpress/data';

dispatch(coreStore).addEntities([
	{
		name: 'portal_protocol',
		kind: 'surecart',
		label: __('Portal Protocol', 'surecart'),
		baseURL: 'surecart/v1',
		key: 'object',
		baseURLParams: { context: 'edit' },
	},
]);
