/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { commentAuthorAvatar as icon } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import edit, { ReviewFormToolbar } from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Styles.
 */
import './style.scss';
import './editor.scss';

/**
 * Register block.
 */
registerBlockType(metadata, {
	icon,
	edit,
	save,
});

/**
 * Add the review form toolbar to all blocks within the product-review-form context.
 */
const withReviewFormToolbar = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { name, clientId } = props;

		// Skip if this is the product-review-form block itself
		if (name === 'surecart/product-review-form') {
			return <BlockEdit {...props} />;
		}

		// Get the parent block information
		const { parentBlockId, parentEditingView } = useSelect(
			(select) => {
				const { getBlockParentsByBlockName, getBlockAttributes } =
					select(blockEditorStore);
				const parents = getBlockParentsByBlockName(
					clientId,
					'surecart/product-review-form'
				);
				const parentId = parents.length > 0 ? parents[0] : null;
				const parentAttrs = parentId
					? getBlockAttributes(parentId)
					: null;

				return {
					parentBlockId: parentId,
					parentEditingView: parentAttrs?.editingView || 'form',
				};
			},
			[clientId]
		);

		const { updateBlockAttributes } = useDispatch(blockEditorStore);

		// Only add toolbar if block is within a product-review-form
		if (!parentBlockId) {
			return <BlockEdit {...props} />;
		}

		return (
			<>
				<ReviewFormToolbar
					editingView={parentEditingView}
					onChangeEditingView={(view) => {
						updateBlockAttributes(parentBlockId, {
							editingView: view,
						});
					}}
				/>
				<BlockEdit {...props} />
			</>
		);
	};
}, 'withReviewFormToolbar');

addFilter(
	'editor.BlockEdit',
	'surecart/product-review-form/add-toolbar-to-children',
	withReviewFormToolbar
);
