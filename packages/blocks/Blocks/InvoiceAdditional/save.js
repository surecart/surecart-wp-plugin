/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function save() {
	return (
		<sc-invoice-additional>
			<InnerBlocks.Content />
		</sc-invoice-additional>
	);
}
