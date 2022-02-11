import { useSelect } from '@wordpress/data';
import { store } from '../store/data';
import useEntity from './useEntity';

export default (name = '', args, deps) => {
	const id = useSelect((select) => select(store).selectPageId());
	return {
		id,
		...useEntity(name, id, args, deps !== null ? [id, deps] : null),
	};
};
