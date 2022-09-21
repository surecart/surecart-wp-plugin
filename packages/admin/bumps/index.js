import { render } from '@wordpress/element';

/**
 * App
 */
import Bumps from './Bumps';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * Render
 */
render(<Bumps />, document.getElementById('app'));
