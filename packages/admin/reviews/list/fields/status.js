/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { jsx } from '@emotion/react';
import { ScTag } from '@surecart/components-react';

const STATUS_LABELS = {
	published: __('Approved', 'surecart'),
	in_review: __('In Review', 'surecart'),
	unpublished: __('Rejected', 'surecart'),
};

const STATUS_TYPES = {
	published: 'success',
	in_review: 'warning',
	unpublished: 'danger',
};

export const STATUS_ELEMENTS = [
	{ value: 'all', label: __('All', 'surecart') },
	{ value: 'in_review', label: __('In Review', 'surecart') },
	{ value: 'published', label: __('Approved', 'surecart') },
	{ value: 'unpublished', label: __('Rejected', 'surecart') },
];

export default () => ({
	id: 'status',
	label: __('Status', 'surecart'),
	enableSorting: false,
	filterBy: { operators: ['is'] },
	elements: STATUS_ELEMENTS,
	getValue: ({ item }) => item?.status || 'in_review',
	render: ({ item }) => {
		const status = item?.status || 'in_review';
		return (
			<ScTag type={item?.status_type || STATUS_TYPES[status] || ''}>
				{item?.status_display || STATUS_LABELS[status] || status}
			</ScTag>
		);
	},
});
