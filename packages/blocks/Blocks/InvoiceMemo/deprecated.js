import { __ } from '@wordpress/i18n';

const v1 = {
	attributes: {
		text: { type: 'string', default: 'Memo' },
	},
	save({ attributes }) {
		const { text, className } = attributes;
		return <sc-invoice-memo class={className} text={text} />;
	},
};
export default [v1];
