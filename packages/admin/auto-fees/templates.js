import { __ } from '@wordpress/i18n';

export default {
	bogo: {
		enabled: true,
		amount_adjustment: null,
		discount: true,
		fee_target: 'line_item',
		name: __('Buy‑One‑Get‑One Product (BOGO)', 'surecart'),
		percent_adjustment: 50.0,
		rules: {
			type: 'group',
			combinator: 'or',
			conditions: [
				{
					type: 'group',
					combinator: 'and',
					conditions: [
						{
							type: 'condition',
							attribute_name: 'quantity',
							operator_label: 'is',
							comparison_value: '2',
						},
					],
				},
			],
		},
	},
};
