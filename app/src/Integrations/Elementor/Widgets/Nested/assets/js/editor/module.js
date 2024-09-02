import Product from './product';

export default class Module {
	constructor() {
		elementor.elementsManager.registerElementType(new Product());
	}
}
