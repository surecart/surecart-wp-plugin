/**
 * WordPress dependencies.
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const { title, description } = attributes;

	return (
		<sc-heading>
			{title}
			<span slot="description">{description}</span>
			<span slot="end">
				<InnerBlocks.Content />
			</span>
		</sc-heading>
	);
};
