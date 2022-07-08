/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	InnerBlocks,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';

const allowedBlocks = [
	'surecart/cart-coupon',
	'surecart/cart-submit',
	'surecart/cart-subtotal',
	'surecart/cart-header',
	'surecart/cart-message',
];

export default () => {
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const innerBlocksProps = useInnerBlocksProps(
		{
			css: css`
				flex: 1 1 auto;
				overflow: auto;
			`,
		},
		{
			renderAppender: InnerBlocks.ButtonBlockAppender,
			allowedBlocks,
			templateLock: null,
		}
	);

	return <div {...innerBlocksProps}></div>;
};
