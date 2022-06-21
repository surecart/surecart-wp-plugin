import * as actions from './actions';
import { apiFetch } from '@wordpress/data-controls';
import { addQueryArgs } from '@wordpress/url';

/**
 * Select integrations for a specific model.
 */
export function* selectIntegrations(id) {
	try {
		const integrations = yield apiFetch({
			path: addQueryArgs('surecart/v1/integrations', {
				model_ids: [id],
			}),
		});
		console.log('resolver running');
		return actions.setIntegrations(integrations);
	} catch (error) {
		console.error(error);
		return { type: 'ERROR', message: error.message };
	}
}
