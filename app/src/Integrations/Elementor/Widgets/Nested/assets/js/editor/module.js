class Product extends elementor.modules.elements.types.NestedElementBase {
	getType() {
		return 'surecart-product';
	}

	// getView() {
	// 	return View;
	// }
}
export default class Module {
	constructor() {
		console.log(elementor.elementsManager.registerElementType);
		elementor.elementsManager.registerElementType(new Product());
	}
}
