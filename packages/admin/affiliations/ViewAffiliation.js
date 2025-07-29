/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScDropdown,
	ScFlex,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import useSave from '../settings/UseSave';
import Error from '../components/Error';
import Logo from '../templates/Logo';
import UpdateModel from '../templates/UpdateModel';
import Clicks from './modules/Clicks';
import Details from './modules/Details';
import Referrals from './modules/Referrals';
import Payouts from './modules/Payouts';
import Promotions from './modules/Promotions';
import Urls from './modules/Urls';
import Products from './modules/affiliation-products';
import Commission from './modules/Commission';

export default ({ id }) => {
	const { save } = useSave();
	const [loading, setLoading] = useState(false);
	const [modal, setModal] = useState(false);
	const [error, setError] = useState(null);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { editEntityRecord, receiveEntityRecords } = useDispatch(coreStore);

	const { affiliation, hasLoadedAffiliation } = useSelect(
		(select) => {
			const entityData = ['surecart', 'affiliation', id];
			return {
				affiliation: select(coreStore).getEditedEntityRecord(
					...entityData
				),
				hasLoadedAffiliation: select(coreStore).hasFinishedResolution(
					'getEditedEntityRecord',
					entityData
				),
			};
		},
		[id]
	);

	const baseUrl = select(coreStore).getEntityConfig(
		'surecart',
		'affiliation'
	)?.baseURL;

	/**
	 * Handle the form submission
	 */
	const onSubmit = async () => {
		try {
			setLoading(true);
			await save({
				successMessage: __('Affiliate updated.', 'surecart'),
			});
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Activate the affiliation.
	 */
	const onActivate = async () => {
		try {
			setLoading(true);
			setError(null);

			const activated = await apiFetch({
				path: `${baseUrl}/${id}/activate`,
				method: 'PATCH',
			});

			createSuccessNotice(__('Affiliate user activated.', 'surecart'), {
				type: 'snackbar',
			});

			receiveEntityRecords(
				'surecart',
				'affiliation',
				{
					...activated,
					active: true,
				},
				undefined,
				false,
				{
					status: true,
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
	 * Deactivate the affiliation.
	 */
	const onDeactivate = async () => {
		try {
			setLoading(true);
			setError(null);

			const deactivated = await apiFetch({
				path: `${baseUrl}/${id}/deactivate`,
				method: 'PATCH',
			});

			createSuccessNotice(__('Affiliate user deactivated.', 'surecart'), {
				type: 'snackbar',
			});

			receiveEntityRecords(
				'surecart',
				'affiliation',
				{
					...deactivated,
					active: false,
				},
				undefined,
				false,
				{
					active: false,
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
	 * Delete the affiliation.
	 */
	const onDelete = async () => {
		try {
			setLoading(true);
			setError(null);

			await apiFetch({
				path: `${baseUrl}/${id}`,
				method: 'DELETE',
			});

			createSuccessNotice(__('Affiliate deleted successfully.', 'surecart'), {
				type: 'snackbar',
			});

			// Redirect to affiliates list page after successful deletion
			window.location.href = addQueryArgs('admin.php', {
				page: 'sc-affiliates',
			});
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	const updateAffiliation = (data) =>
		editEntityRecord('surecart', 'affiliation', id, data);

	return (
		<UpdateModel
			onSubmit={onSubmit}
			title={
				<ScFlex style={{ gap: '1em' }} align-items="center">
					<ScButton
						circle
						size="small"
						href="admin.php?page=sc-affiliates"
					>
						<ScIcon name="arrow-left"></ScIcon>
					</ScButton>
					<ScBreadcrumbs>
						<ScBreadcrumb>
							<Logo display="block" />
						</ScBreadcrumb>
						<ScBreadcrumb href="admin.php?page=sc-affiliates">
							{__('Affiliates', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb>
							<ScFlex style={{ gap: '1em' }}>
								{__('View Affiliate', 'surecart')}
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
					<ScDropdown
						position="bottom-right"
						style={{ '--panel-width': '14em' }}
					>
						<ScButton
							type="primary"
							slot="trigger"
							caret
							loading={loading}
						>
							{affiliation?.active
								? __('Active', 'surecart')
								: __('Inactive', 'surecart')}
						</ScButton>
						<ScMenu>
							{!affiliation?.active ? (
								<ScMenuItem
									onClick={() => setModal('activate')}
								>
									<ScIcon
										slot="prefix"
										style={{ opacity: 0.65 }}
										name="check-circle"
									/>
									{__('Activate', 'surecart')}
								</ScMenuItem>
							) : (
								<ScMenuItem
									onClick={() => setModal('deactivate')}
								>
									<ScIcon
										slot="prefix"
										style={{ opacity: 0.65 }}
										name="x-circle"
									/>
									{__('Deactivate', 'surecart')}
								</ScMenuItem>
							)}
							<hr style={{ margin: '8px 0' }} />
							<ScMenuItem
								onClick={() => setModal('delete')}
								style={{ color: '#dc3545' }}
							>
								<ScIcon
									slot="prefix"
									style={{ opacity: 0.65, color: '#dc3545' }}
									name="trash"
								/>
								{__('Delete', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
				</div>
			}
			sidebar={
				<>
					<Details
						affiliation={affiliation || {}}
						loading={!hasLoadedAffiliation}
					/>
					<Urls
						referralUrl={affiliation?.referral_url}
						websiteUrl={affiliation?.url}
						loading={!hasLoadedAffiliation}
					/>
					<Commission
						affiliation={affiliation}
						loading={!hasLoadedAffiliation || loading}
					/>
				</>
			}
		>
			<Error error={error} setError={setError} margin="80px" />
			<Referrals affiliationId={affiliation?.id} />
			<Payouts affiliationId={affiliation?.id} />
			<Promotions affiliationId={affiliation?.id} />
			<Clicks affiliationId={affiliation?.id} />
			<Products affiliationId={affiliation?.id} />

			<ConfirmDialog
				isOpen={'activate' === modal}
				onConfirm={() => {
					onActivate();
					setModal(false);
				}}
				onCancel={() => setModal(false)}
			>
				{__(
					'Are you sure you want to activate the affiliate?',
					'surecart'
				)}
			</ConfirmDialog>

			<ConfirmDialog
				isOpen={'deactivate' === modal}
				onConfirm={() => {
					onDeactivate();
					setModal(false);
				}}
				onCancel={() => setModal(false)}
			>
				{__(
					'Are you sure you want to deactivate the affiliate?',
					'surecart'
				)}
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
					'Are you sure you want to delete this affiliate? This action cannot be undone.',
					'surecart'
				)}
			</ConfirmDialog>
		</UpdateModel>
	);
};
