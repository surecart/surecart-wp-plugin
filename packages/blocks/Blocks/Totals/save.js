/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		collapsed,
		collapsible,
		closed_text,
		open_text,
		collapsedOnMobile,
	} = attributes;

	return (
		<sc-order-summary
			collapsible={collapsible ? '1' : false}
			collapsed={collapsed ? '1' : false}
			closed-text={closed_text}
			open-text={open_text}
			collapsed-on-mobile={collapsedOnMobile ? '1' : false}
		>
			<InnerBlocks.Content />
		</sc-order-summary>
	);
}
