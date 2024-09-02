import View from './views/view';

export class Product extends elementor.modules.elements.types
	.NestedElementBase {
	getType() {
		return 'surecart-product';
	}

	getView() {
		return View;
	}
}
alert('Product');
export default Product;
