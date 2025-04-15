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

	const renderProductPreview = () => {
		// If the post is not set, return null
		if (!post) {
			return null;
		}

		return (
			<div
				style={{
					marginBottom: '1em',
				}}
			>
				<div
					style={{
						border: '1px solid #ddd',
						borderRadius: '4px',
						marginBottom: '1em',
						padding: '1em',
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
				</div>
			</div>
		);
	};

	const renderProductSelector = () => {
		if (!!post?.id) {
			return null;
		}

		return (
			<>
				<div
					style={{
						minWidth: '500px',
					}}
				>
					<div style={{ display: 'flex', gap: '1em' }}>
						<Button
							variant="primary"
							onClick={() => setIsVisible(!isVisible)}
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
				</div>
			</>
		);
	};

	const renderPatternSelector = () => {
		return (
			<div>
				<div style={{ display: 'flex', gap: '1em' }}>
					<Button
						variant="primary"
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
				</div>
			</div>
		);
	};

	return (
		<div {...blockProps}>
			<Placeholder
				icon={icon}
				label={label}
				instructions={instructions}
				style={{
					flexDirection: 'column',
				}}
			>
				<div>
					{!shouldDisableProductSelector ? (
						<>
							<div>{renderProductPreview()}</div>
							<div>{renderProductSelector()}</div>
							{post?.id && <div>{renderPatternSelector()}</div>}
						</>
					) : (
						<div>{renderPatternSelector()}</div>
					)}
				</div>
			</Placeholder>
		</div>
	);
}
