/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect, useMemo } from '@wordpress/element';
import { getQueryArg } from '@wordpress/url';

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
import useSave from './utils/UseSave';
import Error from '../components/Error';
import Logo from '../templates/Logo';
import UpdateModel from '../templates/UpdateModel';
import Details from './modules/Details';
import Rules from './modules/Rules';
import SaveButton from '../templates/SaveButton';
import Box from '../ui/Box';
import DateTimePicker from './modules/DateTimePicker';
import { TYPE_CHOICES } from './utils/constants';

export default ({ id, setBrowserURL }) => {
	const [error, setError] = useState(null);
	const [publishing, setPublishing] = useState(false);
	const [modal, setModal] = useState(false);
	const { save } = useSave();
	const { deleteEntityRecord, editEntityRecord } = useDispatch(coreStore);

	const status = getQueryArg(window.location.href, 'status') || false;
	const willPublish = 'publish' === status && !autoFee?.enabled;

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

	useEffect(() => {
		if (!willPublish || !autoFee || autoFee.enabled || publishing) return;
		updateAutoFee({
			enabled: true,
		});
		setPublishing(true);
	}, [autoFee, status, willPublish]);

	/**
	 * Update the Dynamic Price.
	 */
	const onSubmit = async () => {
		try {
			await save({
				successMessage: __('Dynamic Price updated.', 'surecart'),
			});
			setBrowserURL({ id });
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	/**
	 * Delete the Dynamic Price.
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

	const autoFeeAppliesTo = useMemo(
		() =>
			TYPE_CHOICES?.find(
				(choice) => choice.value === autoFee?.fee_target
			),
		[autoFee?.fee_target]
	);

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
							{__('Dynamic Pricing', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb>
							<ScFlex style={{ gap: '1em' }}>
								{__('Dynamic Price', 'surecart')}
							</ScFlex>
						</ScBreadcrumb>
					</ScBreadcrumbs>
				</ScFlex>
			}
			sidebar={
				<>
					<Box
						title={__('Applies To', 'surecart')}
						loading={!hasLoadedAutoFee}
					>
						<div
							style={{
								display: 'flex',
								gap: '8px',
								fontWeight: 500,
								fontSize: '14px',
								alignItems: 'center',
							}}
						>
							<ScTag type="info" pill>
								<div
									css={css`
										display: flex;
										align-items: center;
										gap: 0.5em;
									`}
								>
									<ScIcon name={autoFeeAppliesTo?.icon} />
									{autoFeeAppliesTo?.label}
								</div>
							</ScTag>
						</div>
						<div
							style={{
								fontSize: '12px',
								color: '#6B7280',
							}}
						>
							{autoFeeAppliesTo?.description}
						</div>
					</Box>
					<Box
						title={__('Schedule', 'surecart')}
						loading={!hasLoadedAutoFee}
					>
						<ScFormControl
							help={__(
								'Time at which the dynamic price becomes active & start being applied to the checkout.',
								'surecart'
							)}
						>
							<DateTimePicker
								dateTime={true}
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
								'Time at which the dynamic price becomes inactive.',
								'surecart'
							)}
						>
							<DateTimePicker
								dateTime={true}
								label={__('End Date', 'surecart')}
								currentDate={autoFee?.end_at}
								setDate={(date) =>
									updateAutoFee({
										end_at: date,
									})
								}
								placeholder={__('Never', 'surecart')}
							/>
						</ScFormControl>
					</Box>
				</>
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
								? __('Active', 'surecart')
								: __('Inactive', 'surecart')}
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
						{willPublish && autoFee?.enabled
							? __('Save & Publish', 'surecart')
							: __('Update', 'surecart')}
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
					'Permanently delete this Dynamic Price? You cannot undo this action.',
					'surecart'
				)}
			</ConfirmDialog>
		</UpdateModel>
	);
};
