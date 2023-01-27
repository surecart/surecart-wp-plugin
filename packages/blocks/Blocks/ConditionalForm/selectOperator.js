import { __ } from '@wordpress/i18n';
import { ScSelect } from '@surecart/components-react';

const OPTIONS = {
	string: [
		{
			label: __('matches any of', 'surecart'),
			value: 'any',
		},
		{
			label: __('matches all of', 'surecart'),
			value: 'all',
		},
		{
			label: __('matches none of', 'surecart'),
			value: 'none',
		},
	],
	math: [
		{
			label: __('is equal to', 'surecart'),
			value: '==',
		},
		{
			label: __('is not equal to', 'surecart'),
			value: '!=',
		},
		{
			label: __('is greater than', 'surecart'),
			value: '>',
		},
		{
			label: __('is less than', 'surecart'),
			value: '<',
		},
		{
			label: __('is greater or equal to', 'surecart'),
			value: '>=',
		},
		{
			label: __('is less or equal to', 'surecart'),
			value: '<=',
		},
	],
	coupon: [
		{
			label: __('matches any of', 'surecart'),
			value: 'any',
		},
		{
			label: __('matches all of', 'surecart'),
			value: 'all',
		},
		{
			label: __('matches none of', 'surecart'),
			value: 'none',
		},
		{
			label: __('exist', 'surecart'),
			value: 'exist',
		},
		{
			label: __('not exist', 'surecart'),
			value: 'not_exist',
		},
	],
	shipping: [
		{
			label: __('matches any of', 'surecart'),
			value: 'any',
		},
		{
			label: __('matches none of', 'surecart'),
			value: 'none',
		},
	],
};

export default ({ type, ...props }) => (
	<ScSelect choices={OPTIONS?.[type] || []} unselect={false} {...props} />
);
