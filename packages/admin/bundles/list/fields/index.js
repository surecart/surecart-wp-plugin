import {
	archiveStatusField,
	nameField,
	priceField,
	commissionAmountField,
	integrationsField,
	productCollectionsField,
	statusField,
	featuredField,
	createdAtField,
} from '../../../products/list/fields';
import bundleItemsField from './bundle_items';

import { applyFieldExtensions } from '../../../components/dataview-list';

// Bundles reuse the generic product field factories and add a bundle-specific
// Items column. SKU / stock / quantity are omitted — bundles have no variants
// or inventory of their own. The composed list is passed through
// `surecart.dataview.bundles.fields` so plugins can extend it independently.
export const buildBundleFields = (ctx) => {
	const fields = [
		archiveStatusField(),
		nameField(ctx),
		priceField(ctx),
		bundleItemsField(ctx),
		commissionAmountField(ctx),
		integrationsField(ctx),
		productCollectionsField(ctx),
		statusField(ctx),
		featuredField(ctx),
		createdAtField(ctx),
	];

	return applyFieldExtensions('bundles', fields, ctx);
};
