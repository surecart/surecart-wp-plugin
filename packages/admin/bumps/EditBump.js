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

export default () => {
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const id = useSelect((select) => select(store).selectPageId());
	const {
		bump,
		editBump,
		hasLoadedBump,
		saveEditedBump,
		savingBump,
		saveBump,
		deleteBump,
		saveBumpError,
		bumpError,
	} = useEntity('bump', id);

	/**
	 * Handle the form submission
	 */
	const onSubmit = async () => {
		const bump = await saveEditedBump();
		if (!bump) return;
		createSuccessNotice(__('Order Bump updated.', 'surecart'), {
			type: 'snackbar',
		});
	};

	/**
	 * Toggle product delete.
	 */
	const onDelete = async () => {
		const r = confirm(
			__(
				'Permanently delete this order bump? You cannot undo this action.',
				'surecart'
			)
		);
		if (!r) return;

		try {
			await deleteBump({ throwOnError: true });
			createSuccessNotice(__('Bump deleted.', 'surecart'));
			window.location.assign('admin.php?page=sc-bumps');
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
			bump?.archived
				? __(
						'Un-Archive this bump? This will make the product purchaseable again.',
						'surecart'
				  )
				: __(
						'Archive this bump? This bump will not be purchaseable and all unsaved changes will be lost.',
						'surecart'
				  )
		);

		if (!r) return;

		try {
			await saveBump({ archived: !bump?.archived });
			createSuccessNotice(
				!bump?.archived
					? __('Bump archived.', 'surecart')
					: __('Bump un-archived.', 'surecart'),
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
								{bump?.archived
									? __('Un-Archive', 'surecart')
									: __('Archive', 'surecart')}
							</ScMenuItem>
							<ScMenuItem onClick={onDelete}>
								{__('Delete', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
					<SaveButton busy={!hasLoadedBump || savingBump}>
						{__('Save Order Bump', 'surecart')}
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
						href="admin.php?page=sc-bumps"
					>
						<sc-icon name="arrow-left"></sc-icon>
					</ScButton>
					<ScBreadcrumbs>
						<ScBreadcrumb>
							<Logo display="block" />
						</ScBreadcrumb>
						<ScBreadcrumb href="admin.php?page=sc-bumps">
							{__('Order Bumps', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb>
							{__('Edit Bump', 'surecart')}
						</ScBreadcrumb>
					</ScBreadcrumbs>
				</div>
			}
			sidebar={
				<>
					{/* <Preview bump={bump} loading={!hasLoadedBump} /> */}
					<Priority
						bump={bump}
						updateBump={editBump}
						loading={!hasLoadedBump}
					/>
				</>
			}
		>
			<>
				<Error error={saveBumpError || bumpError} margin="80px" />
				<Price
					bump={bump}
					updateBump={editBump}
					loading={!hasLoadedBump}
				/>
				<Conditions
					bump={bump}
					updateBump={editBump}
					loading={!hasLoadedBump}
				/>
				<Discount
					bump={bump}
					updateBump={editBump}
					loading={!hasLoadedBump}
				/>
				<Name
					bump={bump}
					updateBump={editBump}
					loading={!hasLoadedBump}
				/>
				<Description
					bump={bump}
					updateBump={editBump}
					loading={!hasLoadedBump}
				/>
				<CTA
					bump={bump}
					updateBump={editBump}
					loading={!hasLoadedBump}
				/>
			</>
		</UpdateModel>
	);
};
