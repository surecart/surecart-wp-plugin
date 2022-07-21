import { render } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * register store entities.
 */
import '@admin/schema/register';

/**
 * Register integrations store.
 */
import '@admin/store/integration/register';

/**
 * App
 */
import Dashboard from './Dashboard';

/**
 * Render
 */
render(<Dashboard />, document.getElementById('app'));
