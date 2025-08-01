/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps);

	return <div {...innerBlocksProps}></div>;
};
