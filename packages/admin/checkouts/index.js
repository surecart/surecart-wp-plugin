import { render } from '@wordpress/element';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import CreateCheckout from './CreateCheckout';

/**
 * Render
 */
render(<CreateCheckout />, document.getElementById('app'));
