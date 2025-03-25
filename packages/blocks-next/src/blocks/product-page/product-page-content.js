import {
	useInnerBlocksProps,
	useBlockProps,
	InnerBlocks,
	BlockControls,
	InspectorControls,
	PanelBody,
} from '@wordpress/block-editor';
import template from './template';
import ProductPageToolbar from '../../utilities/patterns-toolbar';
import { usePostTypeCheck } from '../../hooks/usePostTypeCheck';

export default function ProductPageEdit({
	name,
	clientId,
	openPatternSelectionModal,
}) {
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
					<PanelBody>Product Selector.</PanelBody>
				</InspectorControls>
			)}

			<div {...innerBlocksProps} />
		</>
	);
}
