import { __, sprintf } from '@wordpress/i18n';

export default ({ item }) => {
	const variantStockEnabled =
		item?.stock_enabled !== null && item?.stock_enabled !== undefined
			? item.stock_enabled
			: item?.__sc_parent?.stock_enabled;

	if (!variantStockEnabled) {
		return <span className="sc-variant-cell">∞</span>;
	}

	const available =
		(item?.available_stock || 0) + (item?.stock_adjustment || 0);

	return (
		<span className="sc-variant-cell">
			{sprintf(
				/* translators: %d is the number of available stock */
				__('%d Available', 'surecart'),
				available
			)}
		</span>
	);
};
