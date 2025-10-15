import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default () => {
	return <div {...useInnerBlocksProps.save(useBlockProps.save())} />;
};
