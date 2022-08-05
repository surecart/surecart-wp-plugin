import DatePicker from '../../../components/DatePicker';
import Box from '../../../ui/Box';
import { ScButton, ScFlex, ScFormControl } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ subscription, updateSubscription, loading }) => {
	return (
		<Box title={__('Trial', 'surecart')} loading={loading}>
			<ScFormControl
				label={
					subscription?.trial_end_at
						? __('Free Trial Ends', 'surecart')
						: __('Free Trial', 'surecart')
				}
			>
				<ScFlex
					className="trial-ends"
					alignItems="center"
					justifyContent="flex-start"
				>
					<DatePicker
						placeholder={__('Add Free Trial', 'surecart')}
						popoverTitle={__('Choose a trial end date', 'surecart')}
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
					{!!subscription?.trial_end_at && (
						<ScButton
							type="default"
							onClick={() =>
								updateSubscription({ trial_end_at: null })
							}
						>
							{__('Remove Trial', 'surecart')}
						</ScButton>
					)}
				</ScFlex>
			</ScFormControl>
		</Box>
	);
};
