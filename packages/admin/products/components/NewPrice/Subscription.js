import { __ } from '@wordpress/i18n';
import { ScInput } from '@surecart/components-react';
import RecurringIntervals from './RecurringIntervals';

export default ({ price, updatePrice }) => {
	return (
		<>
			<RecurringIntervals price={price} updatePrice={updatePrice} />
			<ScInput
				label={__('Free Trial Days', 'surecart')}
				className="sc-free-trial"
				help={__(
					'If you want to add a free trial, enter the number of days.',
					'surecart'
				)}
				type="number"
				min={1}
				max={365}
				value={price?.trial_duration_days}
				onScChange={(e) =>
					updatePrice({
						trial_duration_days: parseInt(e.target.value),
					})
				}
			>
				<span slot="suffix">{__('Days', 'surecart')}</span>
			</ScInput>
		</>
	);
};
