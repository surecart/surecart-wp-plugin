/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScForm,
	ScInput,
	ScTextarea,
} from '@surecart/components-react';
import Box from '../ui/Box';
import Error from '../components/Error';
import CreateTemplate from '../templates/CreateModel';

export default ({ id, setId }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [payoutEmail, setPayoutEmail] = useState('');
	const [bio, setBio] = useState('');
	const [error, setError] = useState(null);
	const { saveEntityRecord } = useDispatch(coreStore);

	// Create the affiliation request.
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsSaving(true);
			const affiliationRequest = await saveEntityRecord(
				'surecart',
				'affiliation-request',
				{
					first_name: firstName,
					last_name: lastName,
					email,
					payout_email: payoutEmail,
					bio,
				},
				{ throwOnError: true }
			);
			setId(affiliationRequest.id);
		} catch (e) {
			console.error(e);
			setError(e);
			setIsSaving(false);
		}
	};

	return (
		<CreateTemplate id={id}>
			<Error error={error} />

			<Box title={__('Create New Affiliate Request', 'surecart')}>
				<ScForm onScSubmit={onSubmit}>
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-large);
							grid-template-columns: 1fr 1fr;
						`}
					>
						<ScInput
							label={__('First Name', 'surecart')}
							className="sc-affiliation-request-first-name"
							help={__(
								"Affiliate request's first name.",
								'surecart'
							)}
							onScChange={(e) => {
								setFirstName(e.target.value);
							}}
							value={firstName}
							name="first_name"
							required
							autofocus
						/>
						<ScInput
							label={__('Last Name', 'surecart')}
							className="sc-affiliate-request-last-name"
							help={__(
								"Affiliate request's last name.",
								'surecart'
							)}
							onScChange={(e) => {
								setLastName(e.target.value);
							}}
							value={lastName}
							name="last_name"
						/>
						<ScInput
							label={__('Email', 'surecart')}
							className="sc-affiliate-request-email"
							help={__("Affiliate request's email.", 'surecart')}
							onScChange={(e) => {
								setEmail(e.target.value);
							}}
							value={email}
							name="email"
							type="email"
							required
						/>
						<ScInput
							label={__('Payout Email', 'surecart')}
							className="sc-affiliate-request-payout-email"
							help={__(
								"Affiliate request's payout email.",
								'surecart'
							)}
							onScChange={(e) => {
								setPayoutEmail(e.target.value);
							}}
							required
							value={payoutEmail}
							name="payout_email"
							type="email"
						/>

						<ScTextarea
							label={__('Bio', 'surecart')}
							className="sc-affiliate-request-bio"
							help={__(
								'Short blurb from this affiliate describing how they will promote this store.',
								'surecart'
							)}
							onScChange={(e) => {
								setBio(e.target.value);
							}}
							value={bio}
							name="bio"
							required
							css={css`
								grid-column: 1 / 3;
							`}
						/>

						<div
							css={css`display: flex gap: var(--sc-spacing-small); justify-content: flex-end; grid-column: 1 / 3;`}
						>
							<ScButton type="primary" submit loading={isSaving}>
								{__('Create', 'surecart')}
							</ScButton>
							<ScButton
								href="admin.php?page=sc-affiliate-requests"
								type="text"
							>
								{__('Cancel', 'surecart')}
							</ScButton>
						</div>
					</div>
				</ScForm>
			</Box>
		</CreateTemplate>
	);
};
