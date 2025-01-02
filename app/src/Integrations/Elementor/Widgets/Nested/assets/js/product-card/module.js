class ProductCard extends elementor.modules.elements.types.NestedElementBase {
	getType() {
		return 'surecart-product-card';
	}
}

export default class Module {
	constructor() {
		elementor.elementsManager.registerElementType(new ProductCard());
	}
}
