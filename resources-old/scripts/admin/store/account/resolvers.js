import * as actions from './actions';
import { fetch as apiFetch } from '../../store/data/controls';

export default {
	*getAccount() {
		const account = yield apiFetch( { path: 'account' } );
		return actions.setAccount( account );
	},
	*getCurrency() {
		const account = yield apiFetch( { path: 'account' } );
		return actions.setAccount( account );
	},
	*accountCurrencySymbol() {
		const account = yield apiFetch( { path: 'account' } );
		return actions.setAccount( account );
	},
};
