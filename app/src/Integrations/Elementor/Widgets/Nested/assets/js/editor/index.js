class Module {
	constructor() {
		elementor.elementsManager.registerElementType(new Product());
	}
}

class Product extends elementor.modules.elements.types.NestedElementBase {
	getType() {
		return 'surecart-product';
	}

	getView() {
		return View;
	}
}

elementorCommon.elements.$window.on(
	'elementor/nested-element-type-loaded',
	async () => {
		// new Module().default();
		// alert('Product');
		console.log('window', window?.elementor);
	}
);
