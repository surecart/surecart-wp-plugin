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
import UpdateModel from '../templates/UpdateModel';
import Clicks from './modules/Clicks';
import Actions from './components/Actions';
import Details from './modules/Details';
import Referrals from './modules/Referrals';
import Payouts from './modules/Payouts';

export default () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { saveDirtyRecords } = useDirty();
	const id = useSelect((select) => select(dataStore).selectPageId());
	const {
		item: affiliation,
		editItem: editAffiliation,
		hasLoadedItem: hasLoadedAffiliation,
	} = useEntity('affiliation', id, {
		expand: ['clicks', 'referrals', 'payouts'],
	});

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
	const onAffiliationActivate = async () => {
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
	const onAffiliationDeactivate = async () => {
		try {
			setLoading(true);
			setError(null);
			await apiFetch({
				path: `/surecart/v1/affiliations/${id}/deactivate`,
				method: 'PATCH',
			});

			createSuccessNotice(
				__('Affiliate user de-activated.', 'surecart'),
				{
					type: 'snackbar',
				}
			);

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
					<Actions
						affiliation={affiliation}
						onActivate={onAffiliationActivate}
						onDeactivate={onAffiliationDeactivate}
						loading={loading}
					/>
				</div>
			}
			sidebar={
				<Details
					affiliation={affiliation}
					loading={!hasLoadedAffiliation}
				/>
			}
		>
			<Error error={error} setError={setError} margin="80px" />
			<Clicks
				clicks={affiliation?.clicks || {}}
				updateAffiliation={editAffiliation}
				loading={!hasLoadedAffiliation}
			/>
			<Referrals
				referrals={affiliation?.referrals || {}}
				updateAffiliation={editAffiliation}
				loading={!hasLoadedAffiliation}
			/>
			<Payouts
				payouts={affiliation?.payouts || {}}
				updateAffiliation={editAffiliation}
				loading={!hasLoadedAffiliation}
			/>
		</UpdateModel>
	);
};
