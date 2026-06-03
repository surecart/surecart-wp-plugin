export default ({ item }) => (
	<span className="sc-variant-cell">{item?.created_at_date_time || '—'}</span>
);
