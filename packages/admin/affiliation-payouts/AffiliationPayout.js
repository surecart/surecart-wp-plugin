/**
 * Wordpress dependencies.
 */
import { getQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import CreateAffiliationPayout from './CreateAffiliationPayout';
import ExportAffiliationPayout from './ExportAffiliationPayout';

export default () => {
	const { action } = getQueryArgs(window.location.href);

	if (action === 'export') {
		return <ExportAffiliationPayout />;
	}

	return <CreateAffiliationPayout />;
};
