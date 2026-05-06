import { __ } from '@wordpress/i18n';

// Bare-text version of `name` used as `titleField` in grid and list
// layouts. Grid uses `mediaField` for the card image, so the title here
// must NOT include a thumbnail or it would render twice.
//
// `enableHiding: true` so DataViews honors `view.fields` and we can
// strip this from table mode (it's resolved by id for grid/list's
// titleField regardless of fields-array membership).
export default () => ({
	id: 'display_name',
	label: __('Name', 'surecart'),
	enableSorting: false,
	enableHiding: true,
	getValue: ({ item }) => item?.name || '',
	render: ({ item }) => item?.name || '',
});
