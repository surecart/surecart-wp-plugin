/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { jsx } from '@emotion/react';
import { Icon } from '@wordpress/components';
import { starFilled, starEmpty } from '@wordpress/icons';

export const FEATURED_ELEMENTS = [
	{ value: 'true', label: __('Featured', 'surecart') },
	{ value: 'false', label: __('Not featured', 'surecart') },
];

export default () => ({
	id: 'featured',
	label: __('Featured', 'surecart'),
	enableSorting: false,
	filterBy: { operators: ['is'] },
	elements: FEATURED_ELEMENTS,
	getValue: ({ item }) => !!item?.featured,
	render: ({ item }) => (
		<Icon icon={item?.featured ? starFilled : starEmpty} size={18} />
	),
});
