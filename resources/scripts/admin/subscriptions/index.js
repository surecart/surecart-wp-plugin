import { render } from '@wordpress/element';

/**
 * register store and entities.
 */
import './store/register';

/**
 * App
 */
import Subscription from './Subscription';

/**
 * Render
 */
render( <Subscription />, document.getElementById( 'app' ) );
