export default ({ item }) => {
	const amount = item?.display_amount || item?.formatted_amount;
	const fallback = item?.__sc_parent?.range_display_amount;
	const text = amount || fallback || '—';
	return <span className="sc-variant-cell">{text}</span>;
};
