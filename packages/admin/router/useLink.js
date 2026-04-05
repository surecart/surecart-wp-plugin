import { addQueryArgs } from '@wordpress/url';
import { useNavigationGuard } from './NavigationGuard';

export const useLink = (params) => {
	const { navigate } = useNavigationGuard();

	const href = addQueryArgs(window.location.pathname, params);

	const onClick = (event) => {
		event.preventDefault();
		navigate(params);
	};

	return { href, onClick };
};
