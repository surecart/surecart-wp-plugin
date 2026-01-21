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
			<p
				id="a11y-speak-intro-text"
				class="a11y-speak-intro-text"
				style="position: absolute;margin: -1px;padding: 0;height: 1px;width: 1px;overflow: hidden;clip: rect(1px, 1px, 1px, 1px);-webkit-clip-path: inset(50%);clip-path: inset(50%);border: 0;word-wrap: normal !important;"
			></p>
			<div
				id="a11y-speak-assertive"
				class="a11y-speak-region"
				style="position: absolute;margin: -1px;padding: 0;height: 1px;width: 1px;overflow: hidden;clip: rect(1px, 1px, 1px, 1px);-webkit-clip-path: inset(50%);clip-path: inset(50%);border: 0;word-wrap: normal !important;"
				aria-live="assertive"
				aria-relevant="additions text"
				aria-atomic="true"
			>
				&nbsp;
			</div>
			<div
				id="a11y-speak-polite"
				class="a11y-speak-region"
				style="position: absolute;margin: -1px;padding: 0;height: 1px;width: 1px;overflow: hidden;clip: rect(1px, 1px, 1px, 1px);-webkit-clip-path: inset(50%);clip-path: inset(50%);border: 0;word-wrap: normal !important;"
				aria-live="polite"
				aria-relevant="additions text"
				aria-atomic="true"
			></div>
		</sc-order-summary>
	);
}
