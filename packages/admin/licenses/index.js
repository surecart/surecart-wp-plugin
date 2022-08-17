import { render } from '@wordpress/element';

/**
 * App
 */
import License from './License';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * Render
 */
render(<License />, document.getElementById('app'));
