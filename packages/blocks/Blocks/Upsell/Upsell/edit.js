/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default () => {
	const innerBlocksProps = useInnerBlocksProps(useBlockProps());
	return <div {...innerBlocksProps} />;
};
