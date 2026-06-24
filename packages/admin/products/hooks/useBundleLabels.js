import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

// EditProduct is shared between Product and Bundle screens (bundles are
// products with `bundle: true`). This hook centralises the labels and URLs
// that differ, so screens don't sprinkle `product?.bundle ? … : …` everywhere.
export default (product) => {
	const isBundle = !!product?.bundle;
	const indexPage = isBundle ? 'sc-bundles' : 'sc-products';

	return {
		isBundle,

		// Singular noun for the entity ("Product" / "Bundle"), Title Case.
		entityLabel: isBundle
			? __('Bundle', 'surecart')
			: __('Product', 'surecart'),

		// Plural noun, Title Case.
		entitiesLabel: isBundle
			? __('Bundles', 'surecart')
			: __('Products', 'surecart'),

		// View page labels.
		viewPageLabel: isBundle
			? __('View Bundle', 'surecart')
			: __('View Product', 'surecart'),

		// Screen titles.
		editLabel: isBundle
			? __('Edit Bundle', 'surecart')
			: __('Edit Product', 'surecart'),
		saveLabel: isBundle
			? __('Save Bundle', 'surecart')
			: __('Save Product', 'surecart'),
		updatedNotice: isBundle
			? __('Bundle updated.', 'surecart')
			: __('Product updated.', 'surecart'),
		deletedNotice: isBundle
			? __('Bundle deleted.', 'surecart')
			: __('Product deleted.', 'surecart'),

		// Action menu labels.
		archiveLabel: isBundle
			? __('Archive Bundle', 'surecart')
			: __('Archive Product', 'surecart'),
		unarchiveLabel: isBundle
			? __('Un-Archive Bundle', 'surecart')
			: __('Un-Archive Product', 'surecart'),
		deleteLabel: isBundle
			? __('Delete Bundle', 'surecart')
			: __('Delete Product', 'surecart'),
		duplicateLabel: isBundle
			? __('Duplicate Bundle', 'surecart')
			: __('Duplicate Product', 'surecart'),

		// URLs.
		indexHref: addQueryArgs('admin.php', { page: indexPage }),
		editIndexHref: addQueryArgs('admin.php', {
			page: indexPage,
			action: 'edit',
		}),
	};
};
