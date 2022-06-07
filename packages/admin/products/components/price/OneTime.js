import { __ } from '@wordpress/i18n';
import AdHoc from './parts/AdHoc';
import Amount from './parts/Amount';

export default ({ price, updatePrice }) => {
	return (
		<>
			<Amount price={price} updatePrice={updatePrice} />
			<AdHoc price={price} updatePrice={updatePrice} />
		</>
	);
};
