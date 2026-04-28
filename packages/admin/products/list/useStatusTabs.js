/**
 * Build the status-tab strip for the products list.
 *
 * Tabs map to the `archive_status` filter (values: `active`, `archived`,
 * `all`). Counts are fetched in parallel with `head=true` so the tab strip
 * doesn't add a meaningful delay to the initial render — the table renders
 * first, the counts arrive seconds later.
 */
import { useMemo, useEffect, useState, useRef } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

const TAB_DEFS = [
	{ value: 'active', label: __('Active', 'surecart'), archived: false },
	{ value: 'archived', label: __('Archived', 'surecart'), archived: true },
	{ value: 'all', label: __('All', 'surecart') },
];

export const useStatusTabs = ({ view, setView }) => {
	const activeValue =
		view?.filters?.find((f) => f.field === 'archive_status')?.value ||
		'active';

	const setTab = (value) => {
		setView((prev) => {
			const others = (prev.filters || []).filter(
				(f) => f.field !== 'archive_status'
			);
			return {
				...prev,
				page: 1,
				filters: [
					...others,
					{ field: 'archive_status', operator: 'is', value },
				],
			};
		});
	};

	const [counts, setCounts] = useState({});
	const reqIdRef = useRef(0);

	useEffect(() => {
		const id = ++reqIdRef.current;

		const queries = TAB_DEFS.map((tab) => {
			const params = { per_page: 1, page: 1 };
			if (tab.archived !== undefined) params.archived = tab.archived;
			return apiFetch({
				path: addQueryArgs('/surecart/v1/products', params),
				parse: false,
			})
				.then((res) => ({
					value: tab.value,
					count: parseInt(res.headers.get('X-WP-Total') || '0', 10),
				}))
				.catch(() => ({ value: tab.value, count: undefined }));
		});

		Promise.all(queries).then((entries) => {
			if (id !== reqIdRef.current) return;
			const next = {};
			for (const entry of entries) {
				if (typeof entry.count === 'number') {
					next[entry.value] = entry.count;
				}
			}
			setCounts(next);
		});
	}, []);

	const tabs = useMemo(
		() =>
			TAB_DEFS.map((t) => ({
				value: t.value,
				label: t.label,
				count: counts[t.value],
			})),
		[counts]
	);

	return { tabs, activeValue, setTab };
};
