import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

export const deprecated = [
	{
		attributes: {
			label: {
				type: 'string',
				default: 'Donation Amount',
			},
			default_amount: {
				type: 'number',
			},
			price_id: {
				type: 'string',
			},
			custom_amount: {
				type: 'boolean',
				default: true,
			},
		},
		save: ({ attributes }) => {
			const { price_id, label, currency, custom_amount, default_amount } =
				attributes;
			return (
				<sc-donation-choices
					price-id={price_id}
					default-amount={default_amount}
					label={label}
					currency={currency}
				>
					<InnerBlocks.Content />
					{custom_amount && (
						<sc-choice
							show-control="false"
							size="small"
							value="ad_hoc"
						>
							{__('Other', 'surecart')}
						</sc-choice>
					)}
				</sc-donation-choices>
			);
		},
	},
];
