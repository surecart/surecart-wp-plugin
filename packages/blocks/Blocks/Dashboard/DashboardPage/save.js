import { InnerBlocks } from '@wordpress/block-editor';

export default ( { attributes } ) => {
	const { name } = attributes;
	return <InnerBlocks.Content />;
};
