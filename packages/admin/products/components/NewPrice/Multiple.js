import { __ } from '@wordpress/i18n';
import { ScInput } from '@surecart/components-react';
import RecurringIntervals from './RecurringIntervals';

export default ({ price, updatePrice }) => {
	return (
		<>
			<RecurringIntervals price={price} updatePrice={updatePrice} />
			<ScInput
				label={__('Number of Payments', 'surecart')}
				className="sc-payment-number"
				required
				type="number"
				min={1}
				value={price?.recurring_period_count}
				onScChange={(e) =>
					updatePrice({
						recurring_period_count: parseInt(e.target.value),
					})
				}
			>
				<span slot="suffix">{__('Payments', 'surecart')}</span>
			</ScInput>
		</>
	);
};
