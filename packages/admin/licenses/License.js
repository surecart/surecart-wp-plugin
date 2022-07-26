/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { store } from '@surecart/data';
import { store as coreStore } from '@wordpress/core-data';

// template
import UpdateModel from '../templates/UpdateModel';
import Logo from '../templates/Logo';
import Error from '../components/Error';

// hocs
import useEntity from '../hooks/useEntity';
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
} from '@surecart/components-react';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

import Details from './modules/Details';
import Activations from './modules/Activations';
import Customer from './modules/Customer';
import Purchase from './modules/Purchase';
import SaveButton from '../templates/SaveButton';

export default () => {
	const { createSuccessNotice } = useDispatch(noticesStore);
	const id = useSelect((select) => select(store).selectPageId());
	const {
		license,
		editLicense,
		hasLoadedLicense,
		saveEditedLicense,
		savingLicense,
		saveLicenseError,
		licenseError,
	} = useEntity('license', id);

	/**
	 * Handle the form submission
	 */
	const onSubmit = async () => {
		const license = await saveEditedLicense();
		if (!license) return;
		createSuccessNotice(__('License updated.', 'surecart'), {
			type: 'snackbar',
		});
	};

	return (
		<UpdateModel
			onSubmit={onSubmit}
			button={
				<SaveButton busy={!hasLoadedLicense || savingLicense}>
					{__('Save License', 'surecart')}
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
						href="admin.php?page=sc-licenses"
					>
						<sc-icon name="arrow-left"></sc-icon>
					</ScButton>
					<ScBreadcrumbs>
						<ScBreadcrumb>
							<Logo display="block" />
						</ScBreadcrumb>
						<ScBreadcrumb href="admin.php?page=sc-licenses">
							{__('Licenses', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb>
							{__('View License', 'surecart')}
						</ScBreadcrumb>
					</ScBreadcrumbs>
				</div>
			}
			sidebar={
				<>
					<Customer
						loading={!hasLoadedLicense}
						customer={license?.purchase?.customer}
					/>
					<Purchase
						loading={!hasLoadedLicense}
						purchase={license?.purchase}
					/>
				</>
			}
		>
			<>
				<Error error={saveLicenseError || licenseError} margin="80px" />
				<Details
					license={license}
					updateLicense={(data) => editLicense(data)}
					loading={!hasLoadedLicense}
				/>
				<Activations id={id} license={license} />
			</>
		</UpdateModel>
	);
};
