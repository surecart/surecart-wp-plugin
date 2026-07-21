import { __, _n, sprintf } from '@wordpress/i18n';

// Number of component products in the bundle.
export default () => ({
	id: 'bundle_items',
	label: __('Items', 'surecart'),
	enableSorting: false,
	getValue: ({ item }) => {
		const raw = item?.bundle_items;
		return (Array.isArray(raw) ? raw : raw?.data || []).length;
	},
	render: ({ item }) => {
		const raw = item?.bundle_items;
		const count = (Array.isArray(raw) ? raw : raw?.data || []).length;
		return sprintf(
			/* translators: %d is the number of items in the bundle. */
			_n('%d item', '%d items', count, 'surecart'),
			count
		);
	},
});
