export default ({ item }) => {
	const sku = item?.sku || item?.__sc_parent?.sku || '';
	return <span className="sc-variant-cell">{sku || '—'}</span>;
};
