// Plugins can extend via `surecart.dataview.product-collections.fields`.
import nameField from './name';
import productsCountField from './products_count';
import descriptionField from './description';
import createdField from './created';

import { applyFieldExtensions } from '../../../components/dataview-list';

export const buildCollectionFields = (ctx) => {
	const fields = [
		nameField(ctx),
		productsCountField(ctx),
		descriptionField(ctx),
		createdField(ctx),
	];
	return applyFieldExtensions('product-collections', fields, ctx);
};

export { nameField, productsCountField, descriptionField, createdField };
