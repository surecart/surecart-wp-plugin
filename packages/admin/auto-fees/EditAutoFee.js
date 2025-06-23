/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { useDispatch, useSelect, select } from '@wordpress/data';
import { store as coreStore, useEntityRecord } from '@wordpress/core-data';
import { useState } from '@wordpress/element';

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
import { store as dataStore } from '@surecart/data';
import useSave from '../settings/UseSave';
import Error from '../components/Error';
import Logo from '../templates/Logo';
import UpdateModel from '../templates/UpdateModel';
import Details from './modules/Details';

export default () => {
	const [error, setError] = useState(null);
	const [modal, setModal] = useState(false);
	const { save } = useSave();
	const { deleteEntityRecord, editEntityRecord, receiveEntityRecords } =
		useDispatch(coreStore);
	const id = useSelect((select) => select(dataStore).selectPageId());

	const { autoFee, isSaving, loadError, isDeleting, hasLoadedAutoFee } =
		useSelect(
			(select) => {
				const entityData = ['surecart', 'auto-fee', id];

				return {
					autoFee: select(coreStore).getEditedEntityRecord(
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
					hasLoadedAutoFee: select(
						coreStore
					)?.hasFinishedResolution?.('getEntityRecord', [
						...entityData,
					]),
				};
			},
			[id]
		);

	const updateAutoFee = (data) => {
		editEntityRecord('surecart', 'auto-fee', id, data);
	};

	/**
	 * Update the auto fee.
	 */
	const onSubmit = async () => {
		try {
			await save({
				successMessage: __('Auto Fee updated.', 'surecart'),
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	/**
	 * Delete the auto fee.
	 */
	const onDelete = async () => {
		try {
			setError(null);
			await deleteEntityRecord('surecart', 'auto-fee', id, undefined, {
				throwOnError: true,
			});
			window.location.assign('admin.php?page=sc-auto-fees');
		} catch (e) {
			console.error(e);
			setError(e);
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
						href="admin.php?page=sc-auto-fees"
					>
						<ScIcon name="arrow-left"></ScIcon>
					</ScButton>
					<ScBreadcrumbs>
						<ScBreadcrumb>
							<Logo display="block" />
						</ScBreadcrumb>
						<ScBreadcrumb href="admin.php?page=sc-auto-fees">
							{__('Auto Fees', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb>
							<ScFlex style={{ gap: '1em' }}>
								{__('Auto Fee', 'surecart')}
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
					<ScDropdown slot="suffix" placement="bottom-end">
						<ScButton
							type="primary"
							slot="trigger"
							caret
							loading={isSaving || isDeleting}
						>
							{__('Actions', 'surecart')}
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
				</div>
			}
		>
			<Error
				error={error || loadError}
				setError={setError}
				margin="80px"
			/>
			<Details
				autoFee={autoFee || {}}
				onUpdate={updateAutoFee}
				loading={!hasLoadedAutoFee}
				saving={isSaving}
				deleting={isDeleting}
			/>

			<ConfirmDialog
				isOpen={'delete' === modal}
				onConfirm={() => {
					onDelete();
					setModal(false);
				}}
				onCancel={() => setModal(false)}
			>
				{__(
					'Permanently delete this Auto Fee? You cannot undo this action.',
					'surecart'
				)}
			</ConfirmDialog>
		</UpdateModel>
	);
};
