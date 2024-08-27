import DateTimePicker from '../../../components/DateTimePicker';
import Box from '../../../ui/Box';
import { ScFlex, ScFormControl } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ subscription, updateSubscription, loading }) => {
	return (
		<Box title={__('Trial', 'surecart')} loading={loading}>
			<ScFormControl
				showLabel={subscription?.trial_end_at}
				label={
					subscription?.trial_end_at
						? __('Trial Ends', 'surecart')
						: __('Trial', 'surecart')
				}
			>
				<ScFlex
					className="trial-ends"
					alignItems="center"
					justifyContent="flex-start"
				>
					<DateTimePicker
						placeholder={__('Add Trial', 'surecart')}
						title={__('Choose a trial end date', 'surecart')}
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
						onClear={() =>
							updateSubscription({ trial_end_at: null })
						}
						clearDateLabel={__('Remove', 'surecart')}
					/>
				</ScFlex>
			</ScFormControl>
		</Box>
	);
};
