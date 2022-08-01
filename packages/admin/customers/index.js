import { render } from '@wordpress/element';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import Customers from './Customers';

/**
 * Render
 */
render(<Customers />, document.getElementById('app'));
