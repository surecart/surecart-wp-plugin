import { render } from '@wordpress/element';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import AbandonedCheckoutStats from './AbandonedCheckoutStats';

/**
 * Render
 */
render(<AbandonedCheckoutStats />, document.getElementById('stats'));
