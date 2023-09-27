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
import ProductCollections from './ProductCollections';

/**
 * Render
 */
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<ProductCollections />);
