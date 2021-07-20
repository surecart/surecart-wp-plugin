const { combineReducers, dispatch } = wp.data;
const { apiFetch } = wp;
const { __ } = wp.i18n;

const settingsReducer = ( state = {}, action ) => {
	switch ( action.type ) {
		case 'SET_SETTINGS':
			return action.settings;

		case 'UPDATE_SETTING':
			return {
				...state,
				[ `checkout_engine${ action.optionName }` ]: {
					...state[ `checkout_engine${ action.optionName }` ],
					...action.data,
				},
			};

		case 'SAVE_SETTINGS':
			apiFetch( {
				path: 'wp/v2/settings',
				method: 'POST',
				data: state,
			} )
				.then( () => {
					dispatch( 'checkout-engine/settings' ).addNotice( {
						content: __( 'Settings saved.', 'presto-player' ),
					} );
				} )
				.catch( ( e ) => {
					dispatch( 'checkout-engine/settings' ).addNotice( {
						content: e.message
							? e.message
							: 'Something went wrong.',
						className: 'is-snackbar-error',
					} );
				} )
				.finally( () => {} );
			break;
	}
	return state;
};

const uiReducer = ( state = { notices: [], saving: false }, action ) => {
	switch ( action.type ) {
		case 'SET_SAVING':
			return {
				...state,
				saving: action.value,
			};
		case 'SET_NOTICE':
			return {
				...state,
				notices: [
					...state.notices,
					{ id: state.notices.length, ...action.notice },
				],
			};
		case 'REMOVE_NOTICE':
			return {
				...state,
				notices: state.notices.filter(
					( notice ) => notice.id !== action.id
				),
			};
	}
	return state;
};

export default combineReducers( {
	settingsReducer,
	uiReducer,
} );
