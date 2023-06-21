/**
 * External dependencies.
 */
import { render } from '@wordpress/element';

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
render(<ProductCollections />, document.getElementById('app'));
