/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import {
	useBlockProps,
	__experimentalBlockAlignmentMatrixControl as BlockAlignmentMatrixControl,
	BlockControls,
} from '@wordpress/block-editor';
import { seen } from '@wordpress/icons';
import { ScIcon } from '@surecart/components-react';
import { ToolbarDropdownMenu } from '@wordpress/components';
import { useEntityRecord } from '@wordpress/core-data';

const ICONS = {
	right: (
		<svg
			viewBox="0 0 24 24"
			width="24"
			height="24"
			stroke="currentColor"
			strokeWidth="2"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
			css={css`
				width: 18px;
				height: 18px;
				fill: none !important;
			`}
		>
			<polyline points="9 10 4 15 9 20"></polyline>
			<path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
		</svg>
	),
	left: (
		<svg
			viewBox="0 0 24 24"
			width="24"
			height="24"
			stroke="currentColor"
			strokeWidth="2"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
			css={css`
				width: 18px;
				height: 18px;
				fill: none !important;
			`}
		>
			<polyline points="15 10 20 15 15 20"></polyline>
			<path d="M4 4v7a4 4 0 0 0 4 4h12"></path>
		</svg>
	),
	'top-left': (
		<svg
			viewBox="0 0 24 24"
			width="24"
			height="24"
			stroke="currentColor"
			strokeWidth="2"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
			css={css`
				width: 18px;
				height: 18px;
				fill: none !important;
			`}
		>
			<polyline points="14 9 9 4 4 9"></polyline>
			<path d="M20 20h-7a4 4 0 0 1-4-4V4"></path>
		</svg>
	),
	'top-right': (
		<svg
			viewBox="0 0 24 24"
			width="24"
			height="24"
			stroke="currentColor"
			strokeWidth="2"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
			css={css`
				width: 18px;
				height: 18px;
				fill: none !important;
			`}
		>
			<polyline points="10 9 15 4 20 9"></polyline>
			<path d="M4 20h7a4 4 0 0 0 4-4V4"></path>
		</svg>
	),
};

export default function Edit({ attributes, setAttributes }) {
	const { position } = attributes;
	const blockProps = useBlockProps({
		className: 'sc-dropdown',
	});
	const { record: account } = useEntityRecord('surecart', 'store', 'account');

	return (
		<>
			<BlockControls group="block">
				<ToolbarDropdownMenu
					icon={ICONS?.[position] || ICONS.right}
					label="Select a direction"
					controls={[
						{
							title: __('Bottom Right', 'surecart'),
							suffix: __('Right', 'surecart'),
							icon: ICONS.left,
							onClick: () => setAttributes({ position: 'left' }),
						},
						{
							title: __('Bottom Left', 'surecart'),
							icon: ICONS.right,
							onClick: () => setAttributes({ position: 'right' }),
						},
						{
							title: __('Top Right', 'surecart'),
							icon: ICONS['top-left'],
							onClick: () =>
								setAttributes({ position: 'top-left' }),
						},
						{
							title: __('Top Left', 'surecart'),
							icon: ICONS['top-right'],
							onClick: () =>
								setAttributes({ position: 'top-right' }),
						},
					]}
				/>
			</BlockControls>
			<div {...blockProps}>
				<div className="sc-dropdown__trigger sc-button sc-button--standard sc-button--medium sc-button--caret sc-button--has-label sc-button--text">
					<span className="sc-button__label">
						{account?.currency?.toUpperCase?.() ||
							__('Currency', 'surecart')}
					</span>
					<span className="sc-button__caret">
						<ScIcon name="chevron-down" />
					</span>
				</div>
			</div>
		</>
	);
}
