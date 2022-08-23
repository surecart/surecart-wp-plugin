/**
 * Internal dependencies
 */
import { camelName } from '../util';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export default (
	type,
	id,
	query = {},
	additionalItems = [],
	name = 'surecart'
) => {
	// dispatchers.
	const {
		editEntityRecord,
		deleteEntityRecord,
		saveEntityRecord,
		saveEditedEntityRecord,
	} = useDispatch(coreStore);

	// the entity data.
	const entityData = [name, type, id, query];

	/** Get entity info. */
	const {
		item,
		itemError,
		itemResolutionState,
		hasLoadedItem,
		savingItem,
		deletingItem,
		hasEdits,
		edits,
		saveError,
	} = useSelect(
		(select) => {
			return {
				item: select(coreStore)?.getEditedEntityRecord?.(...entityData),
				hasLoadedItem: select(coreStore)?.hasFinishedResolution?.(
					'getEditedEntityRecord',
					[...entityData]
				),
				itemError: select(coreStore)?.getResolutionError?.(
					'getEditedEntityRecord',
					...entityData
				),
				itemResolutionState: select(coreStore)?.getResolutionState?.(
					'getEditedEntityRecord',
					...entityData
				),
				savingItem: select(coreStore)?.isSavingEntityRecord?.(
					...entityData
				),
				saveError: select(coreStore)?.getLastEntitySaveError?.(
					...entityData
				),
				deletingItem: select(coreStore)?.isDeletingEntityRecord?.(
					...entityData
				),
				hasEdits: select(coreStore).hasEditsForEntityRecord(
					...entityData
				),
				edits: select(coreStore).getEntityRecordEdits(...entityData),
			};
		},
		[id, ...additionalItems]
	);

	/** Edit the entity. */
	const editEntity = (data) => editEntityRecord(name, type, id, data);

	/** Delete the entity. */
	const deleteEntity = (options = {}) =>
		deleteEntityRecord(name, type, id, {}, options);

	/** Save the entity. */
	const saveEntity = (data, options) =>
		saveEntityRecord(name, type, { ...item, ...data }, options);

	const saveEditedEntity = (options = {}) =>
		saveEditedEntityRecord(name, type, id, options);

	const ucName = camelName(type);

	return {
		// item.
		item,
		[type]: item,

		itemError,
		[`${ucName}Error`]: itemError,

		itemResolutionState,
		[`${ucName}ResolutionState`]: itemResolutionState,

		// loaded.
		hasLoadedItem,
		[`hasLoaded${ucName}`]: hasLoadedItem,

		edits,

		// updating.
		savingItem,
		[`saving${ucName}`]: savingItem,

		saveError,
		[`save${ucName}Error`]: saveError,

		// deleting.
		deletingItem,
		[`deleting${ucName}`]: deletingItem,

		// data.
		entityData,
		[`${item}Data`]: entityData,

		// save.
		saveItem: saveEntity,
		[`save${ucName}`]: saveEntity,

		saveEditedEntity,
		[`saveEdited${ucName}`]: saveEditedEntity,

		// edit
		editItem: editEntity,
		[`edit${ucName}`]: editEntity,

		// delete.
		deleteItem: deleteEntity,
		[`delete${ucName}`]: deleteEntity,
	};
};
