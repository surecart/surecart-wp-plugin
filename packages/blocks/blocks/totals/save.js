/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function save() {
	return (
		<ce-order-summary>
			<InnerBlocks.Content />
		</ce-order-summary>
	);
}
