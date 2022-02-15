import { useSelect } from '@wordpress/data';
import { store } from '../store/data';
import useEntity from './useEntity';

export default (name = '', args, deps) => {
	const pageId = useSelect((select) => select(store).selectPageId());
	const [model] = useSelect((select) => select(store).selectCollection(name));
	const id = model?.id || pageId || 0;
	return {
		id,
		...useEntity(name, id, 0),
	};
};
