/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import { BaseControl, DateTimePicker } from '@wordpress/components';
import { css, jsx } from '@emotion/core';

export default ({ subscription, updateSubscription, isLoading }) => {
	return (
		<Box title={__('Schedule', 'checkout_engine')} loading={isLoading}>
			<div
				className="redeem-by-date"
				css={css`
					max-width: 288px;
					margin-top: 30px;
				`}
			>
				<BaseControl.VisualLabel>
					{__('Trial Ends At', 'checkout_engine')}
				</BaseControl.VisualLabel>
				<DateTimePicker
					currentDate={
						new Date(
							subscription?.trial_end_at * 1000 || Date.now()
						)
					}
					onChange={(trial_end_at) => {
						updateSubscription({
							trial_end_at: Date.parse(trial_end_at) / 1000,
						});
					}}
				/>
			</div>
		</Box>
	);
};
