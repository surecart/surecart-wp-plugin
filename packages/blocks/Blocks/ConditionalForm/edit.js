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
import { Button, Placeholder } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import Settings from './settings';

export default (props) => {
	const { attributes, clientId, isSelected } = props;
	const { rule_groups } = attributes;

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
			{rule_groups?.length ? (
				<div {...innerBlocksProps}></div>
			) : (
				<Placeholder
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							style={{ fill: 'none' }}
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
							<circle cx="12" cy="12" r="3"></circle>
						</svg>
					}
					label={__('Conditional Form Group', 'surecart')}
					instructions={__(
						'Add some conditions to you want to display.',
						'surecart'
					)}
				>
					<Button isPrimary>
						{__('Add Conditions', 'surecart')}
					</Button>
				</Placeholder>
			)}
		</div>
	);
};
