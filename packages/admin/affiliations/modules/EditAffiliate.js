/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import {
	ScBlockUi,
	ScButton,
	ScDrawer,
	ScForm,
	ScInput,
	ScTextarea,
} from '@surecart/components-react';
import Error from '../../components/Error';
import useSave from '../../settings/UseSave';

export default ({ affiliation, open, onRequestClose }) => {
	const [error, setError] = useState(null);
	const [busy, setBusy] = useState(false);

	const { save } = useSave();
	const { editEntityRecord } = useDispatch(coreStore);
	const { createErrorNotice } = useDispatch(noticesStore);

	// Get the edited entity record (includes unsaved changes)
	const editedAffiliation = useSelect(
		(select) =>
			affiliation?.id
				? select(coreStore).getEditedEntityRecord(
						'surecart',
						'affiliation',
						affiliation.id
				  )
				: {},
		[affiliation?.id]
	);

	// Update the entity record directly
	const updateAffiliation = (data) =>
		editEntityRecord('surecart', 'affiliation', affiliation?.id, data);

	const onSubmit = async () => {
		if (busy) return;

		try {
			setBusy(true);
			setError(null);

			// Save all dirty entity records to the server
			await save({
				successMessage: __('Affiliate updated.', 'surecart'),
			});

			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e);
			createErrorNotice(e?.message, { type: 'snackbar' });
		} finally {
			setBusy(false);
		}
	};

	if (!open) return null;

	return (
		<ScForm onScFormSubmit={onSubmit}>
			<ScDrawer
				label={__('Edit Affiliate', 'surecart')}
				style={{ '--sc-drawer-size': '32rem' }}
				open={open}
				onScAfterHide={onRequestClose}
				stickyHeader
				stickyFooter
			>
				<div
					css={css`
						display: grid;
						gap: var(--sc-spacing-large);
						padding: var(--sc-spacing-x-large);
					`}
				>
					<Error error={error} setError={setError} />

					<div
						css={css`
							display: grid;
							gap: var(--sc-form-row-spacing);
							grid-template-columns: 1fr 1fr;
						`}
					>
						<ScInput
							label={__('First Name', 'surecart')}
							value={editedAffiliation?.first_name || ''}
							required
							onScInput={(e) =>
								updateAffiliation({
									first_name: e.target.value,
								})
							}
						/>

						<ScInput
							label={__('Last Name', 'surecart')}
							value={editedAffiliation?.last_name || ''}
							onScInput={(e) =>
								updateAffiliation({ last_name: e.target.value })
							}
						/>
					</div>

					<ScInput
						label={__('Email', 'surecart')}
						value={editedAffiliation?.email || ''}
						type="email"
						required
						onScInput={(e) =>
							updateAffiliation({ email: e.target.value })
						}
					/>

					<ScInput
						label={__('Payout Email', 'surecart')}
						value={editedAffiliation?.payout_email || ''}
						type="email"
						required
						onScInput={(e) =>
							updateAffiliation({ payout_email: e.target.value })
						}
					/>

					<ScInput
						value={editedAffiliation?.url || ''}
						label={__('Website', 'surecart')}
						onScInput={(e) =>
							updateAffiliation({ url: e.target.value })
						}
						type="url"
					/>

					<ScTextarea
						label={__('Bio', 'surecart')}
						onScInput={(e) =>
							updateAffiliation({ bio: e.target.value })
						}
						value={editedAffiliation?.bio || ''}
					/>
				</div>

				<ScButton type="primary" slot="footer" submit busy={busy}>
					{__('Save', 'surecart')}
				</ScButton>
				<ScButton type="text" slot="footer" onClick={onRequestClose}>
					{__('Cancel', 'surecart')}
				</ScButton>

				{busy && <ScBlockUi spinner></ScBlockUi>}
			</ScDrawer>
		</ScForm>
	);
};
