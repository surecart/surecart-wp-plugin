import { useHistory } from '.';
import { addQueryArgs } from '@wordpress/url';

export const useLink = (params) => {
	const history = useHistory();

	const href = addQueryArgs('/', params);

	const onClick = (event) => {
		event.preventDefault();
		history.push(params);
	};

	return { href, onClick };
};
