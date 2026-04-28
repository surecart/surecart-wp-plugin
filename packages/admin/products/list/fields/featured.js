/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { jsx } from '@emotion/react';
import { Icon } from '@wordpress/components';
import { starFilled, starEmpty } from '@wordpress/icons';

export default () => ({
	id: 'featured',
	label: __('Featured', 'surecart'),
	enableSorting: false,
	getValue: ({ item }) => !!item?.featured,
	render: ({ item }) => (
		<Icon icon={item?.featured ? starFilled : starEmpty} size={18} />
	),
});
