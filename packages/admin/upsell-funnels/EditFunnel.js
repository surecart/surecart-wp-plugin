/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
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
import { select, useDispatch, useSelect } from '@wordpress/data';
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
import Box from '../ui/Box';
import Priority from './modules/Priority';

export default () => {
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const id = useSelect((select) => select(store).selectPageId());
	const { save } = useSave();
	const { deleteEntityRecord, editEntityRecord } = useDispatch(coreStore);

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

	const { funnel, savedFunnel, willPublish, loading, error } = useSelect(
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
				savedFunnel: select(coreStore).getEntityRecord(...entityData),
				willPublish: select(coreStore).getEntityRecordEdits(
					...entityData
				)?.enabled,
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

	/**
	 * Handle the form submission
	 */
	const onSubmit = async () => {
		try {
			save({ successMessage: __('Upsell funnel saved.', 'surecart') });
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
		const r = confirm(
			funnel?.archived
				? __(
						'Un-Archive this upsell? This will make the product purchaseable again.',
						'surecart'
				  )
				: __(
						'Archive this upsell? This upsell will not be purchaseable and all unsaved changes will be lost.',
						'surecart'
				  )
		);

		if (!r) return;

		try {
			const funnel = await saveEntityRecord(
				'surecart',
				'upsell-funnel',
				{
					id,
					archived: !funnel?.archived,
				},
				{ throwOnError: true }
			);
			createSuccessNotice(
				!funnel?.archived
					? __('Upsell funnel archived.', 'surecart')
					: __('Upsell funnel un-archived.', 'surecart'),
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
					<ScTag
						type={savedFunnel?.enabled ? 'success' : 'default'}
						size="small"
						pill
					>
						{savedFunnel?.enabled
							? __('Published', 'surecart')
							: __('Draft', 'surecart')}
					</ScTag>
				</div>
			}
			sidebar={
				<>
					<Box title={__('Status', 'surecart')}>
						<ScSwitch
							checked={funnel?.enabled}
							onScChange={(e) =>
								editFunnel({ enabled: e.target.checked })
							}
						>
							{__('Enabled', 'surecart')}
						</ScSwitch>
					</Box>

					<Priority funnel={funnel} updateFunnel={editFunnel} />
				</>
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
							<ScMenuItem onClick={toggleArchive}>
								{funnel?.archived
									? __('Un-Archive', 'surecart')
									: __('Archive', 'surecart')}
							</ScMenuItem>
							<ScMenuItem onClick={onDelete}>
								{__('Delete', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
					<SaveButton busy={loading}>
						{willPublish
							? __('Save & Publish', 'surecart')
							: funnel?.enabled
							? __('Save Funnel', 'surecart')
							: __('Save Draft', 'surecart')}
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
				{/* <Discount
					upsell={upsell}
					updateUpsell={editUpsell}
					loading={!hasLoadedUpsell}
				/> */}
			</>
		</UpdateModel>
	);
};
