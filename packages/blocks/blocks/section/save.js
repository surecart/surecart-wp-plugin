/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function save( { className, attributes } ) {
	const { label, description } = attributes;
	return (
		<ce-form-section className={ className }>
			{ !! label && <span slot="label">{ label }</span> }
			{ !! description && (
				<span slot="description">{ description }</span>
			) }
			<InnerBlocks.Content />
		</ce-form-section>
	);
}
