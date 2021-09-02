const { combineReducers } = wp.data;
import { omit } from 'lodash';

const product = ( state = {}, action ) => {
	switch ( action.type ) {
		case 'SET_PRODUCT':
			return action.value;
		case 'UPDATE_PRODUCT':
			return { ...state, ...action.value };
	}
	return state;
};

const lastSavedPrices = ( state = [], action ) => {
	switch ( action.type ) {
		case 'SET_PRICES':
			return action.value;
	}
	return state;
};

const prices = (
	state = [
		{
			recurring: false,
			name: 'Default',
		},
	],
	action
) => {
	switch ( action.type ) {
		case 'SET_PRICES':
			return action.value;
		case 'ADD_PRICE':
			return [
				...state.slice( 0, action.index ),
				action.item,
				...state.slice( action.index ),
			];
		case 'UPDATE_PRICE':
			return state.map( ( item, index ) => {
				if ( index !== action.index ) {
					return item;
				}
				return {
					...item,
					...action.item,
				};
			} );
		case 'UPDATE_PRICES':
			return state.map( ( item ) => {
				return {
					...item,
					...action.item,
				};
			} );
		case 'REMOVE_PRICE':
			return state.filter( ( item, index ) => index !== action.index );
		case 'SET_PRODUCT':
			// TODO: update product id in all prices without an product_id
			return action.value.prices;
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

/**
 * Post saving lock.
 *
 * When post saving is locked, the post cannot be published or updated.
 *
 * @param {PostLockState} state  Current state.
 * @param {Object}        action Dispatched action.
 *
 * @return {PostLockState} Updated state.
 */
const postSavingLock = ( state = {}, action ) => {
	switch ( action.type ) {
		case 'LOCK_POST_SAVING':
			return { ...state, [ action.lockName ]: true };

		case 'UNLOCK_POST_SAVING':
			return omit( state, action.lockName );
	}
	return state;
};

export default combineReducers( {
	product,
	prices,
	saving,
	lastSavedPrices,
	postSavingLock,
} );
