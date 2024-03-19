import {
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

export default function ProductTemplateSave() {
	const blockProps = useBlockProps.save();
	const innerBlocksProps = useInnerBlocksProps.save(blockProps);
	return <div {...innerBlocksProps} />;
}
