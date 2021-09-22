import dotProp from 'dot-prop-immutable';

function unique( array = [], propertyName ) {
	return array.filter(
		( e, i ) =>
			array.findIndex(
				( a ) => a[ propertyName ] === e[ propertyName ]
			) === i
	);
}

// Store based on nested key. (i.e. product.price)
export const entities = ( state = {}, { type, key, payload, id } ) => {
	switch ( type ) {
		case 'SET_ENTITIES':
			return payload;
		case 'UPDATE_ENTITIES':
			const merged = dotProp.merge( state, key, payload );
			const uniqueEntities = unique( merged?.[ key ] || [], 'id' );
			return dotProp.set( state, key, uniqueEntities );
		case 'SET_MODEL':
			return dotProp.set( state, key, payload );
		case 'SET_MODEL_BY_ID':
			const items = dotProp.get( state, key, payload );
			const item = items.find( ( item ) => ( item.id = id ) );
			const index = items.findIndex( item );
			return dotProp.set( state, `${ key }.${ index }`, payload );
		case 'ADD_MODEL':
			return dotProp.set( state, key, ( list ) => [
				...( list || [] ),
				payload,
			] );
		case 'UPDATE_MODEL':
			return dotProp.merge( state, key, payload );
		case 'DELETE_MODEL':
			return dotProp.delete( state, key );
		default:
			return state;
	}
};

export const dirty = ( state = {}, { type, id, payload } ) => {
	switch ( type ) {
		case 'UPDATE_DIRTY':
			return dotProp.merge( state, id, payload );
		case 'REMOVE_DIRTY':
			return dotProp.delete( state, id );
		case 'CLEAR_DIRTY':
			return {};
		default:
			return state;
	}
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
export function saving( state = {}, action ) {
	switch ( action.type ) {
		case 'REQUEST_POST_UPDATE_START':
		case 'REQUEST_POST_UPDATE_FINISH':
			return {
				pending: action.type === 'REQUEST_POST_UPDATE_START',
				options: action.options || {},
			};
	}

	return state;
}
