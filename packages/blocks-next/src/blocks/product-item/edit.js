import {
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

const TEMPLATE = [
	[ 'surecart/product-image' ],
	[ 'surecart/product-name' ],
	[ 'surecart/product-price-v2' ],
];

export default () => {
	const blockProps = useBlockProps({
		className: 'product-item',
	});
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});
	
	return (
		<div {...innerBlocksProps} />
	);
};
