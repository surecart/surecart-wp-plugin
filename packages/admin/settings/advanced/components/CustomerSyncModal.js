import {
	ScAlert,
	ScBlockUi,
	ScButton,
	ScDialog,
	ScForm,
	ScSwitch,
} from '@surecart/components-react';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

export default ({ open, onRequestClose }) => {
	const [createUser, setCreateUser] = useState(true);
	const [runActions, setRunActions] = useState(true);
	const [saving, setSaving] = useState(false);

	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const submitForm = async () => {
		try {
			setSaving(true);
			await apiFetch({
				method: 'POST',
				path: '/surecart/v1/customers/sync',
				data: {
					create_user: createUser,
					run_actions: runActions,
				},
			});
			createSuccessNotice(
				__('Customer sync started in the background', 'surecart'),
				{
					type: 'snackbar',
				}
			);
			onRequestClose();
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} finally {
			setSaving(false);
		}
	};

	return (
		<ScDialog
			label={__('Customer Sync', 'surecart')}
			open={open}
			onRequestClose={onRequestClose}
		>
			<ScForm
				onScSubmit={(e) => {
					e.preventDefault();
					e.stopImmediatePropagation();
					submitForm();
				}}
				onScFormSubmit={(e) => {
					e.preventDefault();
					e.stopImmediatePropagation();
				}}
			>
				<ScAlert type="warning" open icon="info-circle">
					{__(
						'This will change your user data on your install. We recommend creating a backup of your site before running this.',
						'surecart'
					)}
				</ScAlert>
				<ScSwitch
					checked={createUser}
					onScChange={(e) => setCreateUser(e.target.checked)}
				>
					{__('Create WordPress Users', 'surecart')}
					<span slot="description">
						{__(
							'Create WordPress users if the user does not yet exist.',
							'surecart'
						)}
					</span>
				</ScSwitch>
				<ScSwitch
					checked={runActions}
					onScChange={(e) => setRunActions(e.target.checked)}
				>
					{__('Run purchase actions', 'surecart')}
					<span slot="description">
						{__(
							'Run any integration automations for purchases. This will run any actions that are set to run on purchase.',
							'surecart'
						)}
					</span>
				</ScSwitch>
				<div>
					<ScButton type="primary" submit busy={saving}>
						{__('Start Sync', 'surecart')}
					</ScButton>
					<ScButton type="text" onClick={onRequestClose}>
						{__('Cancel', 'surecart')}
					</ScButton>
				</div>
			</ScForm>
			{saving && <ScBlockUi spinner style={{ zIndex: 9 }} />}
		</ScDialog>
	);
};
