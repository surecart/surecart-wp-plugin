import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

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
	<SelectControl options={OPTIONS?.[type] || []} {...props} />
);
