class CollectionTags extends elementor.modules.elements.types
	.NestedElementBase {
	getType() {
		return 'surecart-collection-tags';
	}
}

export default class Module {
	constructor() {
		elementor.elementsManager.registerElementType(new CollectionTags());
	}
}
