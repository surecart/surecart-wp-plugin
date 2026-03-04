/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [
	['surecart/product-review-list-filter-checkboxes-label'],
	['surecart/product-review-list-filter-checkboxes-template'],
];

export default () => {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	return <div {...innerBlocksProps} />;
};
