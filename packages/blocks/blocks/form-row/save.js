/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function save( { className } ) {
	return (
		<ce-form-row className={ className }>
			<InnerBlocks.Content />
		</ce-form-row>
	);
}
