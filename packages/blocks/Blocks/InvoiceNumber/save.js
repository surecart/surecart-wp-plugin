/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

export default ({ attributes }) => {
	const { text, className } = attributes;

	return (
		<sc-line-item-invoice-number class={className}>
			<span slot="title">{text || __('Invoice Number', 'surecart')}</span>
		</sc-line-item-invoice-number>
	);
};
