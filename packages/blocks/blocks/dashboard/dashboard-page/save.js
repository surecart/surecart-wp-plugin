import { InnerBlocks } from '@wordpress/block-editor';

export default ( { attributes } ) => {
	const { name } = attributes;
	return (
		<ce-tab-panel name={ name }>
			<InnerBlocks.Content />
		</ce-tab-panel>
	);
};
