import useCurrentPage from '../mixins/useCurrentPage';
import Create from './Create';
import Show from './Show';

export default () => {
	const { id } = useCurrentPage('product_group');
	return id ? <Show id={id} /> : <Create />;
};
