/**
 * External dependencies.
 */
import { createRoot } from '@wordpress/element';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App. Bundles share the Product entity and the EditProduct UI; the list
 * screen is rendered server-side via the PHP `BundlesListTable`.
 */
import EditBundle from './EditBundle';

/**
 * Render.
 */
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<EditBundle />);
