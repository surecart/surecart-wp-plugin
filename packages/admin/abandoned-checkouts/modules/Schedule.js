/** @jsx jsx */
import Box from '../../ui/Box';
import { css, jsx } from '@emotion/core';
import { ScFlex, ScTag } from '@surecart/components-react';
import { sprintf, _n, __ } from '@wordpress/i18n';
import dayjs from 'dayjs';

export default ({
	abandoned: { notifications_scheduled_at_date_time, recovered_checkout },
	loading,
}) => {
	return (
		!!recovered_checkout?.id && (
			<Box title={__('Schedule', 'surecart')} loading={loading}>
				<div
					css={css`
						display: grid;
						gap: 0.5em;
					`}
				>
					{(notifications_scheduled_at_date_time || []).map(
						(time, index) => {
							const isBefore = dayjs(time).isBefore(dayjs());
							return (
								<ScFlex
									alignItems="center"
									justifyContent="space-between"
								>
									{isBefore ? (
										<ScTag>
											{sprintf(
												__('Email #%d', 'surecart'),
												index + 1
											)}
										</ScTag>
									) : (
										<ScTag type="warning">
											{__('Upcoming', 'surecart')}
										</ScTag>
									)}
									{time}
								</ScFlex>
							);
						}
					)}
				</div>
			</Box>
		)
	);
};
