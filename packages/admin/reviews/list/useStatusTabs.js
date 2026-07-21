/**
 * Status-tab strip for the reviews list. Tabs map to the `status`
 * filter. They're static: no count fetching, so the list mounts
 * without extra requests.
 */
import { __ } from '@wordpress/i18n';
import {
	Icon,
	published,
	pending,
	closeSmall,
	post,
} from '@wordpress/icons';

// JSX at module scope so the tab objects are stable references.
const TABS = [
	{
		value: 'all',
		label: __('All', 'surecart'),
		icon: <Icon icon={post} size={18} />,
	},
	{
		value: 'in_review',
		label: __('In Review', 'surecart'),
		icon: <Icon icon={pending} size={18} />,
	},
	{
		value: 'published',
		label: __('Approved', 'surecart'),
		icon: <Icon icon={published} size={18} />,
	},
	{
		value: 'unpublished',
		label: __('Rejected', 'surecart'),
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

	return { tabs: TABS, activeValue, setTab };
};
