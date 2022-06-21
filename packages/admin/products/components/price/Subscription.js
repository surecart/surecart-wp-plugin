import { __ } from '@wordpress/i18n';
import Trial from './parts/Trial';
import Amount from './parts/Amount';
import AdHoc from './parts/AdHoc';

export default ({ price, updatePrice }) => {
	return (
		<>
			<Amount price={price} updatePrice={updatePrice} />
			<AdHoc price={price} updatePrice={updatePrice} />
			<Trial price={price} updatePrice={updatePrice} />
		</>
	);
};
