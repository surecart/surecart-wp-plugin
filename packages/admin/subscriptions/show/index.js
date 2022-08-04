/**
 * register store and entities.
 */
import '../../store/add-entities';

/**
 * App
 */
import ShowSubscription from './ShowSubscription';
import { render } from '@wordpress/element';

/**
 * Render
 */
render(<ShowSubscription />, document.getElementById('app'));
