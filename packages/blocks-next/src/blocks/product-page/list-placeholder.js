/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import {
	createBlocksFromInnerBlocksTemplate,
	store as blocksStore,
} from '@wordpress/blocks';
import {
	useBlockProps,
	store as blockEditorStore,
	__experimentalBlockVariationPicker,
} from '@wordpress/block-editor';
import { store as noticesStore } from '@wordpress/notices';
import { useState } from '@wordpress/element';
import { Button, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import template from './template';

/**
 * Internal dependencies
 */
import { useBlockNameForPatterns } from '../utils';
import SelectProductModal from './components/SelectProductModal';
import { usePostTypeCheck } from '../../hooks/usePostTypeCheck';

export default function QueryPlaceholder({
	attributes,
	setAttributes,
	clientId,
	name,
	openPatternSelectionModal,
}) {
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { replaceInnerBlocks } = useDispatch(blockEditorStore);
	const blockProps = useBlockProps();
	const blockNameForPatterns = useBlockNameForPatterns(
		clientId,
		attributes,
		name
	);

	const { blockType, activeBlockVariation, hasPatterns } = useSelect(
		(select) => {
			const { getActiveBlockVariation, getBlockType } =
				select(blocksStore);
			const { getBlockRootClientId, getPatternsByBlockTypes } =
				select(blockEditorStore);
			const rootClientId = getBlockRootClientId(clientId);
			return {
				blockType: getBlockType(name),
				activeBlockVariation: getActiveBlockVariation(name, attributes),
				hasPatterns: !!getPatternsByBlockTypes(
					blockNameForPatterns,
					rootClientId
				).length,
			};
		},
		[name, blockNameForPatterns, clientId, attributes]
	);
	const icon =
		activeBlockVariation?.icon?.src ||
		activeBlockVariation?.icon ||
		blockType?.icon?.src;
	const label = activeBlockVariation?.title || blockType?.title;

	const [product, setProduct] = useState(null);
	const [step, setStep] = useState(1);

	// Checks whether we are in the sc-product post type or a template
	const shouldDisableProductSelector = usePostTypeCheck(
		['wp_template', 'wp_template_part'],
		[
			'wp_template_part', // list placeholder
			'wp_template',
			'surecart/surecart//product-info', // template part.
			'surecart/surecart//single-sc_product', // template.
		]
	);

	const renderProductSelector = () => {
		return (
			<>
				<div
					style={{
						minWidth: '500px',
					}}
				>
					<div
						style={{
							marginBottom: '1em',
						}}
					>
						<SelectProductModal
							attributes={attributes}
							setAttributes={setAttributes}
							onRequestClose={() => setStep(1)}
							onChoose={(product) => {
								setAttributes({
									product: product?.id,
								});
								createSuccessNotice(
									__(
										'Product selected. Choose a pattern to continue.',
										'surecart'
									),
									{
										type: 'snackbar',
									}
								);

								setProduct(product);
								setStep(2);
							}}
						/>
					</div>
				</div>
			</>
		);
	};

	const renderPatternSelector = () => {
		return (
			<>
				{/* Back button */}
				{!shouldDisableProductSelector && (
					<Button
						variant="secondary"
						onClick={() => {
							setStep(1);
						}}
					>
						{__('Back', 'surecart')}
					</Button>
				)}

				{/* Pattern selector */}
				{!!hasPatterns && (
					<Button
						variant="primary"
						onClick={openPatternSelectionModal}
					>
						{__('Choose', 'surecart')}
					</Button>
				)}

				<Button
					variant="secondary"
					onClick={() => {
						replaceInnerBlocks(
							clientId,
							createBlocksFromInnerBlocksTemplate(template),
							false
						);
					}}
				>
					{__('Start basic', 'surecart')}
				</Button>
			</>
		);
	};

	return (
		<div {...blockProps}>
			<Placeholder
				icon={icon}
				label={label}
				instructions={__(
					'Choose a product & pattern for the product page or start with a basic layout.'
				)}
			>
				{step === 1 &&
					!shouldDisableProductSelector &&
					renderProductSelector()}

				{step === 2 || shouldDisableProductSelector
					? renderPatternSelector()
					: null}
			</Placeholder>
		</div>
	);
}
