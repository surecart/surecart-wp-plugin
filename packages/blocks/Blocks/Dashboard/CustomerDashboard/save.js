import { InnerBlocks } from '@wordpress/block-editor';

export default () => {
	return (
		<ce-tab-group>
			<InnerBlocks.Content />
		</ce-tab-group>
	);
};
