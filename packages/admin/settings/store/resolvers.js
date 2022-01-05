import * as actions from './actions';

export default {
	*getSetting( name = '' ) {
		const settings = yield actions.fetchFromAPI( `settings/${ name }` );
		return actions.updateSetting( settings, name );
	},
};
