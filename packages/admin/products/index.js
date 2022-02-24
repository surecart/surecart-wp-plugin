import { render } from '@wordpress/element';

/**
 * register store entities.
 */
import '@admin/schema/register';

/**
 * App
 */
import Product from './Product';

/**
 * Render
 */
render(<Product />, document.getElementById('app'));
