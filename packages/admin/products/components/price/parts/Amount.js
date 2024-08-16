import { __ } from '@wordpress/i18n';
import RecurringAmount from './RecurringAmount';
import SingleAmount from './SingleAmount';

export default ({ className, price, updatePrice }) => {
	// add a recurring.
	if (price?.recurring_interval) {
		return (
			<RecurringAmount
				className={className}
				price={price}
				updatePrice={updatePrice}
				locked={!!price?.id} // it's saved, so it should be locked.
			/>
		);
	}

	// add a single.
	return (
		<SingleAmount
			className={className}
			price={price}
			updatePrice={updatePrice}
		/>
	);
};
