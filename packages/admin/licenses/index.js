import { render } from '@wordpress/element';

/**
 * register store and entities.
 */
import './store/register';

/**
 * App
 */
import License from './License';

/**
 * Render
 */
render(<License />, document.getElementById('app'));
