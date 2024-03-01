/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScFlex,
	ScIcon,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import Error from '../components/Error';
import useDirty from '../hooks/useDirty';
import useEntity from '../hooks/useEntity';
import Logo from '../templates/Logo';
import SaveButton from '../templates/SaveButton';
import UpdateModel from '../templates/UpdateModel';
import Details from './modules/Details';
import ActionsDropdown from './components/ActionsDropdown';
import User from './modules/User';

export default () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { saveDirtyRecords } = useDirty();
	const id = useSelect((select) => select(dataStore).selectPageId());
	const {
		item: affiliationRequest,
		editItem: editAffiliationRequest,
		deleteItem: deleteAffiliationRequest,
		hasLoadedItem: hasLoadedAffiliationRequest,
		deletingItem: deletingAffiliationRequest,
		savingItem: savingAffiliationRequest,
	} = useEntity('affiliation-request', id);

	/**
	 * Handle the form submission
	 */
	const onSubmit = async () => {
		try {
			await saveDirtyRecords();
			// save success.
			createSuccessNotice(__('Affiliate request updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart')
			);
			if (e?.additional_errors?.length) {
				e?.additional_errors.forEach((e) => {
					if (e?.message) {
						createErrorNotice(e?.message);
					}
				});
			}
		}
	};

	/**
	 * Delete the affiliation request.
	 */
	const onAffiliationRequestDelete = async () => {
		const r = confirm(
			sprintf(
				__(
					'Permanently delete %s? You cannot undo this action.',
					'surecart'
				),
				affiliationRequest?.name ||
					affiliationRequest?.email ||
					__('this affiliate request', 'surecart')
			)
		);
		if (!r) return;

		try {
			setError(null);
			await deleteAffiliationRequest({ throwOnError: true });
			window.location.assign('admin.php?page=sc-affiliate-requests');
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	/**
	 * Approve the affiliation request.
	 */
	const onAffiliationRequestApprove = async () => {
		try {
			setLoading(true);
			setError(null);
			await apiFetch({
				path: `/surecart/v1/affiliation_requests/${id}/approve`,
				method: 'PATCH',
			});

			createSuccessNotice(__('Affiliate request approved.', 'surecart'), {
				type: 'snackbar',
			});

			receiveEntityRecords(
				'surecart',
				'affiliation-request',
				{
					...affiliationRequest,
					status: 'approved',
				},
				undefined,
				false,
				{
					status: 'approved',
				}
			);
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Deny the affiliation request.
	 */
	const onAffiliationRequestDeny = async () => {
		try {
			setLoading(true);
			setError(null);
			await apiFetch({
				path: `/surecart/v1/affiliation_requests/${id}/deny`,
				method: 'PATCH',
			});

			createSuccessNotice(__('Affiliate request denied.', 'surecart'), {
				type: 'snackbar',
			});

			receiveEntityRecords(
				'surecart',
				'affiliation-request',
				{
					...affiliationRequest,
					status: 'denied',
				},
				undefined,
				false,
				{
					status: 'denied',
				}
			);
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<UpdateModel
			onSubmit={onSubmit}
			title={
				<ScFlex style={{ gap: '1em' }} align-items="center">
					<ScButton
						circle
						size="small"
						href="admin.php?page=sc-affiliate-requests"
					>
						<ScIcon name="arrow-left"></ScIcon>
					</ScButton>
					<ScBreadcrumbs>
						<ScBreadcrumb>
							<Logo display="block" />
						</ScBreadcrumb>
						<ScBreadcrumb href="admin.php?page=sc-affiliate-requests">
							{__('Affiliate Requests', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb>
							<ScFlex style={{ gap: '1em' }}>
								{__('Edit Affiliate Request', 'surecart')}
							</ScFlex>
						</ScBreadcrumb>
					</ScBreadcrumbs>
				</ScFlex>
			}
			button={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<ActionsDropdown
						affiliationRequest={affiliationRequest}
						onDelete={onAffiliationRequestDelete}
						onApprove={onAffiliationRequestApprove}
						onDeny={onAffiliationRequestDeny}
						loading={loading}
					/>
					<SaveButton
						loading={!hasLoadedAffiliationRequest}
						busy={
							deletingAffiliationRequest ||
							savingAffiliationRequest ||
							loading
						}
					>
						{__('Save Affiliatiate Request', 'surecart')}
					</SaveButton>
				</div>
			}
			sidebar={
				<User
					affiliationRequestId={id}
					affiliationRequest={affiliationRequest}
					loading={!hasLoadedAffiliationRequest}
				/>
			}
		>
			<Error error={error} setError={setError} margin="80px" />
			<Details
				affiliationRequest={affiliationRequest}
				updateAffiliationRequest={editAffiliationRequest}
				loading={!hasLoadedAffiliationRequest}
			/>
		</UpdateModel>
	);
};
