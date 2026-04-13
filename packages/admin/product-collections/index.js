import { createRoot } from '@wordpress/element';

import ProductCollectionsApp from './ProductCollectionsApp';
import '../store/add-entities';

const container = document.getElementById( 'sc-product-collections-app' );
if ( container ) {
	createRoot( container ).render( <ProductCollectionsApp /> );
}
