import { __ } from '@wordpress/i18n';
import { fetch as apiFetch, batchSave } from './controls';
import { addQueryArgs } from '@wordpress/url';
import { controls } from '@wordpress/data';
import { store as uiStore } from '../ui';
import { store as coreStore } from '../data';
import { normalizeEntities } from '../../schema';

export function setError(payload) {
	return {
		type: 'SET_ERROR',
		payload,
	};
}

export function registerEntities(payload) {
	return {
		type: 'REGISTER_ENTITIES',
		payload,
	};
}

/**
 * Bulk set all models
 */
export function setModels(payload) {
	return {
		type: 'SET_MODELS',
		payload,
	};
}

/**
 * Bulk add models
 */
export function addModels(payload) {
	return {
		type: 'ADD_MODELS',
		payload,
	};
}

export function* updateModelsProperty(key, prop, payload) {
	return {
		type: 'UPDATE_MODELS_PROPERTY',
		payload,
		key,
		prop,
	};
}

export function updateModels(key, payload) {
	return {
		type: 'UPDATE_MODELS',
		payload,
		key,
	};
}

/**
 * Set model by path
 */
export function setModel(key, payload, index = 0) {
	return {
		type: 'SET_MODEL',
		key: `${key}.${index}`,
		payload,
	};
}

/**
 * Add model by path.
 */
export function addModel(key, payload) {
	return {
		type: 'ADD_MODEL',
		key,
		payload,
	};
}

/**
 * Duplicate price. (Alias for Add Price)
 */
export function duplicateModel(key, { id, ...payload }) {
	return addModel(key, payload);
}

/**
 * Update model by path.
 */
export function* updateModel(model = {}, payload, index = 0) {
	if (!model.id) {
	} else {
		yield controls.dispatch(coreStore, 'updateDirty', key, payload, index);
	}

	// first update dirty so we know to save.
	yield controls.dispatch(coreStore, 'updateDirty', key, payload, index);

	return {
		type: 'UPDATE_MODEL',
		key: `${key}.${index}`,
		payload,
	};
}

/**
 * Receive entity records and normalize data.
 */
export function* receiveModels(payload) {
	// Normalize data
	const payloadArray = Array.isArray(payload) ? payload : [payload];
	const normalized = normalizeEntities(payloadArray);
	let transformed = {};
	Object.keys(normalized?.entities || {}).forEach((name) => {
		transformed[name] = Object.values(normalized.entities[name] || {}).map(
			(item) => item
		);
	});

	for (const key of Object.keys(transformed)) {
		for (const [index] of transformed[key].entries()) {
			yield controls.dispatch(coreStore, 'removeDirty', key, index);
		}
	}

	for (var key of Object.keys(transformed)) {
		yield updateCollection(key, transformed[key]);
	}
}

export function updateCollection(key, payload) {
	return {
		type: 'UPDATE_COLLECTION',
		key,
		payload,
	};
}

export function setModelById(key, payload, index = 0) {
	return {
		type: 'SET_MODEL_BY_ID',
		key,
		payload,
		id,
	};
}

export function* updateModelById(key, id, payload) {
	const collection = yield controls.resolveSelect(
		coreStore,
		'selectCollection',
		key
	);

	const index = collection.findIndex((item) => item.id == id);

	return yield controls.dispatch(
		coreStore,
		'updateModel',
		key,
		payload,
		index
	);
}

/**
 * Update dirty list.
 */
export function* updateDirty(key, payload, index = 0) {
	const model = yield controls.resolveSelect(
		coreStore,
		'selectModel',
		key,
		index
	);

	// set dirty.
	if (model?.id) {
		yield {
			type: 'UPDATE_DIRTY',
			id: model?.id,
			payload,
		};
	} else {
		yield {
			type: 'UPDATE_DRAFTS',
			index,
			payload,
		};
	}
}

/**
 * Update dirty list.
 */
export function* updateDrafts(payload, index = 0) {
	yield {
		type: 'UPDATE_DRAFTS',
		id: payload?.object,
		payload,
	};
}

/**
 * Delete model by path.
 */
export function* deleteModel(key, index = 0) {
	const data = yield controls.resolveSelect(
		coreStore,
		'selectModel',
		key,
		index
	);

	if (data?.id) {
		let response;
		try {
			yield controls.dispatch(uiStore, 'setSaving', true);
			response = yield apiFetch({
				path: data.id
					? `${data.object}s/${data.id}`
					: `${data.object}s`,
				method: 'DELETE',
			});
		} catch (error) {
			throw error;
		} finally {
			yield controls.dispatch(uiStore, 'setSaving', false);
		}

		// success.
		if (response) {
			// add notice.
			yield controls.dispatch(uiStore, 'addSnackbarNotice', {
				content: __('Deleted.', 'checkout_engine'),
			});
			return {
				type: 'DELETE_MODEL',
				key: `${key}.${index}`,
			};
		}

		// didn't update.
		throw {
			message: 'Failed to delete.',
		};
	}

	return {
		type: 'DELETE_MODEL',
		key: `${key}.${index}`,
	};
}

/**
 * Clear dirty state.
 */
export function* removeDirty(key, index = 0) {
	const model = yield controls.resolveSelect(
		coreStore,
		'selectModel',
		key,
		index
	);

	// set dirty.
	if (model?.id) {
		yield {
			type: 'REMOVE_DIRTY',
			id: model?.id,
		};
	}
}

/**
 * Clear dirty state.
 */
export function clearDirty() {
	return {
		type: 'CLEAR_DIRTY',
	};
}

export function* toggleArchiveModel(key, index = 0, save = true) {
	const model = yield controls.resolveSelect(
		coreStore,
		'selectModel',
		key,
		index
	);

	// change to archived.
	yield controls.dispatch(
		coreStore,
		'updateModel',
		key,
		{ archived: !model.archived },
		index
	);

	if (model.id && save) {
		return yield controls.dispatch(coreStore, 'saveModel', key, index);
	}
}

export function* saveCollections(names = []) {
	// get all models
	const allModels = yield controls.resolveSelect(
		coreStore,
		'selectAllModels'
	);
	// get dirty models
	const dirty = yield controls.resolveSelect(coreStore, 'selectDirty');
	const entities = yield controls.resolveSelect(coreStore, 'getEntities');

	// batch request others if dirty
	let batch = [];
	names.forEach((name) => {
		const entity = entities.find((entity) => entity.name === name);
		if (allModels?.[name]) {
			const models = allModels?.[name];
			if (Array.isArray(models)) {
				models.forEach((model, index) => {
					if (isDirty(model, dirty)) {
						batch.push({
							key: name,
							request: prepareSaveRequest(model, entity),
							index,
						});
					}
				});
			} else {
				if (isDirty(model, dirty)) {
					batch.push({
						key: name,
						request: prepareSaveRequest(models, entity),
					});
				}
			}
		}
	});

	return yield batchSave(batch);
}

export function* saveModelById(key, id, { query, data, path, ...requestArgs }) {
	// set saving
	yield controls.dispatch(uiStore, 'setSaving', true);

	// clear errors
	yield controls.dispatch(uiStore, 'clearModelErrors', key);

	// get dirty models
	const dirty = yield controls.resolveSelect(coreStore, 'selectDirty');

	// create path.
	const modelPath = id ? `${key}s/${id}` : `${key}`;
	const baseUrl = path ? path : modelPath;

	// find data to save.
	const dataToSave = Object.keys(data || {}).length ? data : dirty?.[id];

	if (!Object.keys(dataToSave || {}).length && !path) {
		return yield controls.dispatch(uiStore, 'setSaving', false);
	}

	console.log({ dataToSave, path });

	let response = yield apiFetch({
		path: addQueryArgs(baseUrl, query || {}),
		method: id ? 'PATCH' : 'POST',
		data: dataToSave,
		...requestArgs,
	});

	// didn't update.
	if (!response || !response?.id) {
		throw {
			message: __('Failed to save.', 'checkout_engine'),
		};
	}

	// update model.
	yield controls.dispatch(coreStore, 'receiveModels', response);

	// set saving
	yield controls.dispatch(uiStore, 'setSaving', false);
}

/**
 * Returns an action to make a model requestå
 */
export function* makeRequest({ id, key, query, data, path, ...requestArgs }) {
	const modelPath = id ? `${key}s/${id}` : `${key}`;
	const baseUrl = path ? path : modelPath;
	return yield apiFetch({
		path: addQueryArgs(baseUrl, query || {}),
		method: id ? 'PATCH' : 'POST',
		data,
		...requestArgs,
	});
}

export function* saveModel(
	key,
	index,
	{ query, data, path, ...requestArgs } = { query: {}, data: {}, path: '' }
) {
	// set saving
	yield controls.dispatch(uiStore, 'setSaving', true);

	// clear errors
	yield controls.dispatch(uiStore, 'clearModelErrors', key);

	// get dirty models
	const dirty = yield controls.resolveSelect(coreStore, 'selectDirty');

	// get fresh model.
	const model = yield controls.resolveSelect(
		coreStore,
		'selectModel',
		key,
		index
	);

	// save main model if new or dirty.
	if (!model?.id || dirty?.[model?.id] || data || path) {
		// get model or model.
		let saveData = dirty?.[model?.id] || model;
		// maybe overwrite save data.
		saveData = Object.keys(data).length ? data : saveData;
		// make the request.
		let response = yield makeRequest({
			key,
			id: model?.id,
			path,
			query,
			data: saveData,
			...requestArgs,
		});

		// didn't update.
		if (!response || !response?.id) {
			throw {
				message: __('Failed to save.', 'checkout_engine'),
			};
		}

		// update model.
		yield controls.dispatch(coreStore, 'receiveModels', response);
	}

	// set saving
	yield controls.dispatch(uiStore, 'setSaving', false);
}

/**
 * Receive the model.
 */
export function* receiveModel(key, data, index) {
	yield controls.dispatch(coreStore, 'updateModel', key, data, index);
	return yield controls.dispatch(coreStore, 'removeDirty', key, index);
}

/**
 * Is the model dirty?
 */
export function isDirty(model, dirty) {
	if (!model?.id) {
		return true;
	}
	return Object.keys(dirty?.[model?.id] || {}).length;
}

/**
 * Prepare the save request
 */
export function prepareSaveRequest(data, entity) {
	const path = data.id ? `${entity?.baseURL}/${data.id}` : entity?.baseURL;
	return {
		path: addQueryArgs(path, entity.baseURLParams),
		method: data.id ? 'PATCH' : 'POST',
		data,
	};
}
