/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import QueryContent from './product-page-content';
import QueryPlaceholder from './list-placeholder';
import PatternSelectionModal from '../../utilities/pattern-selection-modal';

export default (props) => {
	const { clientId, attributes, name } = props;
	const [isPatternSelectionModalOpen, setIsPatternSelectionModalOpen] =
		useState(false);
	const hasInnerBlocks = useSelect(
		(select) => !!select(blockEditorStore).getBlocks(clientId).length,
		[clientId]
	);
	const Component = hasInnerBlocks ? QueryContent : QueryPlaceholder;
	return (
		<>
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
