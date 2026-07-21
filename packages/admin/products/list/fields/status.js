/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { jsx } from '@emotion/react';
import { ScTag } from '@surecart/components-react';

export default () => ({
	id: 'status',
	label: __('Status', 'surecart'),
	enableSorting: false,
	getValue: ({ item }) => item?.status || 'draft',
	render: ({ item }) => {
		const isPublished = item?.status === 'published';
		return (
			<ScTag type={isPublished ? 'success' : ''}>
				{isPublished
					? __('Published', 'surecart')
					: __('Draft', 'surecart')}
			</ScTag>
		);
	},
});
