/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	useBlockProps,
	InnerBlocks,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';
import Settings from './settings';

const allowedBlocks = [];

export default ( props ) => {
	const blockProps = useBlockProps({
    className: 'sc-coditional-form',
		style: {
			fontSize: '16px',
			fontFamily: 'var(--sc-font-sans)',
		},
	});

	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const innerBlocksProps = useInnerBlocksProps(
		{
			css: css`
				flex: 1 1 auto;
				overflow: auto;
				max-width: 400px;
				width: 100%;
				margin: auto;
				border: var(--sc-drawer-border);
				box-shadow: 0 1px 2px #0d131e1a;

				.block-list-appender {
					position: relative;
				}

				> .wp-block:not(:last-child) {
					margin: 0 !important;
				}
			`,
		},
		{
			renderAppender: InnerBlocks.ButtonBlockAppender
		}
	);

	return (
    <>
      <Settings {...props } />
      <div {...blockProps}>
        <div {...innerBlocksProps}></div>
      </div>
    </>
	);
};
