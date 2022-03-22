/** @jsx jsx */
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';

/**
 * Allowed blocks constant is passed to InnerBlocks precisely as specified here.
 * The contents of the array should never change.
 * The array should contain the name of each block that is allowed.
 * In columns block, the only block we allow is 'core/column'.
 *
 * @constant
 * @type {string[]}
 */
const ALLOWED_BLOCKS = ['surecart/dashboard-tab', 'surecart/dashboard-logout'];

export default ({}) => {
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const blockProps = useBlockProps({
		slot: 'nav',
		style: {
			boxSizing: 'border-box',
		},
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		templateLock: false,
		renderAppender: InnerBlocks.ButtonBlockAppender,
	});

	return (
		<div
			{...innerBlocksProps}
			css={css`
				sc-tab {
					margin-bottom: var(--sc-spacing-xx-small) !important;
				}
			`}
		></div>
	);
};
