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
import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';

import Rules from './rules';
import translations from './translations';

export default ({ attributes, setAttributes, clientId, isSelected }) => {
	const [editRules, setEditRules] = useState(false);
	const { rule_groups } = attributes;

	// Inject modal styles into the parent document for iframe (apiVersion:3) compatibility.
	// Emotion injects <style> into the iframe head, but Modal is a portal in the parent doc.
	useEffect(() => {
		const styleId = 'sc-conditional-form-modal-styles';
		const targetDoc = window?.parent?.document || document;
		if (!targetDoc.getElementById(styleId)) {
			const style = targetDoc.createElement('style');
			style.id = styleId;
			style.textContent = `
				.sc-conditional-form-modal { width: 75% !important; max-width: 650px !important; max-height: 80% !important; --sc-color-primary-text: #fff; }
			`;
			targetDoc.head.appendChild(style);
		}
		return () => {
			const s = (window?.parent?.document || document).getElementById(
				styleId
			);
			if (s) s.remove();
		};
	}, []);

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
					<PanelRow
						style={{
							flexWrap: 'wrap',
							justifyContent: 'flex-start',
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
					</PanelRow>
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
					<Button isPrimary onClick={() => setEditRules(true)}>
						{__('Add Conditions', 'surecart')}
					</Button>
				</Placeholder>
			)}

			{editRules && (
				<Modal
					title={__('Configure Conditions', 'surecart')}
					onRequestClose={() => setEditRules(false)}
					shouldCloseOnClickOutside={false}
					style={{
						width: '75%',
						maxWidth: '650px',
						maxHeight: '80%',
						'--sc-color-primary-text': '#fff',
					}}
				>
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
