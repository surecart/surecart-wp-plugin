/**
 * WordPress dependencies.
 */
import {
	useInnerBlocksProps,
	useBlockProps,
	InnerBlocks,
	BlockControls,
} from '@wordpress/block-editor';
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
