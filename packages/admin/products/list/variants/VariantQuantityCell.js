import StockCell from '../StockCell';

export default ({ item }) => {
	const tracked =
		item?.stock_enabled !== null && item?.stock_enabled !== undefined
			? !!item.stock_enabled
			: !!item?.__sc_parent?.stock_enabled;

	const available =
		(item?.available_stock || 0) + (item?.stock_adjustment || 0);

	return (
		<span className="sc-variant-cell">
			<StockCell tracked={tracked} available={available} />
		</span>
	);
};
