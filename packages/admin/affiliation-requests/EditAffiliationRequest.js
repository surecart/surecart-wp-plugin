/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { useDispatch, useSelect, select } from '@wordpress/data';
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
	ScButtonGroup,
	ScDropdown,
	ScFlex,
	ScIcon,
	ScMenu,
	ScMenuDivider,
	ScMenuItem,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import useSave from '../settings/UseSave';
import Error from '../components/Error';
import Logo from '../templates/Logo';
import UpdateModel from '../templates/UpdateModel';
import Details from './modules/Details';
import MetaData from './modules/MetaData';

export default () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [modal, setModal] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { save } = useSave();
	const { deleteEntityRecord, editEntityRecord, receiveEntityRecords } =
		useDispatch(coreStore);
	const id = useSelect((select) => select(dataStore).selectPageId());
	const baseUrl = select(coreStore).getEntityConfig(
		'surecart',
		'affiliation-request'
	)?.baseURL;

	const {
		affiliationRequest,
		isSaving,
		loadError,
		isDeleting,
		hasLoadedAffiliationRequest,
	} = useSelect(
		(select) => {
			const entityData = ['surecart', 'affiliation-request', id];

			return {
				affiliationRequest: select(coreStore).getEditedEntityRecord(
					...entityData
				),
				isSaving: select(coreStore)?.isSavingEntityRecord?.(
					...entityData
				),
				loadError: select(coreStore)?.getResolutionError?.(
					'getEditedEntityRecord',
					...entityData
				),
				isDeleting: select(coreStore)?.isDeletingEntityRecord?.(
					...entityData
				),
				hasLoadedAffiliationRequest: select(
					coreStore
				)?.hasFinishedResolution?.('getEntityRecord', [...entityData]),
			};
		},
		[id]
	);

	const updateRequest = (data) =>
		editEntityRecord('surecart', 'affiliation-request', id, data);

	/**
	 * Update the affiliation request.
	 */
	const onSubmit = async () => {
		try {
			await save({
				successMessage: __('Affiliate request updated.', 'surecart'),
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	/**
	 * Delete the affiliation request.
	 */
	const onDelete = async () => {
		try {
			setError(null);
			await deleteEntityRecord(
				'surecart',
				'affiliation-request',
				id,
				undefined,
				{
					throwOnError: true,
				}
			);
			window.location.assign('admin.php?page=sc-affiliate-requests');
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	/**
	 * Approve the affiliation request.
	 */
	const onApprove = async () => {
		try {
			setLoading(true);
			setError(null);

			const approvedRequest = await apiFetch({
				path: `${baseUrl}/${id}/approve`,
				method: 'PATCH',
			});

			createSuccessNotice(__('Affiliate request approved.', 'surecart'), {
				type: 'snackbar',
			});

			receiveEntityRecords(
				'surecart',
				'affiliation-request',
				{
					...approvedRequest,
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
	const onDeny = async () => {
		try {
			setLoading(true);
			setError(null);

			const deniedRequest = await apiFetch({
				path: `${baseUrl}/${id}/deny`,
				method: 'PATCH',
			});

			createSuccessNotice(__('Affiliate request rejected.', 'surecart'), {
				type: 'snackbar',
			});

			receiveEntityRecords(
				'surecart',
				'affiliation-request',
				{
					...deniedRequest,
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
								{__('Affiliate Request', 'surecart')}
							</ScFlex>
						</ScBreadcrumb>
					</ScBreadcrumbs>
				</ScFlex>
			}
			sidebar={
				affiliationRequest?.metadata &&
				Object.keys(affiliationRequest?.metadata).length && (
					<MetaData
						affiliationRequest={affiliationRequest}
						loading={!hasLoadedAffiliationRequest}
					/>
				)
			}
			button={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<ScDropdown slot="suffix" placement="bottom-end">
						<ScButton
							type="primary"
							slot="trigger"
							caret
							loading={loading}
						>
							{__('Actions', 'surecart')}
						</ScButton>
						<ScMenu>
							{['pending', 'denied'].includes(
								affiliationRequest?.status
							) && (
								<ScMenuItem onClick={() => setModal('approve')}>
									<ScIcon
										slot="prefix"
										style={{ opacity: 0.5 }}
										name="thumbs-up"
									/>
									{__('Approve', 'surecart')}
								</ScMenuItem>
							)}
							{['pending', 'approved'].includes(
								affiliationRequest?.status
							) && (
								<ScMenuItem onClick={() => setModal('deny')}>
									<ScIcon
										slot="prefix"
										style={{ opacity: 0.5 }}
										name="thumbs-down"
									/>
									{__('Deny', 'surecart')}
								</ScMenuItem>
							)}
							<ScMenuDivider />
							<ScMenuItem onClick={() => setModal('delete')}>
								<ScIcon
									slot="prefix"
									style={{ opacity: 0.5 }}
									name="trash"
								/>
								{__('Delete', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
				</div>
			}
		>
			<Error
				error={error || loadError}
				setError={setError}
				margin="80px"
			/>
			<Details
				affiliationRequest={affiliationRequest || {}}
				onUpdate={updateRequest}
				loading={!hasLoadedAffiliationRequest}
				saving={isSaving}
				deleting={isDeleting}
			/>
			<ConfirmDialog
				isOpen={'approve' === modal}
				onConfirm={() => {
					onApprove();
					setModal(false);
				}}
				onCancel={() => setModal(false)}
			>
				{__('Are you sure to approve affiliate request?', 'surecart')}
			</ConfirmDialog>

			<ConfirmDialog
				isOpen={'deny' === modal}
				onConfirm={() => {
					onDeny();
					setModal(false);
				}}
				onCancel={() => setModal(false)}
			>
				{__('Are you sure to deny this affiliate request?', 'surecart')}
			</ConfirmDialog>

			<ConfirmDialog
				isOpen={'delete' === modal}
				onConfirm={() => {
					onDelete();
					setModal(false);
				}}
				onCancel={() => setModal(false)}
			>
				{__(
					'Permanently delete this affiliate request? You cannot undo this action.',
					'surecart'
				)}
			</ConfirmDialog>
		</UpdateModel>
	);
};
