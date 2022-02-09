import { render } from '@wordpress/element';

/**
 * register store entities.
 */
import './entities';

/**
 * App
 */
import Show from './Show';

/**
 * Render
 */
render(<Show />, document.getElementById('app'));
