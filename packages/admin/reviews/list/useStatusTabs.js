/**
 * Status-tab strip for the reviews list. Counts are fetched in parallel
 * with `per_page=1` so they don't block the initial render.
 */
import { useMemo, useEffect, useState, useRef } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import {
	Icon,
	published,
	pending,
	closeSmall,
	post,
} from '@wordpress/icons';

const TAB_DEFS = [
	{
		value: 'all',
		label: __('All', 'surecart'),
		icon: <Icon icon={post} size={18} />,
	},
	{
		value: 'in_review',
		label: __('In Review', 'surecart'),
		statusParam: 'in_review',
		icon: <Icon icon={pending} size={18} />,
	},
	{
		value: 'published',
		label: __('Approved', 'surecart'),
		statusParam: 'published',
		icon: <Icon icon={published} size={18} />,
	},
	{
		value: 'unpublished',
		label: __('Rejected', 'surecart'),
		statusParam: 'unpublished',
		icon: <Icon icon={closeSmall} size={18} />,
	},
];

export const useStatusTabs = ({ view, setView }) => {
	const activeValue =
		view?.filters?.find((f) => f.field === 'status')?.value || 'all';

	const setTab = (value) => {
		setView((prev) => {
			const others = (prev.filters || []).filter(
				(f) => f.field !== 'status'
			);
			return {
				...prev,
				page: 1,
				filters: [
					...others,
					{ field: 'status', operator: 'is', value },
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
			if (tab.statusParam) params.status = [tab.statusParam];
			return apiFetch({
				path: addQueryArgs('/surecart/v1/reviews', params),
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
				icon: t.icon,
				count: counts[t.value],
			})),
		[counts]
	);

	return { tabs, activeValue, setTab };
};
