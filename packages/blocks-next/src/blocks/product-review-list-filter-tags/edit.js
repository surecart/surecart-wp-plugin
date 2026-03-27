/**
 * WordPress dependencies.
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const TEMPLATE = [
	['surecart/product-review-list-filter-tags-label'],
	['surecart/product-review-list-filter-tags-template'],
	['surecart/product-review-list-filter-tags-clear-all'],
];

export default () => {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	return <div {...innerBlocksProps} />;
};
