import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const TEMPLATE = [
	['surecart/product-list-sort-radio-group-label'],
	['surecart/product-list-sort-radio-group-template'],
];

export default () => {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	return <div {...innerBlocksProps} />;
};
