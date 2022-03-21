import { render } from '@wordpress/element';

/**
 * register store entities.
 */
import '@admin/schema/register';

/**
 * App
 */
import ProductGroup from './ProductGroup';

/**
 * Render
 */
render(<ProductGroup />, document.getElementById('app'));
