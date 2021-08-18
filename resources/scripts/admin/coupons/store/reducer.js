const { combineReducers } = wp.data;
import { omit } from 'lodash';

const promotion = ( state = {}, action ) => {
	switch ( action.type ) {
		case 'SET_PROMOTION':
			return action.value;
		case 'UPDATE_PROMOTION':
			return { ...state, ...action.value };
		// set coupon id in promotion when set.
		case 'SET_COUPON':
		case 'UPDATE_COUPON':
			return {
				...state,
				coupon_id: action?.value?.id,
			};
	}
	return state;
};

const coupon = ( state = { name: '' }, action ) => {
	switch ( action.type ) {
		case 'SET_COUPON':
			return action.value;
		case 'UPDATE_COUPON':
			return { ...state, ...action.value };
		case 'SET_PROMOTION':
			return action.value.coupon;
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
	coupon,
	promotion,
	saving,
	postSavingLock,
} );
