import { __ } from '@wordpress/i18n';
import RecurringAmount from './RecurringAmount';
import SingleAmount from './SingleAmount';

export default ({ className, price, updatePrice }) => {
	// it's saved, so it should be locked.
	if (price?.id) {
		return (
			<RecurringAmount
				className={className}
				price={price}
				updatePrice={updatePrice}
				locked
			/>
		);
	}

	// add a recurring.
	if (price?.recurring_interval) {
		return (
			<RecurringAmount
				className={className}
				price={price}
				updatePrice={updatePrice}
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
