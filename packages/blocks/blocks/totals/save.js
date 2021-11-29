/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { collapsed, collapsible } = attributes;
	return (
		<ce-order-summary
			collapsible={ collapsible ? '1' : false }
			collapsed={ collapsed ? '1' : false }
		>
			<InnerBlocks.Content />
		</ce-order-summary>
	);
}
