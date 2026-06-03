import { __ } from '@wordpress/i18n';

export default () => ({
	id: 'created_at_range',
	label: __('Created', 'surecart'),
	type: 'datetime',
	enableSorting: false,
	enableHiding: false,
	filterBy: {
		operators: ['before', 'after', 'between'],
	},
	render: () => null,
});
