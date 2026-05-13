import { __ } from '@wordpress/i18n';
import StockCell from '../StockCell';

export default () => ({
	id: 'quantity',
	label: __('Stock', 'surecart'),
	enableSorting: false,
	getValue: ({ item }) => {
		if (!item?.stock_enabled) return Infinity;
		return item?.available_stock || 0;
	},
	render: ({ item }) => (
		<StockCell
			tracked={!!item?.stock_enabled}
			available={item?.available_stock || 0}
		/>
	),
});
