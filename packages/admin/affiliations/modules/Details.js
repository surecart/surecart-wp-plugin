/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import Definition from '../../ui/Definition';
import { ScAvatar, ScTag } from '@surecart/components-react';
import useAvatar from '../../hooks/useAvatar';

export default ({ affiliation, loading }) => {
	const {
		status_type,
		status_display_text,
		display_name,
		email,
		code,
		payout_email,
		created_at_date_time,
		updated_at_date_time,
	} = affiliation;

	const avatarUrl = useAvatar({ email: affiliation?.email });

	return (
		<Box
			title={__('Profile', 'surecart')}
			loading={loading}
			header_action={
				<ScTag type={status_type}>{status_display_text}</ScTag>
			}
		>
			<Fragment>
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
						gap: 2em;
					`}
				>
					<div
						css={css`
							display: flex;
							align-items: center;
							justify-content: flex-start;
							gap: 1em;
							flex: 1;
						`}
					>
						<ScAvatar
							image={avatarUrl}
							initials={(display_name || '').charAt(0)}
						/>
						<div>
							<div>
								<strong>{display_name}</strong>
							</div>
							<div>{email}</div>
						</div>
					</div>
				</div>

				<hr />

				<Definition title={__('Referral Code', 'surecart')}>
					<sc-prose>
						<code>{code}</code>
					</sc-prose>
				</Definition>

				<Definition title={__('Payout Email', 'surecart')}>
					{payout_email}
				</Definition>

				<hr />

				{!!updated_at_date_time && (
					<Definition title={__('Last Updated', 'surecart')}>
						{updated_at_date_time}
					</Definition>
				)}

				{!!created_at_date_time && (
					<Definition title={__('Created', 'surecart')}>
						{created_at_date_time}
					</Definition>
				)}
			</Fragment>
		</Box>
	);
};
