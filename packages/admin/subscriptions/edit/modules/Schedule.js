import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import DatePicker from '../../../components/DatePicker';
import { CeFormControl } from '@checkout-engine/components-react';

export default ({ subscription, updateSubscription, loading }) => {
	return (
		<Box title={__('Trial', 'checkout_engine')} loading={loading}>
			<div className="trial-ends">
				<CeFormControl
					label={
						subscription?.trial_end_at
							? __('Free Trial Ends', 'checkout_engine')
							: __('Free Trial', 'checkout_engine')
					}
				>
					<DatePicker
						placeholder={__('Add Free Trial', 'checkout_engine')}
						currentDate={
							subscription?.trial_end_at
								? new Date(subscription?.trial_end_at * 1000)
								: null
						}
						onChoose={(trial_end_at) => {
							updateSubscription({
								trial_end_at: Date.parse(trial_end_at) / 1000,
							});
						}}
					/>
				</CeFormControl>
			</div>
		</Box>
	);
};
