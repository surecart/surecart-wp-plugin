/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
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
	ScDropdown,
	ScFlex,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import Error from '../components/Error';
import useDirty from '../hooks/useDirty';
import Logo from '../templates/Logo';
import UpdateModel from '../templates/UpdateModel';
import Clicks from './modules/Clicks';
import Details from './modules/Details';
import Referrals from './modules/Referrals';
import Payouts from './modules/Payouts';
import Promotions from './modules/Promotions';

export default ({ id }) => {
	const [loading, setLoading] = useState(false);
	const [modal, setModal] = useState(false);
	const [error, setError] = useState(null);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { saveDirtyRecords } = useDirty();

	const { affiliation, hasLoadedAffiliation } = useSelect(
		(select) => {
			const entityData = ['surecart', 'affiliation', id];
			return {
				affiliation: select(coreStore).getEntityRecord(...entityData),
				hasLoadedAffiliation: select(
					coreStore
				)?.hasFinishedResolution?.('getEntityRecord', [...entityData]),
			};
		},
		[id]
	);

	/**
	 * Handle the form submission
	 */
	const onSubmit = async () => {
		try {
			await saveDirtyRecords();
			// save success.
			createSuccessNotice(__('Affiliate updated.', 'surecart'), {
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
	 * Activate the affiliation.
	 */
	const onActivate = async () => {
		try {
			setLoading(true);
			setError(null);
			await apiFetch({
				path: `/surecart/v1/affiliations/${id}/activate`,
				method: 'PATCH',
			});

			createSuccessNotice(__('Affiliate user activated.', 'surecart'), {
				type: 'snackbar',
			});

			receiveEntityRecords(
				'surecart',
				'affiliation',
				{
					...affiliation,
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
			await apiFetch({
				path: `/surecart/v1/affiliations/${id}/deactivate`,
				method: 'PATCH',
			});

			createSuccessNotice(__('Affiliate user deactivated.', 'surecart'), {
				type: 'snackbar',
			});

			receiveEntityRecords(
				'surecart',
				'affiliation',
				{
					...affiliation,
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
						</ScMenu>
					</ScDropdown>
				</div>
			}
			sidebar={
				<Details
					affiliation={affiliation || {}}
					loading={!hasLoadedAffiliation}
				/>
			}
		>
			<Error error={error} setError={setError} margin="80px" />
			<Clicks affiliationId={affiliation?.id} />
			<Referrals affiliationId={affiliation?.id} />
			<Payouts affiliationId={affiliation?.id} />
			<Promotions affiliationId={affiliation?.id} />

			<ConfirmDialog
				isOpen={'activate' === modal}
				onConfirm={() => {
					onActivate();
					setModal(false);
				}}
				onCancel={() => setModal(false)}
			>
				{__('Are you sure to activate the affiliate user?', 'surecart')}
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
					'Are you sure to deactivate the affiliate user?',
					'surecart'
				)}
			</ConfirmDialog>
		</UpdateModel>
	);
};
