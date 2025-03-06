import { useHistory } from '.';
import { addQueryArgs } from '@wordpress/url';

export const useLink = (params) => {
	const history = useHistory();

	const href = addQueryArgs(window.location.pathname, params);

	const onClick = (event) => {
		event.preventDefault();
		history.push(params);
		window.scrollTo(0, 0);
	};

	return { href, onClick };
};
