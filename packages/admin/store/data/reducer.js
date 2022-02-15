import { __ } from '@wordpress/i18n';
import { combineReducers } from '@wordpress/data';
import dotProp from 'dot-prop-immutable';

export const entities = (state = {}, { type, name, id, payload }) => {
	switch (type) {
		case 'SET_MODELS':
			return payload;
		case 'ADD_MODELS':
			return {
				...state,
				...payload,
			};
		case 'UPDATE_MODEL':
			return dotProp.merge(state, `${name}.${id}`, payload);
		case 'ADD_MODEL':
		case 'SET_MODEL':
			return dotProp.set(
				state,
				`${payload?.object}.${payload?.id}`,
				payload
			);
		case 'DELETE_MODEL':
			return dotProp.delete(state, `${name}.${id}`);
	}
	return state;
};

export const config = (state = [], { type, payload }) => {
	switch (type) {
		case 'REGISTER_ENTITIES':
			return [...state, ...payload];
	}
	return state;
};

/**
 * Keep track of saved items that are dirty.
 */
export const dirty = (state = {}, { type, id, payload }) => {
	switch (type) {
		case 'UPDATE_DIRTY':
			return dotProp.merge(state, id, payload);
		case 'REMOVE_DIRTY':
			return typeof id !== 'string' ? state : dotProp.delete(state, id);
		case 'CLEAR_DIRTY':
			return {};
	}
	return state;
};

/**
 * Keep track of new items that are not yet saved.
 */
export const drafts = (state = {}, { type, name, index, payload }) => {
	switch (type) {
		case 'ADD_DRAFT':
			return {
				...state,
				[name]: [...(state[name] || []), payload],
			};
		case 'UPDATE_DRAFT':
			return dotProp.merge(state, `${name}.${index}`, payload);
		case 'REMOVE_DRAFT':
			return dotProp.delete(state, `${name}.${index}`);
		case 'CLEAR_DRAFTS':
			return dotProp.delete(state, name);
	}
	return state;
};

export const error = (state = {}, { payload, type }) => {
	switch (type) {
		case 'SET_ERROR':
			return payload;
	}
	return state;
};

/**
 * Reducer returning current network request state (whether a request to
 * the WP REST API is in progress, successful, or failed).
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function saving(state = {}, action) {
	switch (action.type) {
		case 'REQUEST_POST_UPDATE_START':
		case 'REQUEST_POST_UPDATE_FINISH':
			return {
				pending: action.type === 'REQUEST_POST_UPDATE_START',
				options: action.options || {},
			};
	}

	return state;
}

// export reducers.
export default combineReducers({
	config,
	error,
	drafts,
	entities,
	dirty,
	saving,
});
