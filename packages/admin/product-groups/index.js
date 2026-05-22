/**
 * External dependencies.
 */
import { createRoot } from '@wordpress/element';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App.
 */
import ProductGroupsApp from './ProductGroupsApp';

/**
 * Render.
 */
const container = document.getElementById('sc-product-groups-app');
if (container) {
	createRoot(container).render(<ProductGroupsApp />);
}
