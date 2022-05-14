import { render } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';

/**
 * register store entities.
 */
import '@admin/schema/register';

dispatch(coreStore).addEntities([
	{
		name: 'integration',
		kind: 'root',
		label: __('Integration', 'surecart'),
		baseURL: 'surecart/v1/integrations',
		baseURLParams: { context: 'edit', per_page: 100 },
	},
]);

/**
 * Register integrations store.
 */
import '@admin/store/integration/register';

/**
 * App
 */
import Product from './Product';

/**
 * Render
 */
render(<Product />, document.getElementById('app'));
