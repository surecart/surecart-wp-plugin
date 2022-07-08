/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import {
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	useBlockProps,
	InnerBlocks,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';

const allowedBlocks = [
	'surecart/cart-coupon',
	'surecart/cart-submit',
	'surecart/cart-subtotal',
	'surecart/cart-header',
	'surecart/cart-message',
];

export default ({ attributes, setAttributes }) => {
	const { title } = attributes;

	const blockProps = useBlockProps();

	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const innerBlocksProps = useInnerBlocksProps(
		{
			css: css`
				flex: 1 1 auto;
				overflow: auto;

				> .wp-block:not(:last-child) {
					margin-bottom: 20px;
				}
			`,
		},
		{
			renderAppender: InnerBlocks.ButtonBlockAppender,
			allowedBlocks,
		}
	);

	return (
		<div {...blockProps}>
			<div
				css={css`
					max-width: 400px;
					width: 100%;
					margin: auto;
					border: var(--sc-drawer-border);
					box-shadow: 0 1px 2px #0d131e1a;
				`}
			>
				<div {...innerBlocksProps}></div>
			</div>
		</div>
	);
};
