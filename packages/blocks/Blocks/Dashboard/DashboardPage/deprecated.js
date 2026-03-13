import { InnerBlocks } from '@wordpress/block-editor';

const v1 = {
	attributes: {
		id: { type: 'string' },
		name: { type: 'string' },
		title: { type: 'string' },
		gap: { type: 'string', default: '25px' },
	},
	save() {
		return <InnerBlocks.Content />;
	},
};
export default [v1];
