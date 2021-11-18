import { get } from 'dot-prop-immutable';
import { createRegistrySelector } from '@wordpress/data';
import { getQueryArg, addQueryArgs } from '@wordpress/url';
import { store as uiStore } from '../ui';

export const getEntity = ( state, name ) => {
	return state.config.find( ( item ) => item.name === name );
};

export const getEntities = ( state ) => {
	return state.config;
};

export const getEntityEditLink = ( state, name, id ) => {
	const entity = getEntity( state, name );
	return entity ? addQueryArgs( entity.editLink, { id } ) : null;
};

export const selectPageId = () => {
	return getQueryArg( window.location, 'id' );
};

export const isCreated = () => {
	return !! selectPageId();
};

export const selectError = ( state ) => {
	return state.error;
};

export const selectAllModels = ( state ) => {
	return state.entities;
};

export const selectCollection = ( state, path ) => {
	return state.entities?.[ path ];
};

export const selectModel = ( state, path, index = 0 ) => {
	return get( state.entities, `${ path }.${ index }` );
};

export const selectModelById = ( state, path, id ) => {
	const models = get( state.entities, path );
	if ( ! models || ! Array.isArray( models ) ) {
		return false;
	}
	return ( models || [] ).find( ( model ) => model.id === id );
};

export const selectDirty = ( state ) => {
	return state.dirty;
};

export const hasDirtyModels = ( state ) => {
	return !! Object.keys( state.dirty || {} ).length;
};

export const isDirty = ( state, path ) => {
	let model = selectModel( state, path );
	if ( ! model?.id ) {
		return true;
	}
	return Object.keys( state?.dirty?.[ model.id ] || {} )?.length;
};

export const isSaving = createRegistrySelector( ( select ) => () => {
	return select( uiStore ).isSaving();
} );

/**
 * Prepare the save request
 */
export function prepareUpdateRequest( state, name, data ) {
	const path = data.id
		? `${ entity?.baseURL }/${ data.id }`
		: entity?.baseURL;
	return {
		path: addQueryArgs( path, entity.baseURLParams ),
		method: data.id ? 'PATCH' : 'POST',
		data,
	};
}

/**
 * Prepare the save request
 */
export function prepareFetchRequest( state, name, data ) {
	// get id and params from data
	const { id, ...params } = data;
	// get the registered entity
	const entity = getEntity( state, name );
	// make the path.
	const path = id ? `${ entity?.baseURL }/${ id }` : entity?.baseURL;
	// return the request.
	return {
		path: addQueryArgs( path, { ...entity.baseURLParams, ...params } ),
	};
}
