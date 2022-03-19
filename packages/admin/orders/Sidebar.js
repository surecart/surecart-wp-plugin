import { Fragment } from '@wordpress/element';
import Customer from './modules/Customer';
import MetaData from './modules/MetaData';
import Purchases from './modules/Purchases';

export default ({ order, customer, loading }) => {
	return (
		<Fragment>
			<Customer customer={customer} isLoading={loading} />
			<Purchases />
			<MetaData order={order} loading={loading} />
		</Fragment>
	);
};
