import { Fragment } from '@wordpress/element';
import Customer from './modules/Customer';
import Purchases from './modules/Purchases';

export default () => {
	return (
		<Fragment>
			<Customer />
			<Purchases />
		</Fragment>
	);
};
