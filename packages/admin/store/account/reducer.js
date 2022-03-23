// store account settings.
export default (
	state = {
		currency: scData?.currency_code,
		supported_currencies: scData.supported_currencies,
	},
	action
) => {
	switch (action.type) {
		case 'SET_ACCOUNT':
			return action.value;
		case 'SET_CURRENCY':
			return {
				...state,
				currency: action.value,
			};
	}
};
