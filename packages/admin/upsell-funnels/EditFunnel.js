/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScAlert,
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScSwitch,
	ScTag,
} from '@surecart/components-react';
import { store } from '@surecart/data';
import { getQueryArg } from '@wordpress/url';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import Error from '../components/Error';
import Logo from '../templates/Logo';
import SaveButton from '../templates/SaveButton';

// template
import UpdateModel from '../templates/UpdateModel';

import Conditions from './modules/Conditions';
import Details from './modules/Details';
import Funnel from './modules/Funnel';
import useSave from '../settings/UseSave';
import Priority from './modules/Priority';
import { useEffect, useState } from '@wordpress/element';
import {
	__experimentalConfirmDialog as ConfirmDialog,
	ExternalLink,
} from '@wordpress/components';

export default ({ setBrowserURL }) => {
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const id = useSelect((select) => select(store).selectPageId());
	const { save } = useSave();
	const [dialog, setDialog] = useState(null);
	const { deleteEntityRecord, editEntityRecord, saveEditedEntityRecord } =
		useDispatch(coreStore);

	const editFunnel = (data) =>
		editEntityRecord('surecart', 'upsell-funnel', id, data);

	const { upsells, loadingUpsells } = useSelect(
		(select) => {
			const entityData = [
				'surecart',
				'upsell',
				{
					upsell_funnel_ids: [id],
					expand: [
						'price',
						'price.product',
						'product.featured_product_media',
						'product.product_medias',
						'product_media.media',
					],
				},
			];
			const upsells = select(coreStore).getEntityRecords(...entityData);

			const editedUpsells = (upsells || []).map((upsell) => {
				return {
					...upsell,
					...select(coreStore).getRawEntityRecord(
						'surecart',
						'upsell',
						upsell?.id
					),
					...select(coreStore).getEntityRecordEdits(
						'surecart',
						'upsell',
						upsell?.id
					),
				};
			});

			return {
				upsells: editedUpsells,
				loadingUpsells: !select(coreStore).hasFinishedResolution(
					'getEntityRecords',
					[...entityData]
				),
			};
		},
		[id]
	);

	const { funnel, loading, error } = useSelect(
		(select) => {
			if (!id) {
				return {};
			}
			const entityData = [
				'surecart',
				'upsell-funnel',
				id,
				{ expand: ['upsells'] },
			];
			return {
				funnel: select(coreStore).getEditedEntityRecord(...entityData),
				error: select(coreStore)?.getLastEntitySaveError?.(
					...entityData
				),
				loading: !select(coreStore)?.hasFinishedResolution?.(
					'getEditedEntityRecord',
					[...entityData]
				),
			};
		},
		[id]
	);

	useEffect(() => {
		if (loading) return;
		const initialState = getQueryArg(window.location.href, 'initial_state');
		if (initialState) {
			editEntityRecord('surecart', 'upsell-funnel', id, initialState);
		}
	}, [loading]);

	/**
	 * Handle the form submission
	 */
	const onSubmit = async () => {
		try {
			save({ successMessage: __('Upsell funnel saved.', 'surecart') });
			// remove all args from the url.
			setBrowserURL({ id });
		} catch (e) {
			console.error(e);
			createErrorNotice(e?.message, { type: 'snackbar' });
		}
	};

	/**
	 * Toggle product delete.
	 */
	const onDelete = async () => {
		const r = confirm(
			__(
				'Permanently delete this upsell? You cannot undo this action.',
				'surecart'
			)
		);
		if (!r) return;

		try {
			await deleteEntityRecord('surecart', 'upsell-funnel', id, {
				throwOnError: true,
			});
			createSuccessNotice(__('Upsell deleted.', 'surecart'));
			window.location.assign('admin.php?page=sc-upsell-funnels');
		} catch (e) {
			console.error(e);
			createErrorNotice(e?.message, { type: 'snackbar' });
		}
	};

	/**
	 * Toggle Archive
	 */
	const toggleArchive = async () => {
		try {
			setDialog(false);
			// we do this in 2 phases so that the UI shows a saving state.
			await editEntityRecord('surecart', 'upsell-funnel', id, {
				archived: !funnel?.archived,
			});
			const response = await saveEditedEntityRecord(
				'surecart',
				'upsell-funnel',
				id,
				{
					throwOnError: true,
				}
			);
			createSuccessNotice(
				response?.archived
					? __('Upsell funnel archived.', 'surecart')
					: __('Upsell funnel restored.', 'surecart'),
				{ type: 'snackbar' }
			);
		} catch (e) {
			console.error(e);
			createErrorNotice(e?.message, { type: 'snackbar' });
		}
	};

	return (
		<UpdateModel
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
						href="admin.php?page=sc-upsell-funnels"
					>
						<sc-icon name="arrow-left"></sc-icon>
					</ScButton>
					<ScBreadcrumbs>
						<ScBreadcrumb>
							<Logo display="block" />
						</ScBreadcrumb>
						<ScBreadcrumb href="admin.php?page=sc-upsell-funnels">
							{__('Upsell Funnels', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb>
							{__('Edit Upsell Funnel', 'surecart')}
						</ScBreadcrumb>
					</ScBreadcrumbs>
				</div>
			}
			button={
				<div
					css={css`
						display: flex;
						gap: 1em;
						align-items: center;
					`}
				>
					<ScDropdown placement="bottom-end">
						<ScButton type="text" slot="trigger">
							<ScIcon name="more-horizontal" />
						</ScButton>
						<ScMenu>
							<ScMenuItem onClick={() => setDialog('archive')}>
								{funnel?.archived
									? __('Un-Archive', 'surecart')
									: __('Archive', 'surecart')}
							</ScMenuItem>
							<ScMenuItem onClick={() => setDialog('delete')}>
								{__('Delete', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>

					{!loading && (
						<ScTag
							type={
								funnel?.archived
									? 'warning'
									: funnel?.enabled
									? 'success'
									: 'default'
							}
							size="small"
							pill
						>
							{funnel?.archived
								? __('Archived', 'surecart')
								: funnel?.enabled
								? __('Funnel Active', 'surecart')
								: __('Funnel Inactive', 'surecart')}
						</ScTag>
					)}

					{!funnel?.archived && (
						<ScSwitch
							checked={funnel?.enabled}
							onScChange={(e) =>
								editFunnel({ enabled: e.target.checked })
							}
						/>
					)}
					<SaveButton busy={loading}>
						{__('Save Funnel', 'surecart')}
					</SaveButton>
				</div>
			}
		>
			<>
				<Error error={error} margin="80px" />
				<Details
					funnel={funnel}
					updateFunnel={editFunnel}
					loading={loading}
				/>
				<Conditions
					funnel={funnel}
					updateFunnel={editFunnel}
					loading={loading}
				/>
				<Funnel
					funnelId={id}
					upsells={upsells}
					updateFunnel={editFunnel}
					loading={loading || loadingUpsells}
				/>
				<Priority funnel={funnel} updateFunnel={editFunnel} />

				<ScAlert
					type="info"
					open
					title={__(
						'Upsells Need Reusable Payment Methods',
						'surecart'
					)}
				>
					{__(
						'Enable reusable payments in your payment processor settings to charge customers for upsells after checkout.',
						'surecart'
					)}{' '}
					<ExternalLink
						href="https://surecart.com/docs/enable-upsell-funnels/"
						target="_blank"
						rel="noopener noreferrer"
					>
						{__('Learn more', 'surecart')}
					</ExternalLink>
				</ScAlert>
			</>

			<ConfirmDialog
				isOpen={dialog === 'archive'}
				onConfirm={toggleArchive}
				onCancel={() => setDialog(null)}
			>
				{funnel?.archived
					? __('Un-Archive this upsell?', 'surecart')
					: __(
							'Archive this upsell? All unsaved changes will be lost.',
							'surecart'
					  )}
			</ConfirmDialog>

			<ConfirmDialog
				isOpen={dialog === 'delete'}
				onConfirm={onDelete}
				onCancel={() => setDialog(null)}
			>
				{__(
					'Permanently delete this upsell? You cannot undo this action.',
					'surecart'
				)}
			</ConfirmDialog>
		</UpdateModel>
	);
};
