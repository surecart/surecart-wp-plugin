export function setIntegrations(value) {
	return {
		type: 'SET_INTEGRATIONS',
		value,
	};
}

export function addIntegration(value) {
	return {
		type: 'ADD_INTEGRATION',
		value,
	};
}

export function setIntegrationProviders(value) {
	return {
		type: 'SET_INTEGRATION_PROVIDERS',
		value,
	};
}

export function setIntegrationProvider(value) {
	return {
		type: 'ADD_INTEGRATION_PROVIDER',
		value,
	};
}

export function setIntegrationItems(value) {
	return {
		type: 'SET_INTEGRATION_ITEMS',
		value,
	};
}

export function setIntegration(value) {
	return {
		type: 'ADD_INTEGRATION_ITEM',
		value,
	};
}
