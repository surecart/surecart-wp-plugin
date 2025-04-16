/**
 * External dependencies.
 */
import {
	useInnerBlocksProps,
	useBlockProps,
	InnerBlocks,
	BlockControls,
	InspectorControls,
} from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';
import { Button, Card, CardBody, PanelBody } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { edit } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import template from './template';
import ProductPageToolbar from '../../utilities/patterns-toolbar';
import SelectorPreview from './components/SelectorPreview';
import ProductSelector from './components/ProductSelector';
import { usePostTypeCheck } from '../../hooks/usePostTypeCheck';

export default function ProductPageEdit({
	name,
	clientId,
	openPatternSelectionModal,
	attributes,
	setAttributes,
}) {
	const [isVisible, setIsVisible] = useState(false);
	const blockProps = useBlockProps({
		className: 'sc-product-page__editor-container',
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template,
		renderAppender: InnerBlocks.ButtonBlockAppender,
	});

	const shouldDisableProductSelector = usePostTypeCheck(
		['wp_template', 'wp_template_part'],
		[
			'wp_template_part', // list placeholder
			'wp_template',
			'surecart/surecart//product-info', // template part.
			'surecart/surecart//single-sc_product', // template.
		]
	);

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

	return (
		<>
			<BlockControls>
				<ProductPageToolbar
					name={name}
					clientId={clientId}
					openPatternSelectionModal={openPatternSelectionModal}
				/>
			</BlockControls>

			{!shouldDisableProductSelector && (
				<InspectorControls>
					<PanelBody title={__('Product', 'surecart')}>
						{post?.id && (
							<Card>
								<CardBody style={{ padding: 'var(--sc-spacing-medium)' }}>
									<SelectorPreview
										title={post?.title?.rendered}
										subtitle={post?.link}
										url={post?.link}
										imageUrl={post?.gallery?.[0]?.url}
										controls={
											<Button
												icon={edit}
												label={__(
													'Replace Product',
													'surecart'
												)}
												onClick={() =>
													setIsVisible(!isVisible)
												}
												size="compact"
												showTooltip={true}
											>
												<ProductSelector
													isVisible={isVisible}
													post={post}
													onChoose={(post) => {
														setAttributes({
															product_post_id:
																post.id,
														});
														setIsVisible(false);
													}}
													onClose={() =>
														setIsVisible(false)
													}
												/>
											</Button>
										}
									/>
								</CardBody>
							</Card>
						)}
					</PanelBody>
				</InspectorControls>
			)}

			<div {...innerBlocksProps} />
		</>
	);
}
