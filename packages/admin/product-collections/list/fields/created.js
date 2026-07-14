import { __ } from '@wordpress/i18n';

export default () => ({
	id: 'created',
	label: __('Created', 'surecart'),
	enableSorting: true,
	getValue: ({ item }) => item?.created_at || '',
	render: ({ item }) => item?.created_at_date_time || '-',
});
