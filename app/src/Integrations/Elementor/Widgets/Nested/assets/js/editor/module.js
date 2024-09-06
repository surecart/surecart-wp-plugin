class View extends $e.components.get('nested-elements').exports.NestedView {
	onAddChild(childView) {
		const accordionId = childView._parent.$el
			.find('summary')
			?.attr('aria-controls');

		// childView.$el.attr({
		// 	role: 'region',
		// 	'aria-labelledby': accordionId,
		// });
	}
}

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
		elementor.elementsManager.registerElementType(new Product());
	}
}
