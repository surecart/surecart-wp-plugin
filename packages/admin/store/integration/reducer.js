import { combineReducers } from '@wordpress/data';

const integrations = (state = [], action) => {
	switch (action.type) {
		case 'SET_INTEGRATIONS':
			return action.value;
		case 'ADD_INTEGRATION':
			return [
				// maybe filter out an integration with the same id?
				...state.filter((p) => p.id !== action.value.id),
				action.value,
			];
	}
	return state;
};

const providers = (state = [], action) => {
	switch (action.type) {
		case 'SET_INTEGRATION_PROVIDERS':
			return action.value;
		case 'ADD_INTEGRATION_PROVIDER':
			return [
				// maybe filter out an integration with the same id?
				...state.filter((p) => p.id !== action.value.id),
				action.value,
			];
	}
	return state;
};

const items = (state = [], action) => {
	switch (action.type) {
		case 'SET_INTEGRATION_ITEMS':
			return action.value;
		case 'ADD_INTEGRATION_ITEM':
			return [
				// maybe filter out an integration with the same id?
				...state.filter((p) => p.id !== action.value.id),
				action.value,
			];
	}
	return state;
};

export default combineReducers({
	integrations,
	providers,
	items,
});
