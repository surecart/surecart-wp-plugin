/** @jsx jsx */

/**
 * External dependencies.
 */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect, select } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { Fragment, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import {
	ScBlockUi,
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScDropdown,
	ScFlex,
	ScIcon,
	ScMenu,
	ScMenuItem,
} from '@surecart/components-react';
import Logo from '../templates/Logo';
import Details from './modules/Details';
import Template from '../templates/UpdateModel';
import SaveButton from '../templates/SaveButton';
import useSave from '../settings/UseSave';
import Summary from './modules/Summary';
import Affiliation from './modules/Affiliation';
import ReferralItems from './modules/ReferralItems';
import Click from './modules/Click';
import Order from './modules/Order';
import Payout from './modules/Payout';
import ConfirmDeleteReferral from './components/ConfirmDeleteReferral';

const STATUS = {
	approved: __('Approved', 'surecart'),
	denied: __('Denied', 'surecart'),
	reviewing: __('Reviewing', 'surecart'),
};

export default ({ id }) => {
	const { save } = useSave();
	const [changingStatus, setChangingStatus] = useState(false);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const { editEntityRecord, receiveEntityRecords } = useDispatch(coreStore);
	const { baseURL } = select(coreStore).getEntityConfig(
		'surecart',
		'referral'
	);
	const [currentModal, setCurrentModal] = useState(null);
	const { referral, isLoading } = useSelect((select) => {
		const entityData = ['surecart', 'referral', id];

		return {
			referral: select(coreStore).getEditedEntityRecord(...entityData),
			isLoading: select(coreStore)?.isResolving?.(
				'getEditedEntityRecord',
				[...entityData]
			),
		};
	});

	/**
	 * Update
	 */
	const updateReferral = (data) =>
		editEntityRecord('surecart', 'referral', id, data);

	/**
	 * Handle the form submission
	 */
	const onSubmit = async () => {
		try {
			save({ successMessage: __('Referral updated.', 'surecart') });
		} catch (e) {
			console.error(e);
			createErrorNotice(e?.message, { type: 'snackbar' });
		}
	};

	/**
	 * Approve Referral
	 */
	const approveReferral = async () => {
		try {
			setChangingStatus(true);
			const approved = await apiFetch({
				method: 'PATCH',
				path: `${baseURL}/${id}/approve`,
			});

			createSuccessNotice(
				__('Affiliate referral approved.', 'surecart'),
				{
					type: 'snackbar',
				}
			);

			receiveEntityRecords(
				'surecart',
				'referral',
				{
					...approved,
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
			createErrorNotice(e?.message, { type: 'snackbar' });
		} finally {
			setChangingStatus(false);
		}
	};

	/**
	 * Mark Referral as Reviewing
	 */
	const markReferralAsReviewing = async () => {
		try {
			setChangingStatus(true);
			const reviewing = await apiFetch({
				method: 'PATCH',
				path: `${baseURL}/${id}/make_reviewing`,
			});

			createSuccessNotice(
				__('Affiliate referral marked as reviewing.', 'surecart'),
				{
					type: 'snackbar',
				}
			);

			receiveEntityRecords(
				'surecart',
				'referral',
				{
					...reviewing,
					status: 'reviewing',
				},
				undefined,
				false,
				{
					status: 'reviewing',
				}
			);
		} catch (e) {
			console.error(e);
			createErrorNotice(e?.message, { type: 'snackbar' });
		} finally {
			setChangingStatus(false);
		}
	};

	/**
	 * Deny Referral
	 */
	const denyReferral = async () => {
		try {
			setChangingStatus(true);
			const denied = await apiFetch({
				method: 'PATCH',
				path: `${baseURL}/${id}/deny`,
			});

			createSuccessNotice(__('Affiliate referral denied.', 'surecart'), {
				type: 'snackbar',
			});

			receiveEntityRecords(
				'surecart',
				'referral',
				{
					...denied,
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
			createErrorNotice(e?.message, { type: 'snackbar' });
		} finally {
			setChangingStatus(false);
		}
	};

	return (
		<Template
			onSubmit={onSubmit}
			title={
				<ScFlex style={{ gap: '1em' }} align-items="center">
					<ScButton
						circle
						size="small"
						href="admin.php?page=sc-affiliate-referrals"
					>
						<ScIcon name="arrow-left" />
					</ScButton>
					<ScBreadcrumbs>
						<ScBreadcrumb>
							<Logo display="block" />
						</ScBreadcrumb>
						<ScBreadcrumb href="admin.php?page=sc-affiliate-referrals">
							{__('Referrals', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb>
							<ScFlex style={{ gap: '1em' }}>
								{__('View Referral', 'surecart')}
							</ScFlex>
						</ScBreadcrumb>
					</ScBreadcrumbs>
				</ScFlex>
			}
			button={
				isLoading ? (
					<sc-skeleton
						style={{
							width: '120px',
							height: '35px',
							display: 'inline-block',
						}}
					/>
				) : (
					referral?.editable && (
						<ScFlex justifyContent="flex-start">
							<ScDropdown placement="bottom-end">
								<ScButton type="default" slot="trigger" caret>
									{STATUS[referral?.status] ??
										__('Actions', 'surecart')}
								</ScButton>
								<ScMenu>
									{referral?.status !== 'approved' && (
										<ScMenuItem onClick={approveReferral}>
											{__('Approve', 'surecart')}
										</ScMenuItem>
									)}
									{referral?.status !== 'reviewing' && (
										<ScMenuItem
											onClick={() =>
												markReferralAsReviewing()
											}
										>
											{__('Make Reviewing', 'surecart')}
										</ScMenuItem>
									)}
									{referral?.status !== 'denied' && (
										<ScMenuItem
											onClick={() => denyReferral()}
										>
											{__('Deny', 'surecart')}
										</ScMenuItem>
									)}
									<ScMenuItem
										onClick={() =>
											setCurrentModal('delete_referral')
										}
									>
										{__('Delete', 'surecart')}
									</ScMenuItem>
								</ScMenu>
							</ScDropdown>
							<SaveButton>{__('Update', 'surecart')}</SaveButton>
						</ScFlex>
					)
				)
			}
			sidebar={
				<Fragment>
					<Summary referral={referral} loading={isLoading} />
					<Order referral={referral} loading={isLoading} />
					<Click referral={referral} loading={isLoading} />
					<Payout referral={referral} loading={isLoading} />
				</Fragment>
			}
		>
			<Details
				referral={referral}
				updateReferral={updateReferral}
				loading={isLoading}
			/>
			<Affiliation
				referral={referral}
				loading={isLoading}
				updateReferral={updateReferral}
			/>
			<ReferralItems referralId={id} loading={isLoading} />

			{changingStatus && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					zIndex="9"
					spinner
				/>
			)}

			{currentModal && (
				<>
					<ConfirmDeleteReferral
						open={currentModal === 'delete_referral'}
						onRequestClose={() => setCurrentModal(null)}
						referralId={id}
					/>
				</>
			)}
		</Template>
	);
};
