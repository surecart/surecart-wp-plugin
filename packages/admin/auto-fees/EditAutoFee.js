/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
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
	ScSwitch,
	ScTag,
	ScFormControl,
} from '@surecart/components-react';
import useSave from '../settings/UseSave';
import Error from '../components/Error';
import Logo from '../templates/Logo';
import UpdateModel from '../templates/UpdateModel';
import Details from './modules/Details';
import Rules from './modules/Rules';
import SaveButton from '../templates/SaveButton';
import Box from '../ui/Box';
import DateTimePicker from './modules/DateTimePicker';

export default ({ id }) => {
	const [error, setError] = useState(null);
	const [modal, setModal] = useState(false);
	const { save } = useSave();
	const { deleteEntityRecord, editEntityRecord } = useDispatch(coreStore);

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

	const updateAutoFee = async (data) => {
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
			sidebar={
				<Box
					title={__('Auto Fee Schedule', 'surecart')}
					loading={!hasLoadedAutoFee}
				>
					<ScFormControl
						help={__(
							'Time at which the auto fee becomes active & start being applied to the checkout.',
							'surecart'
						)}
					>
						<DateTimePicker
							label={__('Start Date', 'surecart')}
							currentDate={autoFee?.start_at}
							setDate={(date) =>
								updateAutoFee({
									start_at: date,
								})
							}
							required
						/>
					</ScFormControl>
					<ScFormControl
						help={__(
							'Time at which the auto fee becomes inactive.',
							'surecart'
						)}
					>
						<DateTimePicker
							label={__('End Date', 'surecart')}
							currentDate={autoFee?.end_at}
							setDate={(date) =>
								updateAutoFee({
									end_at: date,
								})
							}
						/>
					</ScFormControl>
				</Box>
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
							type="text"
							slot="trigger"
							loading={isSaving || isDeleting}
						>
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
					{hasLoadedAutoFee && (
						<ScTag
							type={autoFee?.enabled ? 'success' : 'default'}
							size="small"
							pill
						>
							{autoFee?.enabled
								? __('Auto Fee Active', 'surecart')
								: __('Auto Fee Inactive', 'surecart')}
						</ScTag>
					)}
					<ScSwitch
						checked={autoFee?.enabled}
						onScChange={(e) =>
							updateAutoFee({
								enabled: e.target.checked,
							})
						}
					/>
					<SaveButton
						busy={isSaving || isDeleting || !hasLoadedAutoFee}
					>
						{__('Save Auto Fee', 'surecart')}
					</SaveButton>
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
			/>
			<Rules
				autoFee={autoFee || {}}
				onUpdate={updateAutoFee}
				loading={!hasLoadedAutoFee}
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
