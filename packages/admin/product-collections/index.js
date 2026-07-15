/**
 * External dependencies.
 */
import { createRoot } from '@wordpress/element';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import ProductCollectionsApp from './ProductCollectionsApp';

/**
 * Render
 */
const container = document.getElementById('sc-product-collections-app');
if (container) {
	createRoot(container).render(<ProductCollectionsApp />);
}
