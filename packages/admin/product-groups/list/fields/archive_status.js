import { __ } from '@wordpress/i18n';

export const ARCHIVE_STATUS_ELEMENTS = [
	{ value: 'active', label: __('Active', 'surecart') },
	{ value: 'archived', label: __('Archived', 'surecart') },
	{ value: 'all', label: __('All', 'surecart') },
];

// Filter-only — drives the status tab strip and the filter chip; never a column.
export default () => ({
	id: 'archive_status',
	label: __('Archive status', 'surecart'),
	enableSorting: false,
	enableHiding: false,
	filterBy: { operators: ['is'] },
	elements: ARCHIVE_STATUS_ELEMENTS,
	render: () => null,
});
