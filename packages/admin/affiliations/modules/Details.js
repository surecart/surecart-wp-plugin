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
import { ScAvatar, ScTag, ScInput, ScTextarea } from '@surecart/components-react';
import useAvatar from '../../hooks/useAvatar';
import SaveButton from '../../templates/SaveButton';

export default ({ affiliation, onUpdate, loading, saving }) => {
	const {
		status_type,
		status_display_text,
		display_name,
		first_name,
		last_name,
		email,
		code,
		payout_email,
		bio,
		url,
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
			footer={
				onUpdate && (
					<SaveButton busy={loading || saving}>
						{__('Save', 'surecart')}
					</SaveButton>
				)
			}
		>
			<Fragment>
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
						gap: 2em;
						margin-bottom: 1em;
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

				{onUpdate ? (
					<div
						css={css`
							display: grid;
							gap: var(--sc-form-row-spacing);
							grid-template-columns: 1fr 1fr;
						`}
					>
						<ScInput
							label={__('First Name', 'surecart')}
							value={first_name}
							required
							onScInput={(e) =>
								onUpdate({
									first_name: e.target.value,
								})
							}
						/>

						<ScInput
							label={__('Last Name', 'surecart')}
							value={last_name}
							onScInput={(e) =>
								onUpdate({
									last_name: e.target.value,
								})
							}
						/>

						<ScInput
							label={__('Email', 'surecart')}
							value={email}
							type="email"
							required
							onScInput={(e) =>
								onUpdate({
									email: e.target.value,
								})
							}
						/>

						<ScInput
							label={__('Payout Email', 'surecart')}
							value={payout_email}
							type="email"
							required
							onScInput={(e) =>
								onUpdate({
									payout_email: e.target.value,
								})
							}
						/>

						<ScInput
							value={url}
							label={__('Website', 'surecart')}
							onScInput={(e) =>
								onUpdate({
									url: e.target.value,
								})
							}
							type="url"
						/>

						<div
							css={css`
								grid-column: 1 / 3;
							`}
						>
							<ScTextarea
								label={__('Bio', 'surecart')}
								onScInput={(e) =>
									onUpdate({
										bio: e.target.value,
									})
								}
								value={bio}
							/>
						</div>
					</div>
				) : (
					<Fragment>
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
					</Fragment>
				)}

				<hr />

				<Definition title={__('Referral Code', 'surecart')}>
					<sc-prose>
						<code>{code}</code>
					</sc-prose>
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
