/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useState, useReducer } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScForm,
	ScFormRow,
	ScInput,
	ScTextarea,
} from '@surecart/components-react';
import Box from '../ui/Box';
import Error from '../components/Error';
import CreateTemplate from '../templates/CreateModel';

export default ({ id, setId }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [request, updateRequest] = useReducer(
		(currentState, newState) => {
			return { ...currentState, ...newState };
		},
		{
			first_name: '',
			last_name: '',
			email: '',
			payout_email: '',
			bio: '',
		}
	);
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
				request,
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
						`}
					>
						<ScFormRow>
							<ScInput
								label={__('First Name', 'surecart')}
								className="sc-affiliation-request-first-name"
								help={__(
									"Affiliate request's first name.",
									'surecart'
								)}
								onScChange={(e) => updateRequest({ first_name: e.target.value })}
								value={request.first_name}
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
								onScChange={(e) => updateRequest({ last_name: e.target.value })}
								value={request.last_name}
								name="last_name"
							/>
						</ScFormRow>
						<ScFormRow>
							<ScInput
								label={__('Email', 'surecart')}
								className="sc-affiliate-request-email"
								help={__(
									"Affiliate request's email.",
									'surecart'
								)}
								onScChange={(e) => updateRequest({ email: e.target.value })}
								value={request.email}
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
								onScChange={(e) => updateRequest({ payout_email: e.target.value })}
								required
								value={request.payout_email}
								name="payout_email"
								type="email"
							/>
						</ScFormRow>
						<ScFormRow>
							<ScTextarea
								label={__('Bio', 'surecart')}
								className="sc-affiliate-request-bio"
								help={__(
									'Short blurb from this affiliate describing how they will promote this store.',
									'surecart'
								)}
								onScChange={(e) => updateRequest({ bio: e.target.value })}
								value={request.bio}
								name="bio"
								required
							/>
						</ScFormRow>

						<div
							css={css`display: flex gap: var(--sc-spacing-small);`}
						>
							<ScButton type="primary" submit loading={isSaving}>
								{__('Create', 'surecart')}
							</ScButton>
							<ScButton
								href={'admin.php?page=sc-affiliate-requests'}
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
