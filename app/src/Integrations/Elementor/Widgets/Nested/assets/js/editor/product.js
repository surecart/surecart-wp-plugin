import View from './view';

export class NestedAccordion extends elementor.modules.elements.types
	.NestedElementBase {
	getType() {
		return 'surecart-product';
	}

	getView() {
		return View;
	}
}

export default NestedAccordion;
