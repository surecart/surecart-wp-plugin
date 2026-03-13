import { __ } from '@wordpress/i18n';

const v1 = {
	attributes: {
		text: { type: 'string', default: 'Receipt / Invoice' },
	},
	save({ attributes }) {
		const { text, className } = attributes;
		return (
			<sc-line-item-invoice-receipt-download class={className}>
				<span slot="title">
					{text || __('Invoice Receipt', 'surecart')}
				</span>
			</sc-line-item-invoice-receipt-download>
		);
	},
};
export default [v1];
