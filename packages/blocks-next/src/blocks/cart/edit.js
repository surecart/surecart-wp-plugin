/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	InnerBlocks,
	useInnerBlocksProps,
	__experimentalUnitControl as UnitControl,
	useSettings,
	BlockControls,
} from '@wordpress/block-editor';
import {
	__experimentalUseCustomUnits as useCustomUnits,
	PanelBody,
	Button,
	Notice,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
/**
 * Internal dependencies.
 */
import { TEMPLATE } from './template';
import classNames from 'classnames';
import PatternSelectionModal from '../../utilities/pattern-selection-modal';
import PatternsToolbar from '../../utilities/patterns-toolbar';

export default ({
	attributes,
	name,
	attributes: { width },
	clientId,
	setAttributes,
	__unstableLayoutClassNames,
}) => {
	const [isPatternSelectionModalOpen, setIsPatternSelectionModalOpen] =
		useState(false);
	const isOldTemplate = useSelect(
		(select) =>
			!!select(blockEditorStore).getBlocksByName(
				'surecart/slide-out-cart-coupon'
			).length
	);

	const blockProps = useBlockProps({
		style: {
			fontSize: '16px',
			fontFamily: 'var(--sc-font-sans)',
			maxWidth: `max(400px, ${width})`,
		},
		className: classNames(
			'sc-cart__editor-container',
			__unstableLayoutClassNames
		),
	});

	const innerBlocksProps = useInnerBlocksProps(
		blockProps,
		{
			template: TEMPLATE,
			style: {
				maxWidth: `max(400px, ${width})`,
			},
		},
		{
			renderAppender: InnerBlocks.ButtonBlockAppender,
		}
	);

	const units = useCustomUnits({
		availableUnits: useSettings('spacing.units') || [
			'%',
			'px',
			'em',
			'rem',
			'vw',
		],
	});

	if (isPatternSelectionModalOpen) {
		return (
			<PatternSelectionModal
				clientId={clientId}
				attributes={attributes}
				setIsPatternSelectionModalOpen={setIsPatternSelectionModalOpen}
				name={name}
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<UnitControl
						label={__('Width', 'surecart')}
						labelPosition="top"
						__unstableInputWidth="80px"
						value={width}
						onChange={(width) => setAttributes({ width })}
						units={units}
					/>
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<PatternsToolbar
					name={name}
					clientId={clientId}
					openPatternSelectionModal={setIsPatternSelectionModalOpen}
				/>
			</BlockControls>
			{isOldTemplate && (
				<Notice status="warning" isDismissible={false}>
					{__(
						'The current template for cart is outdated. Please upgrade to a newer version by clicking '
					)}
					<Button
						onClick={() => {
							setIsPatternSelectionModalOpen(true);
						}}
						variant="link"
					>
						{__(' here.', 'surecart')}
					</Button>
				</Notice>
			)}
			<div {...blockProps}>
				<div {...innerBlocksProps}></div>
			</div>
		</>
	);
};
