import { createRoot } from '@wordpress/element';

/**
 * App
 */
import Bundle from './Bundle';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * Render
 */
const root = createRoot(document.getElementById('app'));
root.render(<Bundle />);
