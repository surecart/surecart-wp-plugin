import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { dispatch } from '@wordpress/data';

dispatch(coreStore).addEntities([
	{
		name: 'tax_registration',
		kind: 'surecart',
		label: __('Tax Registration', 'surecart'),
		baseURL: 'surecart/v1/tax_registrations',
		baseURLParams: { context: 'edit' },
	},
	{
		name: 'tax_zone',
		kind: 'surecart',
		label: __('Tax Zone', 'surecart'),
		baseURL: 'surecart/v1/tax_zones',
		baseURLParams: { context: 'edit' },
	},
]);
