import { __ } from '@wordpress/i18n';

export default () => ({
	id: 'price',
	label: __('Price', 'surecart'),
	enableSorting: false,
	getValue: ({ item }) => item?.range_display_amount || '',
	render: ({ item }) => item?.range_display_amount || '-',
});
