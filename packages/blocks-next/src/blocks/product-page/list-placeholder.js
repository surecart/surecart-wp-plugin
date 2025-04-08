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
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import { Button, Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, chevronLeft, chevronRight } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import { useBlockNameForPatterns } from '../utils';
import { usePostTypeCheck } from '../../hooks/usePostTypeCheck';
import template from './template';
import SelectorPreview from './components/SelectorPreview';
import ProductSelector from './components/ProductSelector';

export default function QueryPlaceholder({
	attributes,
	setAttributes,
	clientId,
	name,
	openPatternSelectionModal,
}) {
	const [isVisible, setIsVisible] = useState(false);
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

	const onChoose = (post) => {
		setAttributes({
			product_post_id: post?.id,
		});
		setStep(2);
	};

	const post = useSelect(
		(select) => {
			const { getEntityRecord } = select(coreStore);
			const postId = attributes?.product_post_id;
			if (!postId) {
				return null;
			}
			return getEntityRecord('postType', 'sc_product', postId);
		},
		[attributes?.product_post_id]
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
						{post?.id && (
							<div
								style={{
									border: '1px solid #ddd',
									borderRadius: '4px',
									marginBottom: '1em',
									padding: '1em',
								}}
							>
								<SelectorPreview
									key={post?.link}
									value={{
										...post,
										url: post?.link,
										title: post?.title?.rendered,
									}}
									onEditClick={() => {
										setIsVisible(true);
									}}
									hasRichPreviews={true}
									hasUnlinkControl={true}
									onRemove={() => {
										setAttributes({
											product_post_id: null,
										});

										setStep(1);
										setIsVisible(false);
									}}
								/>
							</div>
						)}

						<div style={{ display: 'flex', gap: '1em' }}>
							<Button
								variant="secondary"
								onClick={() => setIsVisible(!isVisible)}
							>
								{!post?.id
									? __('Choose Product', 'surecart')
									: __('Replace Product', 'surecart')}

								<ProductSelector
									isVisible={isVisible}
									post={post}
									onChoose={onChoose}
									onClose={() => setIsVisible(false)}
								/>
							</Button>

							{/* If post, then add another Next button */}
							{post?.id && (
								<Button
									variant="secondary"
									onClick={() => {
										setStep(2);
									}}
								>
									Next
									<Icon icon={chevronRight} />
								</Button>
							)}
						</div>
					</div>
				</div>
			</>
		);
	};

	const renderPatternSelector = () => {
		return (
			<>
				{!shouldDisableProductSelector && (
					<Button
						variant="secondary"
						onClick={() => {
							setStep(1);
						}}
					>
						<Icon icon={chevronLeft} />
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
						const blocks =
							createBlocksFromInnerBlocksTemplate(template);

						// Preserve the product_id attribute for the surecart/product-page block
						blocks.forEach((block) => {
							if (block.name === 'surecart/product-page') {
								block.attributes = {
									...block.attributes,
									product_id: attributes.product_id, // Preserve product_id
								};
							}
						});

						replaceInnerBlocks(clientId, blocks, false);
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
