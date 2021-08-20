// store account settings.
export default ( state = { currency: 'usd' }, action ) => {
	switch ( action.type ) {
		case 'SET_ACCOUNT':
			return action.value;
		case 'SET_CURRENCY':
			return {
				...state,
				currency: action.value,
			};
	}
};
