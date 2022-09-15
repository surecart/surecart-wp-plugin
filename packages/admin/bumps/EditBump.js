/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
} from '@surecart/components-react';
import { store } from '@surecart/data';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect } from 'react';

import Error from '../components/Error';
// hocs
import useEntity from '../hooks/useEntity';
import Logo from '../templates/Logo';
import SaveButton from '../templates/SaveButton';
// template
import UpdateModel from '../templates/UpdateModel';
import Conditions from './modules/Conditions';
import Name from './modules/Name';
import Price from './modules/Price';
import Priority from './modules/Priority';
// import ActionsDropdown from './components/product/ActionsDropdown';
// import SaveButton from './components/product/SaveButton';
// import Details from './modules/Details';
// import Downloads from './modules/Downloads';
// import Integrations from './modules/integrations/Integrations';
// import Licensing from './modules/Licensing';
// import Prices from './modules/Prices';
// import Sidebar from './Sidebar';

export default () => {
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const id = useSelect((select) => select(store).selectPageId());
	const {
		bump,
		editBump,
		hasLoadedBump,
		saveEditedBump,
		savingBump,
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

	return (
		<UpdateModel
			onSubmit={onSubmit}
			button={
				<SaveButton busy={!hasLoadedBump || savingBump}>
					{__('Save Order Bump', 'surecart')}
				</SaveButton>
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
				<Name
					bump={bump}
					updateBump={editBump}
					loading={!hasLoadedBump}
				/>
			</>
		</UpdateModel>
	);
};
