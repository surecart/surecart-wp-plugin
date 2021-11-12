import { render } from '@wordpress/element';

/**
 * register store and entities.
 */
import './store/register';
import './store/entities';

/**
 * App
 */
import Product from './Product';

/**
 * Render
 */
render( <Product />, document.getElementById( 'app' ) );
