import { __ } from '@wordpress/i18n';

export const MINUTE = 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
export const TIME_CHOICES = [
	{
		label: __('1 Hour', 'surecart'),
		value: HOUR,
	},
	{
		label: __('2 Hours', 'surecart'),
		value: HOUR * 2,
	},
	{
		label: __('3 Hours', 'surecart'),
		value: HOUR * 3,
	},
	{
		label: __('6 Hours', 'surecart'),
		value: HOUR * 6,
	},
	{
		label: __('12 Hours', 'surecart'),
		value: HOUR * 12,
	},
	{
		label: __('1 Day', 'surecart'),
		value: DAY,
	},
	{
		label: __('1.5 Days', 'surecart'),
		value: DAY * 1.5,
	},
	{
		label: __('2 Days', 'surecart'),
		value: DAY * 2,
	},
	{
		label: __('3 Days', 'surecart'),
		value: DAY * 3,
	},
	{
		label: __('4 Days', 'surecart'),
		value: DAY * 4,
	},
	{
		label: __('5 Days', 'surecart'),
		value: DAY * 5,
	},
	{
		label: __('6 Days', 'surecart'),
		value: DAY * 6,
	},
	{
		label: __('1 week', 'surecart'),
		value: WEEK,
	},
	{
		label: __('1.5 weeks', 'surecart'),
		value: WEEK * 1.5,
	},
	{
		label: __('2 weeks', 'surecart'),
		value: WEEK * 2,
	},
];
