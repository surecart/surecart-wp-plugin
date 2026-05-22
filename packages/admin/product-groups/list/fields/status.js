/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { jsx } from '@emotion/react';
import { ScTag } from '@surecart/components-react';

export default () => ({
	id: 'status',
	label: __('Status', 'surecart'),
	enableSorting: false,
	getValue: ({ item }) => (item?.archived ? 'archived' : 'active'),
	render: ({ item }) =>
		item?.archived ? (
			<ScTag type="warning">{__('Archived', 'surecart')}</ScTag>
		) : (
			<ScTag type="success">{__('Live', 'surecart')}</ScTag>
		),
});
