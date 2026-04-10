/**
 * Product Collections admin — SPA entry point.
 *
 * Mounts the unified ProductCollectionsApp which handles list, create, and edit views
 * via client-side routing (no full page reloads).
 */
import { createRoot } from '@wordpress/element';
import '../store/add-entities';
import ProductCollectionsApp from './ProductCollectionsApp';

const container = document.getElementById('sc-product-collections-list-app');
if (container) {
	const root = createRoot(container);
	root.render(<ProductCollectionsApp />);
}
