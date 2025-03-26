import {
	useInnerBlocksProps,
	useBlockProps,
	InnerBlocks,
	BlockControls,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import template from './template';
import ProductPageToolbar from '../../utilities/patterns-toolbar';
import { usePostTypeCheck } from '../../hooks/usePostTypeCheck';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import SelectProductModal from './components/SelectProductModal';
import apiFetch from '@wordpress/api-fetch';

export default function ProductPageEdit({
	name,
	clientId,
	openPatternSelectionModal,
	attributes,
	setAttributes,
}) {
	const { product_id } = attributes;
	const [product, setProduct] = useState(null);
	const blockProps = useBlockProps({
		className: 'sc-product-page__editor-container',
	});

	useEffect(() => {
		if (product_id) {
			fetchProduct();
		}
	}, [product_id]);

	const fetchProduct = async () => {
		try {
			const response = await apiFetch({
				path: addQueryArgs(`surecart/v1/products/${product_id}`, {
					expand: ['prices'],
				}),
			});
			setProduct(response);
		} catch (error) {
			console.error(error);
		}
	};

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

	const chooseProduct = (product) => {
		setAttributes({
			product_id: product?.id,
		});
		setProduct(product);
	};

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
						<SelectProductModal
							attributes={attributes}
							setAttributes={setAttributes}
							defaultProduct={product}
							onChoose={chooseProduct}
							onSelectProduct={chooseProduct}
							showSelectButtons={false}
						/>
					</PanelBody>
				</InspectorControls>
			)}

			<div {...innerBlocksProps} />
		</>
	);
}
