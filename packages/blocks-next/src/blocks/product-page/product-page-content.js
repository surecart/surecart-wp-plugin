/**
 * WordPress dependencies.
 */
import {
	InspectorControls,
	useInnerBlocksProps,
	useBlockProps,
	InnerBlocks,
	BlockControls,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import template from './template';
import ProductPageToolbar from '../../utilities/patterns-toolbar';

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

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Product Page Settings', 'surecart')}>
					<ToggleControl
						label={__('Show sticky purchase button', 'surecart')}
						help={__(
							'Display a sticky purchase button when the product form is scrolled out of view',
							'surecart'
						)}
						checked={attributes.show_sticky_purchase_button}
						onChange={(show_sticky_purchase_button) =>
							setAttributes({ show_sticky_purchase_button })
						}
					/>
				</PanelBody>
			</InspectorControls>

			<BlockControls>
				<ProductPageToolbar
					name={name}
					clientId={clientId}
					openPatternSelectionModal={openPatternSelectionModal}
				/>
			</BlockControls>
			<div {...innerBlocksProps} />
		</>
	);
}
