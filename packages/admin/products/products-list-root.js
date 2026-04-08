import { createRoot } from '@wordpress/element';

/**
 * App
 */
import ProductsList from './ProductsList';

/**
 * Register store and entities.
 */
import '../store/add-entities';

/**
 * Render the products list DataView.
 */
const container = document.getElementById( 'sc-products-list-app' );
if ( container ) {
	const root = createRoot( container );
	root.render( <ProductsList /> );
}
