/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import Definition from '../../ui/Definition';
import { ScAvatar, ScButton, ScIcon, ScTag } from '@surecart/components-react';
import useAvatar from '../../hooks/useAvatar';
import EditAffiliate from './EditAffiliate';

export default ({ affiliation, loading }) => {
	const [modal, setModal] = useState(false);
	const {
		status_type,
		status_display_text,
		display_name,
		email,
		code,
		payout_email,
		url,
		bio,
		created_at_date_time,
		updated_at_date_time,
	} = affiliation;

	const avatarUrl = useAvatar({ email: affiliation?.email });

	return (
		<>
			<Box
				title={
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
						`}
					>
						{__('Profile', 'surecart')}
						<ScTag type={status_type}>{status_display_text}</ScTag>
					</div>
				}
				loading={loading}
				header_action={
					<ScButton
						css={css`
							margin: -10px;
						`}
						type="text"
						aria-label={__('Edit Affiliate', 'surecart')}
						title={__('Edit Affiliate', 'surecart')}
						onClick={() => setModal(true)}
					>
						<ScIcon name="edit-2" slot="prefix" />
					</ScButton>
				}
			>
				<Fragment>
					<div
						css={css`
							display: flex;
							align-items: center;
							justify-content: space-between;
							gap: 2em;
							min-width: 0;
						`}
					>
						<div
							css={css`
								display: flex;
								align-items: center;
								justify-content: flex-start;
								gap: 1em;
								flex: 1;
								min-width: 0;
							`}
						>
							<ScAvatar
								image={avatarUrl}
								initials={(display_name || '').charAt(0)}
							/>
							<div
								css={css`
									min-width: 0;
									overflow-wrap: break-word;
								`}
							>
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

					{url && (
						<Definition title={__('Website', 'surecart')}>
							{url}
						</Definition>
					)}

					{bio && (
						<Definition title={__('Bio', 'surecart')}>
							{bio}
						</Definition>
					)}

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

			<EditAffiliate
				affiliation={affiliation}
				open={!!modal}
				onRequestClose={() => setModal(false)}
			/>
		</>
	);
};
