/**
 * Wordpress dependencies.
 */
import { getQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import CreateAffiliationReferral from './CreateAffiliationPayout';
import ExportAffiliationPayout from './ExportAffiliationPayout';

export default () => {
	const { action } = getQueryArgs(window.location.href);

	if (action === 'export') {
		return <ExportAffiliationPayout />;
	}

	return <CreateAffiliationReferral />;
};
