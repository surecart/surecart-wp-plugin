/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
/**
 * Internal dependencies
 */
import { camelName } from '../util';

export default (type, id, query = {}, name = 'surecart') => {
	// dispatchers.
	const { editEntityRecord, deleteEntityRecord, saveEntityRecord } =
		useDispatch(coreStore);

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
			};
		},
		[id]
	);

	/** Edit the entity. */
	const editEntity = (data) => editEntityRecord(name, type, id, data);

	/** Delete the entity. */
	const deleteEntity = (options = {}) => {
		return deleteEntityRecord(name, type, id, {}, options);
	};

	/** Save the entity. */
	const saveEntity = (data, options) =>
		saveEntityRecord(name, type, { ...item, ...data }, options);

	const ucName = camelName(type);

	if (hasLoadedItem && Object.keys(item).length === 0) {
		throw __(
			'Fetch failed. Please double-check your API token is correct in the connection tab of your settings.',
			'surecart'
		);
	}

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

		// edit
		editItem: editEntity,
		[`edit${ucName}`]: editEntity,

		// delete.
		deleteItem: deleteEntity,
		[`delete${ucName}`]: deleteEntity,
	};
};
