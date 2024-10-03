/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

export default ({ attributes }) => {
	const { text, className } = attributes;

	return (
		<sc-line-item-invoice-receipt-download class={className}>
			<span slot="title">
				{text || __('Invoice Receipt', 'surecart')}
			</span>
		</sc-line-item-invoice-receipt-download>
	);
};
