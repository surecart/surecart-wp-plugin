import { __ } from '@wordpress/i18n';

export default () => ({
	id: 'commission_amount',
	label: __('Commission', 'surecart'),
	enableSorting: false,
	getValue: ({ item }) => item?.commission_structure?.commission_amount || '',
	render: ({ item }) =>
		item?.commission_structure?.commission_amount || '-',
});
