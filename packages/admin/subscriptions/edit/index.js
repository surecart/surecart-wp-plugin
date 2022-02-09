import { render } from '@wordpress/element';

/**
 * register store entities.
 */
import './entities';

/**
 * App
 */
import Edit from './Edit';

/**
 * Render
 */
render(<Edit />, document.getElementById('app'));
