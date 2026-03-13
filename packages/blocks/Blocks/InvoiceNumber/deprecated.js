import { __ } from '@wordpress/i18n';

const v1 = {
	attributes: {
		text: { type: 'string', default: 'Invoice Number' },
	},
	save({ attributes }) {
		const { text, className } = attributes;
		return (
			<sc-line-item-invoice-number class={className}>
				<span slot="title">{text || __('Invoice Number', 'surecart')}</span>
			</sc-line-item-invoice-number>
		);
	},
};
export default [v1];
