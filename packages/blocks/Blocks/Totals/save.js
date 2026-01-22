/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		collapsedOnDesktop,
		collapsible,
		order_summary_text,
		invoice_summary_text,
		collapsedOnMobile,
	} = attributes;

	return (
		<sc-order-summary
			collapsible={collapsible ? '1' : false}
			collapsed-on-desktop={collapsedOnDesktop ? '1' : false}
			order-summary-text={order_summary_text}
			invoice-summary-text={invoice_summary_text}
			collapsed-on-mobile={collapsedOnMobile ? '1' : false}
		>
			<InnerBlocks.Content />
		</sc-order-summary>
	);
}
