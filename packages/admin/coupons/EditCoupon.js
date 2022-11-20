/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScDropdown,
	ScMenu,
	ScMenuItem,
	ScIcon,
	ScTag,
	ScFlex,
} from '@surecart/components-react';
import { useDispatch, useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';

import Error from '../components/Error';

// hocs
import Logo from '../templates/Logo';
import Template from '../templates/UpdateModel';
import Codes from './modules/Codes';
import Limits from './modules/Limits';
import Conditions from './modules/Conditions';

// modules
import Name from './modules/Name';
import Types from './modules/Types';
// parts
import Sidebar from './Sidebar';
import useSave from '../settings/UseSave';
import { useState } from 'react';
import SaveButton from '../templates/SaveButton';
import { Modal } from '@wordpress/components';

export default ({ id }) => {
	const { save } = useSave();
	const [error, setError] = useState(null);
	const [modal, setModal] = useState(null);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { saveEntityRecord, editEntityRecord, deleteEntityRecord } =
		useDispatch(coreStore);

	const { coupon, isLoading, isDeleting, deleteError, saveError, loadError } =
		useSelect((select) => {
			const entityData = ['surecart', 'coupon', id];

			return {
				coupon: select(coreStore).getEditedEntityRecord(...entityData),
				isLoading: select(coreStore)?.isResolving?.(
					'getEditedEntityRecord',
					[...entityData]
				),
				isSaving: select(coreStore)?.isSavingEntityRecord?.(
					...entityData
				),
				isDeleting: select(coreStore)?.isDeletingEntityRecord?.(
					...entityData
				),
				saveError: select(coreStore)?.getLastEntitySaveError(
					...entityData
				),
				loadError: select(coreStore)?.getResolutionError?.(
					'getEditedEntityRecord',
					...entityData
				),
				deleteError: select(coreStore)?.getLastEntityDeleteError(
					...entityData
				),
			};
		});

	/**
	 * Update
	 */
	const updateCoupon = (data) =>
		editEntityRecord('surecart', 'coupon', id, data);

	/**
	 * Delete
	 */
	const deleteCoupon = async () => {
		try {
			await deleteEntityRecord('surecart', 'coupon', id, undefined, {
				throwOnError: true,
			});
			createSuccessNotice(__('Deleted.', 'surecart'), {
				type: 'snackbar',
			});
			window.location.assign('admin.php?page=sc-coupons');
		} catch (e) {
			console.error(e);
			setModal(false);
		}
	};

	/**
	 * Handle the form submission
	 */
	const onSubmit = async () => {
		try {
			setError(null);
			save({ successMessage: __('Coupon updated.', 'surecart') });
		} catch (e) {
			setError(e);
		}
	};

	return (
		<Template
			onSubmit={onSubmit}
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 1em;
					`}
				>
					<ScButton
						circle
						size="small"
						href="admin.php?page=sc-coupons"
					>
						<ScIcon name="arrow-left" />
					</ScButton>
					<ScBreadcrumbs>
						<ScBreadcrumb>
							<Logo display="block" />
						</ScBreadcrumb>
						<ScBreadcrumb href="admin.php?page=sc-coupons">
							{__('Coupons', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb>
							<sc-flex style={{ gap: '1em' }}>
								{__('Edit Coupon', 'surecart')}
							</sc-flex>
						</ScBreadcrumb>
					</ScBreadcrumbs>
				</div>
			}
			button={
				isLoading ? (
					<sc-skeleton
						style={{
							width: '120px',
							height: '35px',
							display: 'inline-block',
						}}
					></sc-skeleton>
				) : (
					<ScFlex justifyContent="flex-start">
						<ScDropdown placement="bottom-end">
							<ScButton type="text" slot="trigger">
								<ScIcon name="more-horizontal" />
							</ScButton>
							<ScMenu>
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

						<SaveButton>
							{__('Update Coupon', 'surecart')}
						</SaveButton>
					</ScFlex>
				)
			}
			sidebar={
				<Sidebar
					coupon={coupon}
					updateCoupon={updateCoupon}
					loading={isLoading}
				/>
			}
		>
			<Fragment>
				<Error
					error={error || loadError || saveError || deleteError}
					margin="80px"
				/>

				<Name
					loading={isLoading}
					coupon={coupon}
					updateCoupon={updateCoupon}
				/>

				<Codes id={coupon?.id || id} loading={isLoading} />

				<Conditions
					loading={isLoading}
					coupon={coupon}
					updateCoupon={updateCoupon}
				/>

				<Types
					loading={isLoading}
					coupon={coupon}
					updateCoupon={updateCoupon}
				/>

				<Limits
					loading={isLoading}
					coupon={coupon}
					updateCoupon={updateCoupon}
				/>
			</Fragment>

			{modal === 'delete' && (
				<Modal
					title={__('Delete this coupon?', 'surecart')}
					css={css`
						max-width: 500px !important;
					`}
					onRequestClose={() => setModal(false)}
					shouldCloseOnClickOutside={false}
				>
					<p>
						{__(
							'Are you sure you want to delete this coupon?',
							'surecart'
						)}
					</p>
					<ScFlex alignItems="center" justifyContent="flex-start">
						<ScButton
							type="primary"
							busy={isDeleting}
							onClick={deleteCoupon}
						>
							{__('Delete', 'surecart')}
						</ScButton>
						<ScButton type="text" onClick={() => setModal(false)}>
							{__('Cancel', 'surecart')}
						</ScButton>
					</ScFlex>
				</Modal>
			)}
		</Template>
	);
};
