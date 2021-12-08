/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default ( { attributes } ) => {
	const { title, description } = attributes;

	return (
		<ce-heading
			style={ {
				marginBottom: 'var(--ce-spacing-large)',
				paddingBottom: 'var(--ce-spacing-large)',
			} }
		>
			{ title }
			<span slot="description">{ description }</span>
			<span slot="end">
				<InnerBlocks.Content />
			</span>
		</ce-heading>
	);
};
