import {
	useInnerBlocksProps,
	useBlockProps,
	InnerBlocks,
	BlockControls,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import template from './template';
import ProductPageToolbar from '../../utilities/patterns-toolbar';
import { usePostTypeCheck } from '../../hooks/usePostTypeCheck';
import { __ } from '@wordpress/i18n';
import SelectProduct from './components/SelectProduct';

export default function ProductPageEdit({
	name,
	clientId,
	openPatternSelectionModal,
	attributes,
	setAttributes,
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
					<PanelBody title={__('Product', 'surecart')}>
						<SelectProduct
							attributes={attributes}
							setAttributes={setAttributes}
							showSelectButtons={false}
						/>
					</PanelBody>
				</InspectorControls>
			)}

			<div {...innerBlocksProps} />
		</>
	);
}
