import { render } from '@wordpress/element';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import AbandonedCheckout from './AbandonedCheckout';

/**
 * Render
 */
render(<AbandonedCheckout />, document.getElementById('app'));
