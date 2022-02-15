import { get } from 'dot-prop-immutable';
import { createRegistrySelector } from '@wordpress/data';
import { getQueryArg, addQueryArgs } from '@wordpress/url';
import { store as uiStore } from '../ui';

export const getEntity = (state, name) => {
	return state.config.find((item) => item.name === name);
};

export const selectEntity = (state, name) => {
	return state.config.find((item) => item.name === name);
};

export const getEntities = (state) => {
	return state.config;
};

export const selectEntities = (state, name) => {
	return state.config.find((item) => item.name === name);
};

export const selectPageId = () => {
	return getQueryArg(window.location, 'id');
};

export const isCreated = () => {
	return !!selectPageId();
};

export const selectError = (state) => {
	return state.error;
};

export const selectAllModels = (state) => {
	return state.entities;
};

export const selectCollection = (state, path) => {
	return state.entities?.[path];
};

export const selectModel = (state, path, id) => {
	return get(state.entities, `${path}.${id}`);
};

export const selectRelation = (state, path, id, relation) => {
	let model = selectModelById(state, path, id);
	if (!model) {
		return false;
	}

	relation.split('.').forEach((name) => {
		model = selectSingleRelation(state, model, name);
	});

	return model;
};

export const selectSingleRelation = (state, model, relation) => {
	let collection = relation;
	if ('latest_invoice' === relation) {
		collection = 'invoice';
	}
	return (state?.entities?.[collection] || []).find((item) => {
		return item.id === model?.[relation];
	});
};

export const selectDirty = (state) => {
	return state.dirty;
};

export const hasDirtyModels = (state) => {
	return !!Object.keys(state.dirty || {}).length;
};

export const isDirty = (state, model) => {
	return Object.keys(state?.dirty?.[model.id] || {})?.length;
};

export const isSaving = createRegistrySelector((select) => () => {
	return select(uiStore).isSaving();
});

/**
 * Prepare the save request
 */
// export function prepareUpdateRequest(state, name, data) {
// 	const path = data.id ? `${entity?.baseURL}/${data.id}` : entity?.baseURL;
// 	return {
// 		path: addQueryArgs(path, entity.baseURLParams),
// 		method: data.id ? 'PATCH' : 'POST',
// 		data,
// 	};
// }

// /**
//  * Prepare the save request
//  */
// export function prepareFetchRequest(state, name, data) {
// 	// get id and params from data
// 	const { id, ...params } = data;
// 	// get the registered entity
// 	const entity = getEntity(state, name);
// 	// make the path.
// 	const path = id ? `${entity?.baseURL}/${id}` : entity?.baseURL;
// 	// return the request.
// 	return {
// 		path: addQueryArgs(path, {
// 			...(entity?.baseURLParams ? entity.baseURLParams : {}),
// 			...params,
// 		}),
// 	};
// }
