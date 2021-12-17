import { InnerBlocks } from '@wordpress/block-editor';

export default () => {
	return (
		<div class="tabs" slot="nav">
			<InnerBlocks.Content />
		</div>
	);
};
