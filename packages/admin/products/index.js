import { createRoot } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * App
 */
import Product from './Product';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * Render
 */
const root = createRoot(document.getElementById('app'));
root.render(<Product />);
