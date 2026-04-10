/**
 * Products admin — SPA entry point.
 *
 * Mounts the unified ProductsApp which handles list, create, and edit views
 * via client-side routing (no full page reloads).
 */
import { createRoot } from '@wordpress/element';
import '../store/add-entities';
import ProductsApp from './ProductsApp';

const container = document.getElementById('sc-products-list-app');
if (container) {
	const root = createRoot(container);
	root.render(<ProductsApp />);
}
