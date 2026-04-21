import { createRoot } from '@wordpress/element';

/**
 * App
 */
import ProductsApp from './ProductsApp';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * Render
 */
const container = document.getElementById('sc-products-app');
if (container) {
	createRoot(container).render(<ProductsApp />);
}
