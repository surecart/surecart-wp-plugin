import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const TEMPLATE = [
	['surecart/product-list-search-input'],
	['surecart/product-list-search-button'],
];

export default () => {
	const blockProps = useBlockProps({
		style: {
			flexDirection: 'row',
		},
	});
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});
	return <div {...innerBlocksProps}></div>;
};
