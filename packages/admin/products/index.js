import { createRoot } from '@wordpress/element';

import ProductsApp from './ProductsApp';
import '../store/add-entities';

const container = document.getElementById('sc-products-app');
if (container) {
	createRoot(container).render(<ProductsApp />);
}
