/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useMemo, useState } from '@wordpress/element';
import {
	BlockContextProvider,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';

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

	const blockContext = useMemo(() => {
		if (!post) {
			return null;
		}

		return {
			postType: post?.type,
			postId: post?.id,
			classList: post?.class_list ?? '',
		};
	}, [post]);

	const Component = hasInnerBlocks ? QueryContent : QueryPlaceholder;

	return (
		<>
			<BlockContextProvider
				key={blockContext?.postId}
				value={blockContext}
			>
				<Component
					{...props}
					openPatternSelectionModal={() =>
						setIsPatternSelectionModalOpen(true)
					}
				/>
			</BlockContextProvider>

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
