import { __ } from '@wordpress/i18n';
import { batchSave, fetch as apiFetch } from './controls';
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
 * Add a saved model to the store.
 */
export function addModel(payload) {
	return {
		type: 'ADD_MODEL',
		payload,
	};
}

/**
 * Add a draft model to the store.
 */
export function addDraft(name, payload) {
	return {
		type: 'ADD_DRAFT',
		name,
		payload,
	};
}

/**
 * Duplicate price. (Alias for Add Price)
 */
export function duplicateModel(payload) {
	return addModel(payload);
}

/**
 * Update model by path.
 */
export function* updateModel(name, id, payload) {
	// first update dirty so we know to save.
	yield controls.dispatch(coreStore, 'updateDirty', id, payload);

	return {
		type: 'UPDATE_MODEL',
		name,
		id,
		payload,
	};
}

/**
 * Receive entity records and normalize data.
 */
export function* receiveModels(payload) {
	// Normalize data
	const payloadArray = Array.isArray(payload) ? payload : [payload];
	const { entities } = normalizeEntities(payloadArray);
	for (const key of Object.keys(entities || {})) {
		const models = entities[key];
		for (const id of Object.keys(models || {})) {
			yield controls.dispatch(coreStore, 'addModel', models[id]);
			yield controls.dispatch(coreStore, 'removeDirty', models[id]?.id);
		}
	}
}

/**
 * Update dirty item.
 */
export function* updateDirty(id, payload) {
	yield {
		type: 'UPDATE_DIRTY',
		id,
		payload,
	};
}

/**
 * Update draft item.
 */
export function* updateDraft(name, index = 0, payload) {
	yield {
		type: 'UPDATE_DRAFT',
		name,
		index,
		payload,
	};
}

/**
 * Delete model by path.
 */
export function* deleteModel(name, id) {
	let response;
	try {
		yield controls.dispatch(uiStore, 'setSaving', true);
		response = yield apiFetch({
			path: `${name}s/${id}`,
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
			id,
			name,
		};
	}
	// didn't update.
	throw {
		message: 'Failed to delete.',
	};
}

/**
 * Clear dirty state.
 */
export function* removeDirty(id) {
	yield {
		type: 'REMOVE_DIRTY',
		id,
	};
}

/**
 * Clear dirty state.
 */
export function* removeDraft(name, index) {
	yield {
		type: 'REMOVE_DRAFT',
		name,
		index,
	};
}

export function* clearDrafts(name) {
	yield {
		type: 'CLEAR_DRAFTS',
		name,
	};
}

/**
 * Clear dirty state.
 */
export function clearDirty() {
	return {
		type: 'CLEAR_DIRTY',
	};
}

export function* saveData(name, data, { query, ...requestArgs } = {}) {
	// set saving
	yield controls.dispatch(uiStore, 'setSaving', true);

	// clear errors
	yield controls.dispatch(uiStore, 'clearModelErrors', name);

	const path = data?.id ? `${name}s/${data?.id}` : `${name}s`;

	let response = yield apiFetch({
		path: addQueryArgs(path, query || {}),
		method: data?.id ? 'PATCH' : 'POST',
		data,
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

	return response;
}

export function* saveModel(
	key,
	id,
	{ query, data, path, ...requestArgs } = {}
) {
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
	const modelPath = id ? `${key}s/${id}` : `${key}s`;
	const baseUrl = path ? path : modelPath;
	return yield apiFetch({
		path: addQueryArgs(baseUrl, query || {}),
		method: id ? 'PATCH' : 'POST',
		data,
		...requestArgs,
	});
}

export function* saveDrafts(name, { query, data, path, ...requestArgs } = {}) {
	// set saving
	yield controls.dispatch(uiStore, 'setSaving', true);

	// clear errors
	yield controls.dispatch(uiStore, 'clearModelErrors', key);

	// get drafts
	const drafts = yield controls.resolveSelect(coreStore, 'selectDrafts', key);

	// bail, no draft to save here.
	if (!drafts?.length) {
		return yield controls.dispatch(uiStore, 'setSaving', false);
	}

	// batch request others if dirty
	let batch = [];
	drafts.forEach((name) => {
		drafts.forEach((model, index) => {
			batch.push({
				key: name,
				request: prepareSaveRequest(model, entity),
				index,
			});
		});
	});
	return yield batchSave(batch);
}

export function* saveDraft(
	key,
	index,
	{ query, data, path, ...requestArgs } = {}
) {
	// set saving
	yield controls.dispatch(uiStore, 'setSaving', true);

	// clear errors
	yield controls.dispatch(uiStore, 'clearModelErrors', key);

	// get dirty models
	const draft = yield controls.resolveSelect(
		coreStore,
		'selectDraft',
		key,
		index
	);

	// bail, no draft to save here.
	if (!Object.keys(draft || {}).length) {
		return yield controls.dispatch(uiStore, 'setSaving', false);
	}

	// make the request.
	let response = yield makeRequest({
		key,
		query,
		data: { ...draft, ...data },
		...requestArgs,
	});

	// didn't update.
	if (!response || !response?.id) {
		throw {
			message: __('Failed to save.', 'checkout_engine'),
		};
	}

	// update the draft.
	yield controls.dispatch(coreStore, 'updateDraft', key, index, response);

	// update model.
	yield controls.dispatch(coreStore, 'receiveModels', response);

	// remove draft.
	// yield controls.dispatch(coreStore, 'removeDraft', key, index);

	// set saving
	yield controls.dispatch(uiStore, 'setSaving', false);

	return response;
}

/**
 * Receive the model.
 */
export function* receiveModel(data) {
	yield controls.dispatch(coreStore, 'updateModel', data);
	return yield controls.dispatch(coreStore, 'removeDirty', data?.id);
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
