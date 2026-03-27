import { render } from '@wordpress/element';

/**
 * App
 */
import Funnels from './Funnels';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * Render
 */
render(<Funnels />, document.getElementById('app'));
