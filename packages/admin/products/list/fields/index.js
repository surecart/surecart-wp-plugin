import nameField from './name';
import skuField from './sku';
import priceField from './price';
import commissionAmountField from './commission_amount';
import quantityField from './quantity';
import integrationsField from './integrations';
import productCollectionsField from './product_collections';
import statusField from './status';
import featuredField from './featured';
import createdAtField from './created_at';
import archiveStatusField from './archive_status';

import { applyFieldExtensions } from '../../../components/dataview-list';

// Each field lives in its own module and receives runtime context (navigation,
// async data) from the screen. The composed list is passed through
// `surecart.dataview.products.fields` so plugins can extend it.
export const buildProductFields = (ctx) => {
	const fields = [
		archiveStatusField(),
		nameField(ctx),
		skuField(ctx),
		priceField(ctx),
		commissionAmountField(ctx),
		quantityField(ctx),
		integrationsField(ctx),
		productCollectionsField(ctx),
		statusField(ctx),
		featuredField(ctx),
		createdAtField(ctx),
	];

	return applyFieldExtensions('products', fields, ctx);
};

export {
	nameField,
	skuField,
	priceField,
	commissionAmountField,
	quantityField,
	integrationsField,
	productCollectionsField,
	statusField,
	featuredField,
	createdAtField,
	archiveStatusField,
};
