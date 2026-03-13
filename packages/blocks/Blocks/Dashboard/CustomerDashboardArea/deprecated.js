import { InnerBlocks } from '@wordpress/block-editor';

const v1 = {
	save() {
		return <InnerBlocks.Content />;
	},
};
export default [v1];
