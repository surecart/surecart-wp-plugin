import { __, sprintf } from '@wordpress/i18n';

export default () => ({
	id: 'quantity',
	label: __('Quantity', 'surecart'),
	enableSorting: false,
	getValue: ({ item }) => {
		if (!item?.stock_enabled) return Infinity;
		return item?.available_stock || 0;
	},
	render: ({ item }) => {
		if (!item?.stock_enabled) return '∞';
		return sprintf(
			/* translators: %d is the number of available stock */
			__('%d Available', 'surecart'),
			item?.available_stock || 0
		);
	},
});
