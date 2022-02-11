import { Fragment } from '@wordpress/element';
import Customer from './modules/Customer';
import Summary from './modules/Summary';

export default ({ subscription, loading }) => {
	return (
		<Fragment>
			<Summary subscription={subscription} loading={loading} />
			<Customer subscription={subscription} loading={loading} />
		</Fragment>
	);
};
