import { render } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * register store entities.
 */
import '@admin/schema/register';

/**
 * Register store.
 */
import './store/register';

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
