import { store as coreStore } from '@wordpress/core-data';
import { createRegistrySelector } from '@wordpress/data';
import { addQueryArgs, getQueryArg } from '@wordpress/url';
import { get } from 'dot-prop-immutable';

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

export const getEntityEditLink = (state, name, id) => {
	const entity = getEntity(state, name);
	return entity ? addQueryArgs(entity.editLink, { id }) : null;
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

export const selectCollection = (state, name) => {
	return Object.values(state.entities?.[name] || {});
};

export const selectModel = (state, name, id) => {
	return state.entities?.[name]?.[id];
};

export const selectRelation = (state, name, id, relation) => {
	let model = selectModel(state, name, id);
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
	if ('current_period' === relation) {
		collection = 'period';
	}
	return Object.values(state?.entities?.[collection] || {}).find((item) => {
		return item.id === model?.[relation];
	});
};

export const selectDirty = (state) => {
	return state.dirty;
};

export const selectAllDrafts = (state) => {
	return Object.values(state.drafts || {}).filter((category) =>
		category.some((item) => !item?.id)
	);
};

export const selectDrafts = (state, name) => {
	return Object.values(state.drafts?.[name] || {}).filter(
		(item) => !item?.id
	);
};

export const selectDraft = (state, name, index) => {
	return state.drafts?.[name]?.[index] || [];
};

export const hasDirtyModels = (state) => {
	return !!Object.keys(state.dirty || {}).length;
};

export const isDirty = (state, path) => {
	let model = selectModel(state, path);
	if (!model?.id) {
		return true;
	}
	return Object.keys(state?.dirty?.[model.id] || {})?.length;
};

export const isSaving = createRegistrySelector((select) => () => {
	return select(uiStore).isSaving();
});

/**
 * Prepare the save request
 */
export function prepareUpdateRequest(state, name, data) {
	const path = data.id ? `${entity?.baseURL}/${data.id}` : entity?.baseURL;
	return {
		path: addQueryArgs(path, entity.baseURLParams),
		method: data.id ? 'PATCH' : 'POST',
		data,
	};
}

/**
 * Prepare the save request
 */
export function prepareFetchRequest(state, name, data) {
	// get id and params from data
	const { id, ...params } = data;
	// get the registered entity
	const entity = getEntity(state, name);
	// make the path.
	const path = id ? `${entity?.baseURL}/${id}` : entity?.baseURL;
	// return the request.
	return {
		path: addQueryArgs(path, {
			...(entity?.baseURLParams ? entity.baseURLParams : {}),
			...params,
		}),
	};
}

export const getEditedEntityRecords = createRegistrySelector(
	(select) => ( state, kind, name, query) =>  {
    const records = select(coreStore).getEntityRecords(kind, name, query);
    return records.map((record) => {

    });
  }
)
