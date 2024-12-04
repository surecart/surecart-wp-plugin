/**
 * External dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useEffect } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { isEmpty, filter, first, map, pick, isNil } from 'lodash';

export const useSharedFieldAttributes = ({
	attributes,
	clientId,
	parentName = 'surecart/checkout-form',
	setAttributes,
	sharedAttributes,
}) => {
	const { updateBlockAttributes } = useDispatch(blockEditorStore);

	const siblings = useSelect(
		(select) => {
			const blockEditor = select(blockEditorStore);

			const parentId = first(
				blockEditor.getBlockParentsByBlockName(clientId, parentName)
			);

			return filter(
				blockEditor.getBlocks(parentId),
				(block) => block.attributes.shareFieldAttributes
			);
		},
		[clientId]
	);

	useEffect(() => {
		if (!isEmpty(siblings) && attributes.shareFieldAttributes) {
			const newSharedAttributes = pick(
				first(siblings).attributes,
				sharedAttributes
			);
			updateBlockAttributes([clientId], newSharedAttributes);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return useCallback(
		(newAttributes) => {
			let blocksToUpdate;
			let newSharedAttributes;

			if (
				attributes.shareFieldAttributes &&
				isNil(newAttributes.shareFieldAttributes)
			) {
				blocksToUpdate = map(siblings, (block) => block.clientId);
				newSharedAttributes = pick(newAttributes, sharedAttributes);
			} else if (
				newAttributes.shareFieldAttributes &&
				!isEmpty(siblings)
			) {
				blocksToUpdate = [clientId];
				newSharedAttributes = pick(
					first(siblings).attributes,
					sharedAttributes
				);
			}

			if (!isEmpty(blocksToUpdate) && !isEmpty(newSharedAttributes)) {
				updateBlockAttributes(blocksToUpdate, newSharedAttributes);
			}

			setAttributes(newAttributes);
		},
		[
			attributes,
			clientId,
			setAttributes,
			sharedAttributes,
			siblings,
			updateBlockAttributes,
		]
	);
};
