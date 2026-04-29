import { addQueryArgs } from '@wordpress/url';

import { useNavigationConfirm } from './NavigationConfirmProvider';

export const useLink = (params) => {
	const { requestNavigation } = useNavigationConfirm();

	const href = addQueryArgs(window.location.pathname, params);

	const onClick = (event) => {
		event.preventDefault();
		requestNavigation(params);
	};

	return { href, onClick };
};
