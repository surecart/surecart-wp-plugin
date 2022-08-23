/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import Customer from './Customer';
import { render } from '@wordpress/element';

/**
 * Render
 */
render(<Customer />, document.getElementById('app'));
