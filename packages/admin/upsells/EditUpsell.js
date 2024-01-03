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
} from '@surecart/components-react';
import { store } from '@surecart/data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import Error from '../components/Error';
// hocs
import useEntity from '../hooks/useEntity';
import Logo from '../templates/Logo';
import SaveButton from '../templates/SaveButton';

// template
import UpdateModel from '../templates/UpdateModel';

import Discount from './modules/Discount';
import Conditions from './modules/Conditions';
import Name from './modules/Name';
import Price from './modules/Price';
import Priority from './modules/Priority';
import Description from './modules/Description';
import CTA from './modules/CTA';
import Template from './modules/Template';

export default () => {
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const id = useSelect((select) => select(store).selectPageId());
	const {
		upsell,
		editUpsell,
		hasLoadedUpsell,
		saveEditedUpsell,
		savingUpsell,
		saveUpsell,
		deleteUpsell,
		saveUpsellError,
		upsellError,
	} = useEntity('upsell', id);

	/**
	 * Handle the form submission
	 */
	const onSubmit = async () => {
		const upsell = await saveEditedUpsell();
		if (!upsell) return;
		createSuccessNotice(__('Upsell updated.', 'surecart'), {
			type: 'snackbar',
		});
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
			await deleteUpsell({ throwOnError: true });
			createSuccessNotice(__('Upsell deleted.', 'surecart'));
			window.location.assign('admin.php?page=sc-upsells');
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
			upsell?.archived
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
			await saveUpsell({ archived: !upsell?.archived });
			createSuccessNotice(
				!upsell?.archived
					? __('Upsell archived.', 'surecart')
					: __('Upsell un-archived.', 'surecart'),
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
			button={
				<div>
					<ScDropdown placement="bottom-end">
						<ScButton type="text" slot="trigger">
							<ScIcon name="more-horizontal" />
						</ScButton>
						<ScMenu>
							<ScMenuItem onClick={toggleArchive}>
								{upsell?.archived
									? __('Un-Archive', 'surecart')
									: __('Archive', 'surecart')}
							</ScMenuItem>
							<ScMenuItem onClick={onDelete}>
								{__('Delete', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
					<SaveButton busy={!hasLoadedUpsell || savingUpsell}>
						{__('Save Upsell', 'surecart')}
					</SaveButton>
				</div>
			}
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
						href="admin.php?page=sc-upsells"
					>
						<sc-icon name="arrow-left"></sc-icon>
					</ScButton>
					<ScBreadcrumbs>
						<ScBreadcrumb>
							<Logo display="block" />
						</ScBreadcrumb>
						<ScBreadcrumb href="admin.php?page=sc-upsells">
							{__('Upsells', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb>
							{__('Edit Upsell', 'surecart')}
						</ScBreadcrumb>
					</ScBreadcrumbs>
				</div>
			}
			sidebar={
				<>
					<Priority
						upsell={upsell}
						updateUpsell={editUpsell}
						loading={!hasLoadedUpsell}
					/>

					<Template
						upsell={upsell}
						updateUpsell={editUpsell}
						loading={!hasLoadedUpsell}
					/>
				</>
			}
		>
			<>
				<Error error={saveUpsellError || upsellError} margin="80px" />
				<Name
					upsell={upsell}
					updateUpsell={editUpsell}
					loading={!hasLoadedUpsell}
				/>
				<Price
					upsell={upsell}
					updateUpsell={editUpsell}
					loading={!hasLoadedUpsell}
				/>
				<Conditions
					upsell={upsell}
					updateUpsell={editUpsell}
					loading={!hasLoadedUpsell}
				/>
				<Discount
					upsell={upsell}
					updateUpsell={editUpsell}
					loading={!hasLoadedUpsell}
				/>
				<Description
					upsell={upsell}
					updateUpsell={editUpsell}
					loading={!hasLoadedUpsell}
				/>
				<CTA
					upsell={upsell}
					updateUpsell={editUpsell}
					loading={!hasLoadedUpsell}
				/>
			</>
		</UpdateModel>
	);
};
