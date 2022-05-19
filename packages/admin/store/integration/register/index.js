import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { dispatch } from '@wordpress/data';

dispatch(coreStore).addEntities([
	{
		name: 'integration',
		kind: 'surecart',
		label: __('Integration', 'surecart'),
		baseURL: 'surecart/v1/integrations',
		baseURLParams: { context: 'edit', per_page: 100 },
	},
	{
		name: 'integration_draft',
		kind: 'surecart',
		label: __('Integration', 'surecart'),
		__experimentalNoFetch: true,
		noFetch: true,
	},
	{
		name: 'integration_provider',
		kind: 'surecart',
		label: __('Integration Providers', 'surecart'),
		key: 'name',
		baseURL: 'surecart/v1/integration_providers',
		baseURLParams: { context: 'edit', per_page: 100 },
	},
	{
		name: 'integration_provider_item',
		kind: 'surecart',
		label: __('Integration Provider Items', 'surecart'),
		baseURL: 'surecart/v1/integration_provider_items',
		baseURLParams: { context: 'edit', per_page: 100 },
	},
]);
