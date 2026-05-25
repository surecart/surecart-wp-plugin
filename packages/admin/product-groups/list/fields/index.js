// Plugins can extend via `surecart.dataview.product-groups.fields`.
import nameField from './name';
import productsCountField from './products_count';
import statusField from './status';
import createdField from './created';
import archiveStatusField from './archive_status';

import { applyFieldExtensions } from '../../../components/dataview-list';

export const buildGroupFields = (ctx) => {
	const fields = [
		archiveStatusField(),
		nameField(ctx),
		productsCountField(ctx),
		statusField(ctx),
		createdField(ctx),
	];
	return applyFieldExtensions('product-groups', fields, ctx);
};

export {
	nameField,
	productsCountField,
	statusField,
	createdField,
	archiveStatusField,
};
