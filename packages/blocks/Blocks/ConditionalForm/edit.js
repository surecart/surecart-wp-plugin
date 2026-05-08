import { ScTag } from '@surecart/components-react';
import {
	Button,
	Modal,
	PanelBody,
	PanelRow,
	Placeholder,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import {
	__experimentalUseInnerBlocksProps,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	store as blockEditorStore,
	InnerBlocks,
	useBlockProps,
	BlockControls,
	InspectorControls,
} from '@wordpress/block-editor';

import { edit } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Rules from './rules';
import translations from './translations';

export default ({ attributes, setAttributes, clientId, isSelected }) => {
	const [editRules, setEditRules] = useState(false);
	const { rule_groups } = attributes;

	const blockProps = useBlockProps({
		style: {
			position: 'relative',
			fontSize: '16px',
			fontFamily: 'var(--sc-font-sans)',
			outline: '1px dashed var(--wp-admin-theme-color)',
		},
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
			className: 'sc-conditional-form__inner',
			style: {
				flex: '1 1 auto',
				width: '100%',
				margin: 'auto',
				boxShadow: '0 1px 2px #0d131e1a',
			},
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
			<style>{`
				.sc-conditional-form__inner .block-list-appender {
					position: relative;
				}
				.sc-conditional-form__inner > .wp-block:not(:last-child) {
					margin: 0 !important;
				}
			`}</style>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={edit}
						label={__('Edit Conditions', 'surecart')}
						onClick={() => setEditRules(true)}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Conditions', 'surecart')}>
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'flex-start',
							gap: '4px',
						}}
					>
						{!rule_groups?.length &&
							__(
								'Configure different visibility conditions to control when the contents appear to customers.',
								'surecart'
							)}
						{(rule_groups || []).map(({ rules, rulesIndex }) => {
							return (rules || []).map((rule, index) => (
								<ScTag key={`${rulesIndex}${index}`}>
									{translations?.[rule?.condition]}
								</ScTag>
							));
						})}
					</div>
					<PanelRow>
						<Button
							variant="secondary"
							onClick={() => setEditRules(true)}
						>
							{__('Configure Conditions', 'surecart')}
						</Button>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<ScTag
				className="sc-conditional-form__tag"
				type="info"
				size="small"
				style={{
					zIndex: 10,
					fontSize: '14px',
					position: 'absolute',
					right: '-1px',
					top: '-18px',
					'--sc-color-info-700': 'white',
					'--sc-color-info-100': 'var(--wp-admin-theme-color)',
					'--sc-input-border-radius-small': '0',
				}}
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
					label={__('Conditional', 'surecart')}
					instructions={__(
						'First, add some conditions for the display of this group of blocks.',
						'surecart'
					)}
				>
					<Button
						variant="primary"
						onClick={() => setEditRules(true)}
					>
						{__('Add Conditions', 'surecart')}
					</Button>
				</Placeholder>
			)}

			{editRules && (
				<Modal
					title={__('Configure Conditions', 'surecart')}
					onRequestClose={() => setEditRules(false)}
					shouldCloseOnClickOutside={false}
					overlayClassName="sc-modal-overflow"
					style={{
						width: '75%',
						maxWidth: '650px',
						maxHeight: '80%',
						'--sc-color-primary-text': '#fff',
					}}
				>
					<style>{`
						.sc-modal-overflow .components-modal__frame {
							overflow: visible !important;
						}
					`}</style>
					<Rules
						attributes={attributes}
						setAttributes={setAttributes}
						closeModal={() => setEditRules(false)}
					/>
				</Modal>
			)}
		</div>
	);
};
