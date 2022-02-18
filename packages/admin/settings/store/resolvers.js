import * as actions from './actions';

export default {
	*getSettings(name = '') {
		const settings = yield actions.fetchFromAPI(`settings`);
		return actions.updateSetting(settings, name);
	},
	*selectAccount(name = '') {
		const settings = yield actions.fetchFromAPI(`settings`);
		return actions.updateSetting(settings, name);
	},
};
