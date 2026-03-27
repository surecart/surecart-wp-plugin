import { render } from '@wordpress/element';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import Invoice from './Invoice';

/**
 * Render
 */
render(<Invoice />, document.getElementById('app'));
