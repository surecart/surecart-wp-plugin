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
import {
	Button,
	Card,
	CardBody,
	Flex,
	Placeholder,
} from '@wordpress/components';
import { trash } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

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
	const postId = attributes?.product_post_id;
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

	const instructions = shouldDisableProductSelector
		? __(
				'Choose a pattern for the product page or start with a basic layout.',
				'surecart'
		  )
		: __(
				'Choose a product & pattern for the product page or start with a basic layout.'
		  );

	const onChoose = (post) => {
		setAttributes({
			product_post_id: post?.id,
		});
	};

	const { post, loading } = useSelect(
		(select) => {
			if (!postId) {
				return {
					post: null,
					loading: false,
				};
			}
			const entityArgs = ['postType', 'sc_product', postId];

			return {
				post: select(coreStore).getEntityRecord(...entityArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecord',
					entityArgs
				),
			};
		},
		[postId]
	);

	const renderProductPreview = () => {
		if (!post?.id) {
			return null;
		}

		return (
			<div
				style={{
					marginBottom: 'var(--sc-spacing-medium)',
				}}
			>
				<Card>
					<CardBody
						style={{
							padding: 'var(--sc-spacing-medium)',
						}}
					>
						<SelectorPreview
							title={post?.title?.rendered}
							subtitle={post?.link}
							url={post?.link}
							imageUrl={post?.gallery?.[0]?.url}
							controls={
								<Button
									icon={trash}
									label={__('Remove', 'surecart')}
									onClick={() => {
										setAttributes({
											product_post_id: null,
										});
										setIsVisible(false);
									}}
									size="compact"
									showTooltip={true}
								/>
							}
						/>
					</CardBody>
				</Card>
			</div>
		);
	};

	const renderProductSelector = () => {
		if (!!post?.id) {
			return null;
		}

		return (
			<div
				style={{
					minWidth: '500px',
				}}
			>
				<Button
					variant="primary"
					onClick={() => setIsVisible(!isVisible)}
					isBusy={loading}
				>
					{__('Choose Product', 'surecart')}

					<ProductSelector
						isVisible={isVisible}
						post={post}
						onChoose={onChoose}
						onClose={() => setIsVisible(false)}
					/>
				</Button>
			</div>
		);
	};

	const renderPatternSelector = () => {
		if (!post?.id) {
			return null;
		}

		return (
			<Flex gap={4} justify="start">
				<Button
					variant="primary"
					onClick={() => {
						const blocks =
							createBlocksFromInnerBlocksTemplate(template);

						// Preserve the product_post_id attribute for the surecart/product-page block
						blocks.forEach((block) => {
							if (block.name === 'surecart/product-page') {
								block.attributes = {
									...block.attributes,
									product_post_id: attributes.product_post_id, // Preserve product_post_id
								};
							}
						});

						replaceInnerBlocks(clientId, blocks, false);
					}}
				>
					{__('Create Form', 'surecart')}
				</Button>

				{!!hasPatterns && (
					<Button
						variant="secondary"
						onClick={openPatternSelectionModal}
					>
						{__('Choose a template', 'surecart')}
					</Button>
				)}
			</Flex>
		);
	};

	const renderSelectors = () => {
		if (shouldDisableProductSelector) {
			return renderPatternSelector();
		}

		return (
			<div>
				{renderProductPreview()}
				{renderProductSelector()}
				{renderPatternSelector()}
			</div>
		);
	};

	return (
		<div {...blockProps}>
			<Placeholder icon={icon} label={label} instructions={instructions}>
				{renderSelectors()}
			</Placeholder>
		</div>
	);
}
