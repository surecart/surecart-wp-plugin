/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScTag } from '@surecart/components-react';
import {
	__experimentalUseInnerBlocksProps,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	store as blockEditorStore,
	InnerBlocks,
	useBlockProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import Settings from './settings';

export default (props) => {
	const { clientId, isSelected } = props;

	const blockProps = useBlockProps({
		css: css`
			position: relative;
			font-size: 16px;
			font-family: var(--sc-font-sans);
			outline: 1px dashed var(--wp-admin-theme-color);
		`,
	});

	const children = useSelect(
		(select) =>
			select(blockEditorStore).getBlocksByClientId(clientId)?.[0]
				.innerBlocks
	);

	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const innerBlocksProps = useInnerBlocksProps(
		{
			css: css`
				flex: 1 1 auto;
				width: 100%;
				margin: auto;
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
			renderAppender:
				!children?.length || isSelected
					? InnerBlocks.ButtonBlockAppender
					: false,
		}
	);

	return (
		<div {...blockProps}>
			<Settings {...props} />
			<ScTag
				className="sc-conditional-form__tag"
				type="info"
				size="small"
				css={css`
					z-index: 10;
					font-size: 14px;
					position: absolute;
					right: -1px;
					top: -18px;
					--sc-color-info-700: white;
					--sc-color-info-100: var(--wp-admin-theme-color);
					--sc-input-border-radius-small: 0;
				`}
			>
				{__('Conditional', 'surecart')}
			</ScTag>
			<div {...innerBlocksProps}></div>
		</div>
	);
};
