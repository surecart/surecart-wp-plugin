class Product extends elementor.modules.elements.types.NestedElementBase {
	getType() {
		return 'surecart-product';
	}
}

export default class Module {
	constructor() {
		elementor.elementsManager.registerElementType(new Product());
	}
}
