/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { useDispatch, useSelect, select } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useReducer, useEffect } from '@wordpress/element';
import { getDate } from '@wordpress/date';
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
	ScSwitch,
	ScTag,
	ScFormControl,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import useSave from '../settings/UseSave';
import Error from '../components/Error';
import Logo from '../templates/Logo';
import UpdateModel from '../templates/UpdateModel';
import Details from './modules/Details';
import Rules from './modules/Rules';
import SaveButton from '../templates/SaveButton';
import Box from '../ui/Box';
import DateTimePicker from './modules/DateTimePicker';
import { SCHEMA_ID } from './utils/constants';

export default ({ setId }) => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [modal, setModal] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const { save } = useSave();
	const { deleteEntityRecord, editEntityRecord } = useDispatch(coreStore);
	const id = useSelect((select) => select(dataStore).selectPageId());
	const { saveEntityRecord } = useDispatch(coreStore);
	const baseUrl = select(coreStore).getEntityConfig(
		'surecart',
		'rule-string'
	)?.baseURL;

	const [newAutoFee, updateNewAutoFee] = useReducer(
		(currentState, newState) => {
			return { ...currentState, ...newState };
		},
		{
			name: '',
			enabled: true,
			amount_adjustment: null,
			percent_adjustment: null,
			discount: false,
			start_at: Date.parse(getDate(new Date())) / 1000,
			end_at: null,
			rule_string: '',
			rule_json: {
				rule_string: '',
				schema_id: 'auto_fees__line_item',
				groups: [],
			},
		}
	);

	const { autoFee, isSaving, loadError, isDeleting, hasLoadedAutoFee } =
		useSelect(
			(select) => {
				if (!id) {
					return {
						autoFee: newAutoFee,
						isSaving: false,
						loadError: null,
						isDeleting: false,
						hasLoadedAutoFee: true,
					};
				}

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
			[id, newAutoFee]
		);

	useEffect(() => {
		if (
			!autoFee?.rule_string ||
			autoFee?.rule_json ||
			!SCHEMA_ID ||
			loading
		) {
			return;
		}

		deconstructRuleString();
	}, [autoFee]);

	const updateAutoFee = async (data) => {
		if (!id) {
			updateNewAutoFee(data);
			return;
		}
		editEntityRecord('surecart', 'auto-fee', id, data);
	};

	const deconstructRuleString = async () => {
		try {
			setLoading(true);
			const response = await apiFetch({
				path: `${baseUrl}/deconstruct`,
				method: 'POST',
				data: {
					rule_string: {
						schema_id: SCHEMA_ID,
						rule_string: autoFee?.rule_string,
					},
				},
			});

			editEntityRecord('surecart', 'auto-fee', id, {
				rule_json: response,
			});
			setLoading(false);
		} catch (e) {
			console.error(e);
		}
	};

	const constructRuleString = async (rule_json) => {
		try {
			const response = await apiFetch({
				path: `${baseUrl}/construct`,
				method: 'POST',
				data: {
					rule_json: {
						schema_id: SCHEMA_ID,
						groups: rule_json?.groups,
					},
				},
			});
			return response;
		} catch (e) {
			console.error(e);
		}
	};

	/**
	 * Update the auto fee.
	 */
	const onSubmit = async () => {
		try {
			if (!id) {
				setIsCreating(true);
				const createdAutoFee = await saveEntityRecord(
					'surecart',
					'auto-fee',
					newAutoFee,
					{ throwOnError: true }
				);
				setId(createdAutoFee.id);
				setIsCreating(false);
			}
			const ruleString = await constructRuleString(autoFee?.rule_json);

			if (!ruleString?.rule_string) {
				throw new Error('Rule String not updated.');
			}
			//remove the rule_json from the auto fee
			await updateAutoFee({
				rule_string: ruleString?.rule_string,
				rule_json: null,
			});

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
					loading={!hasLoadedAutoFee || loading}
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
					{id && (
						<>
							<ScDropdown slot="suffix" placement="bottom-end">
								<ScButton
									type="text"
									slot="trigger"
									loading={isSaving || isDeleting}
								>
									<ScIcon name="more-horizontal" />
								</ScButton>
								<ScMenu>
									<ScMenuItem
										onClick={() => setModal('delete')}
									>
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
									type={
										autoFee?.enabled ? 'success' : 'default'
									}
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
								busy={
									isSaving || isDeleting || !hasLoadedAutoFee
								}
							>
								{__('Save Auto Fee', 'surecart')}
							</SaveButton>
						</>
					)}
					{!id && (
						<ScButton type="primary" submit loading={isCreating}>
							{__('Create', 'surecart')}
						</ScButton>
					)}
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
				loading={!hasLoadedAutoFee || loading}
			/>
			<Rules
				autoFee={autoFee || {}}
				onUpdate={updateAutoFee}
				loading={!hasLoadedAutoFee || loading}
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
