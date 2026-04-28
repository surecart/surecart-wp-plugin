import { __ } from '@wordpress/i18n';

// Falls back to the first variant's SKU when the product itself has none.
export default () => ({
	id: 'sku',
	label: __('SKU', 'surecart'),
	enableSorting: false,
	enableGlobalSearch: true,
	getValue: ({ item }) => item?.sku || item?.variants?.data?.[0]?.sku || '',
	render: ({ item }) => {
		const sku = item?.sku || item?.variants?.data?.[0]?.sku || '';
		return sku || '-';
	},
});
