/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { jsx } from '@emotion/react';

export default () => ({
	id: 'products_count',
	label: __('Products', 'surecart'),
	enableSorting: false,
	getValue: ({ item }) => item?.products?.length ?? item?.products_count ?? 0,
	render: ({ item }) =>
		item?.products?.length ?? item?.products_count ?? 0,
});
