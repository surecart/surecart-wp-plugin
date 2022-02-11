import { Fragment } from '@wordpress/element';
import useCurrentPage from '../../mixins/useCurrentPage';
import Purchases from './modules/Purchases';

export default ({ loading }) => {
	return (
		<Fragment>
			<Purchases loading={loading} />
		</Fragment>
	);
};
