/** @jsx jsx */
import { __, sprintf } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { formatTime } from '../../util/time';
import { ScSkeleton, ScTag } from '@surecart/components-react';

export default ({ abandoned, checkout, loading }) => {
	const renderNotificationStatus = () => {
		if (abandoned?.notification_status === 'sent') {
			return <ScTag type="success">{__('Sent', 'surecart')}</ScTag>;
		}
		if (abandoned?.notification_status === 'scheduled') {
			return <ScTag type="info">{__('Scheduled', 'surecart')}</ScTag>;
		}
		if (abandoned?.notification_status === 'not_scheduled') {
			return (
				<ScTag type="warning">{__('Not Scheduled', 'surecart')}</ScTag>
			);
		}
		return <ScTag>{abandoned?.notification_status}</ScTag>;
	};

	if (loading) {
		return (
			<div
				css={css`
					display: flex;
					flex-direction: column;
					gap: 1.5em;
					margin-bottom: 2em;
				`}
			>
				<ScSkeleton style={{ width: '45%' }}></ScSkeleton>
				<ScSkeleton style={{ width: '65%' }}></ScSkeleton>
			</div>
		);
	}

	if (!abandoned?.id) {
		return null;
	}

	return (
		<div
			css={css`
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: 2em;
				margin-bottom: 2em;
			`}
		>
			<div>
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<h1>#{abandoned?.id}</h1>
					{!checkout?.live_mode && (
						<ScTag type="warning">
							{__('Test Mode', 'surecart')}
						</ScTag>
					)}
				</div>
				{sprintf(
					__('Created on %s', 'surecart'),
					formatTime(abandoned.updated_at)
				)}
			</div>
			<div>{renderNotificationStatus()}</div>
		</div>
	);
};
