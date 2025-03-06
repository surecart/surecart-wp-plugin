import { __ } from '@wordpress/i18n';
import { useLocation } from '../../router';
import IntegrationsList from './IntegrationsList';
import Integration from './Integration';

export default () => {
	const location = useLocation();

	return location?.params?.id ? (
		<Integration id={location.params.id} />
	) : (
		<IntegrationsList />
	);
};
