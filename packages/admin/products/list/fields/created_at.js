import { __ } from '@wordpress/i18n';

export default () => ({
	id: 'created_at',
	label: __('Created', 'surecart'),
	enableSorting: true,
	getValue: ({ item }) => item?.cataloged_at || item?.created_at || '',
	render: ({ item }) => item?.cataloged_at_date_time || '-',
});
