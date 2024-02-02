import { render } from '@wordpress/element';

/**
 * App
 */
import Upsells from './Upsells';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * Render
 */
render(<Upsells />, document.getElementById('app'));
