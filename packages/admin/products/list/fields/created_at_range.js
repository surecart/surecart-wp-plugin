import { __ } from '@wordpress/i18n';

/**
 * Created-at date range filter. Distinct from the `created_at` column
 * (which only renders a date) so column hiding doesn't disable the filter.
 */
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
