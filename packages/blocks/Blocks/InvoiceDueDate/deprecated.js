import { __ } from '@wordpress/i18n';

const v1 = {
	attributes: {
		text: { type: 'string', default: 'Due Date' },
	},
	save({ attributes }) {
		const { text, className } = attributes;
		return (
			<sc-line-item-invoice-due-date class={className}>
				<span slot="title">{text || __('Invoice Due Date', 'surecart')}</span>
			</sc-line-item-invoice-due-date>
		);
	},
};
export default [v1];
