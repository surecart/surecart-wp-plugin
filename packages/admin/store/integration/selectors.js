/**
 * List of integrations
 */
export const selectIntegrations = (state, id, model = '') => {
	return state.integrations;
};

export const selectIntegration = (state, id) => {
	return state.integrations.find((p) => p.id === id);
};

export const selectIntegrationProviderItem = (state, provider, id) => {
	return state.items.find((p) => p.id === id);
};

export const selectIntegrationItem = (state, id) => {
	return state.items.find((p) => p.id === id);
};

export const selectIntegrationProviders = (state) => {
	return state.providers;
};

export const selectIntegrationProvider = (state, provider) => {
	return state.providers.find((p) => p.slug === provider);
};
