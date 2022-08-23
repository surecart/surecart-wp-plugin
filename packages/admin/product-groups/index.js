import { render } from '@wordpress/element';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import ProductGroup from './ProductGroup';

/**
 * Render
 */
render(<ProductGroup />, document.getElementById('app'));
