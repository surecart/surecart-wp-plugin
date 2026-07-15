/**
 * Status-tab strip for the products list — Active / Archived / All.
 * Tabs map to the `archive_status` filter. They're static: no count
 * fetching, so the list mounts without extra requests.
 */
import { __ } from '@wordpress/i18n';
import { Icon, published, archive, post } from '@wordpress/icons';

// JSX at module scope so the tab objects are stable references.
const TABS = [
	{
		value: 'active',
		label: __('Active', 'surecart'),
		icon: <Icon icon={published} size={18} />,
	},
	{
		value: 'archived',
		label: __('Archived', 'surecart'),
		icon: <Icon icon={archive} size={18} />,
	},
	{
		value: 'all',
		label: __('All', 'surecart'),
		icon: <Icon icon={post} size={18} />,
	},
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

	return { tabs: TABS, activeValue, setTab };
};
