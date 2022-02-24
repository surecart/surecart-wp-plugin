import { Fragment } from '@wordpress/element';
import Customer from './modules/Customer';
import Purchases from './modules/Purchases';

export default ({ customer, loading }) => {
	return (
		<Fragment>
			<Customer customer={customer} isLoading={loading} />
			<Purchases />
		</Fragment>
	);
};
