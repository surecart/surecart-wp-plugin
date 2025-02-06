/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

export default ({ attributes }) => {
	const { text, className } = attributes;

	return (
		<sc-line-item-invoice-due-date class={className}>
			<span slot="title">{text || __('Invoice Due Date', 'surecart')}</span>
		</sc-line-item-invoice-due-date>
	);
};
