import { useMemo } from 'react';
import { useEntityRecords } from '@wordpress/core-data';

// Static `{ value, label }[]` for a DataViews Product picker — must be a
// static array, so we eager-fetch.
export default function useProductElements({ perPage = 100 } = {}) {
	const { records } = useEntityRecords('surecart', 'product', {
		per_page: perPage,
		archived: false,
	});

	return useMemo(
		() => (records || []).map((p) => ({ value: p.id, label: p.name })),
		[records]
	);
}
