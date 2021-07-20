import * as actions from './actions';

export default {
	*getSettings() {
		console.log( 'called' );
		const settings = yield actions.fetchFromAPI( 'settings' );
		return actions.setSettings( settings );
	},
};
