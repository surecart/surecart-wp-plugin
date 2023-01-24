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

export default (props) => {

	const blockProps = useBlockProps({
		className: 'sc-conditional-form',
		style: {
			fontSize: '16px',
			fontFamily: 'var(--sc-font-sans)',
			outline: '1px dashed var(--wp-admin-theme-color)'
		},
		css: css`
			flex: 1 1 auto;
			width: 100%;
			margin: auto;
			box-shadow: 0 1px 2px #0d131e1a;

      ::before {
        content: 'Conditional';
        z-index: 10;
        font-size: 10px;
        color: white;
        background: var(--wp-admin-theme-color);
        padding: 0 5px;
        text-align: center;
        display: block;
        width: max-content;
        font-weight: 600;
        line-height: normal;
        position: absolute;
        top: -13px;
        left: -1px;
      }

			.block-list-appender {
				position: relative;
			}

			> .wp-block:not(:last-child) {
				margin: 0 !important;
			}
		`,
	});

	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		renderAppender: InnerBlocks.ButtonBlockAppender,
	});

	return (
		<>
			<Settings {...props} />
			<div {...innerBlocksProps}></div>
		</>
	);
};
