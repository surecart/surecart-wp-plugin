/** @jsx jsx */
import Box from '../../ui/Box';
import { css, jsx } from '@emotion/core';
import { ScFlex, ScFormatDate, ScTag } from '@surecart/components-react';
import { sprintf, _n, __ } from '@wordpress/i18n';
import dayjs from 'dayjs';

export default ({ abandoned: { notifications_scheduled_at }, loading }) => {
	return (
		<Box title={__('Schedule', 'surecart')} loading={loading}>
			<div
				css={css`
					display: grid;
					gap: 0.5em;
				`}
			>
				{(notifications_scheduled_at || []).map((time, index) => {
					const isBefore = dayjs(time * 1000).isBefore(dayjs());
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
							<ScFormatDate
								type="timestamp"
								date={time}
								month="short"
								day="numeric"
								year="numeric"
								hour="numeric"
								minute="numeric"
							/>
						</ScFlex>
					);
				})}
			</div>
		</Box>
	);
};
