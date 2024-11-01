/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function save() {
	return (
		<sc-invoice-details>
			<InnerBlocks.Content />
		</sc-invoice-details>
	);
}
