/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { select, useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDrawer,
	ScForm,
	ScInput,
	ScTextarea,
} from '@surecart/components-react';
import Error from '../../components/Error';

export default ({ affiliation, open, onRequestClose }) => {
	const [error, setError] = useState(null);
	const [busy, setBusy] = useState(false);
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		email: '',
		payout_email: '',
		url: '',
		bio: '',
	});

	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	// Reset form data when affiliation changes or drawer opens
	useEffect(() => {
		if (affiliation && open) {
			setFormData({
				first_name: affiliation.first_name || '',
				last_name: affiliation.last_name || '',
				email: affiliation.email || '',
				payout_email: affiliation.payout_email || '',
				url: affiliation.url || '',
				bio: affiliation.bio || '',
			});
			setError(null);
		}
	}, [affiliation, open]);

	const updateFormData = (data) => {
		setFormData((prev) => ({ ...prev, ...data }));
	};

	const onSubmit = async () => {
		try {
			setBusy(true);
			setError(null);

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'affiliation'
			);

			const updatedAffiliation = await apiFetch({
				path: addQueryArgs(`${baseURL}/${affiliation?.id}`),
				method: 'PATCH',
				data: formData,
			});

			receiveEntityRecords(
				'surecart',
				'affiliation',
				updatedAffiliation,
				undefined,
				false
			);

			createSuccessNotice(__('Affiliate updated.', 'surecart'), {
				type: 'snackbar',
			});

			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e);
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
						gap: var(--sc-spacing-medium);
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
							value={formData.first_name}
							required
							onScInput={(e) =>
								updateFormData({ first_name: e.target.value })
							}
						/>

						<ScInput
							label={__('Last Name', 'surecart')}
							value={formData.last_name}
							onScInput={(e) =>
								updateFormData({ last_name: e.target.value })
							}
						/>
					</div>

					<ScInput
						label={__('Email', 'surecart')}
						value={formData.email}
						type="email"
						required
						onScInput={(e) =>
							updateFormData({ email: e.target.value })
						}
					/>

					<ScInput
						label={__('Payout Email', 'surecart')}
						value={formData.payout_email}
						type="email"
						required
						onScInput={(e) =>
							updateFormData({ payout_email: e.target.value })
						}
					/>

					<ScInput
						value={formData.url}
						label={__('Website', 'surecart')}
						onScInput={(e) =>
							updateFormData({ url: e.target.value })
						}
						type="url"
					/>

					<ScTextarea
						label={__('Bio', 'surecart')}
						onScInput={(e) =>
							updateFormData({ bio: e.target.value })
						}
						value={formData.bio}
					/>
				</div>

				<ScButton type="primary" slot="footer" submit busy={busy}>
					{__('Save', 'surecart')}
				</ScButton>
				<ScButton type="text" slot="footer" onClick={onRequestClose}>
					{__('Cancel', 'surecart')}
				</ScButton>
			</ScDrawer>
		</ScForm>
	);
};
