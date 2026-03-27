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
import { ScButton, ScForm } from '@surecart/components-react';
import Error from '../components/Error';
import CreateTemplate from '../templates/CreateModel';
import Details from './modules/Details';

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

			<ScForm onScSubmit={onSubmit}>
				<Details
					affiliationRequest={request}
					onUpdate={updateRequest}
					title={__('Create New Affiliate Request', 'surecart')}
					footer={
						<div
							css={css`display: flex gap: var(--sc-spacing-small);`}
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
					}
				/>
			</ScForm>
		</CreateTemplate>
	);
};
