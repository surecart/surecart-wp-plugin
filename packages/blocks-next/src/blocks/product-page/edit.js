/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import QueryContent from './product-page-content';
import QueryPlaceholder from './list-placeholder';
import PatternSelectionModal from '../../utilities/pattern-selection-modal';

export default (props) => {
	const { clientId, attributes, name, setAttributes } = props;
	const [isPatternSelectionModalOpen, setIsPatternSelectionModalOpen] =
		useState(false);
	const hasInnerBlocks = useSelect(
		(select) => !!select(blockEditorStore).getBlocks(clientId).length,
		[clientId]
	);
	const Component = hasInnerBlocks ? QueryContent : QueryPlaceholder;
	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Product Page Settings', 'surecart')}>
					<ToggleControl
						label={__('Show sticky purchase button', 'surecart')}
						help={__('Display a sticky purchase button when the product form is scrolled out of view', 'surecart')}
						checked={attributes.show_sticky_purchase_button}
						onChange={(show_sticky_purchase_button) => setAttributes({ show_sticky_purchase_button })}
					/>
				</PanelBody>
			</InspectorControls>

			<Component
				{...props}
				openPatternSelectionModal={() =>
					setIsPatternSelectionModalOpen(true)
				}
			/>
			{isPatternSelectionModalOpen && (
				<PatternSelectionModal
					clientId={clientId}
					attributes={attributes}
					setIsPatternSelectionModalOpen={
						setIsPatternSelectionModalOpen
					}
					name={name}
				/>
			)}
		</>
	);
};
