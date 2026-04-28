import { __ } from '@wordpress/i18n';

export default () => ({
	id: 'created_at',
	label: __('Created', 'surecart'),
	enableSorting: true,
	getValue: ({ item }) => item?.cataloged_at || item?.created_at || '',
	render: ({ item }) => item?.created_at_date || '-',
});
