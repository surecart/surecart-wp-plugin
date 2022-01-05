import { render } from '@wordpress/element';

/**
 * register store and entities.
 */
import './store/register';

/**
 * App
 */
import Order from './Order';

/**
 * Render
 */
render( <Order />, document.getElementById( 'app' ) );
