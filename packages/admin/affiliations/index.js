/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import Affiliation from './Affiliation';
import { render } from '@wordpress/element';

/**
 * Render
 */
render(<Affiliation />, document.getElementById('app'));
