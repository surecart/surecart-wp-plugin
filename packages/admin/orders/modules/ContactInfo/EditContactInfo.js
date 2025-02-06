/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScDrawer,
	ScForm,
	ScInput,
	ScPhoneInput,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import Error from '../../../components/Error';
import { useEffect, useRef, useState } from '@wordpress/element';

export default ({ open, checkout, onRequestClose, onManuallyRefetchOrder }) => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const [error, setError] = useState(false);
	const [busy, setBusy] = useState(false);
	const name = useRef();

	useEffect(() => {
		if (name.current) {
			setTimeout(() => {
				name.current.triggerFocus();
			}, 50);
		}
	}, [name]);

	const [info, setInfo] = useState({
		first_name: checkout?.first_name || '',
		last_name: checkout?.last_name || '',
		phone: checkout?.phone || '',
		email: checkout?.email || '',
	});

	useEffect(() => {
		setInfo({
			first_name: checkout?.first_name || '',
			last_name: checkout?.last_name || '',
			phone: checkout?.phone || '',
			email: checkout?.email || '',
		});
	}, [checkout]);

	const onSubmit = async () => {
		try {
			setError(false);
			setBusy(true);
			// update the checkout
			await saveEntityRecord(
				'surecart',
				'checkout',
				{
					id: checkout?.id,
					...(info || {}),
				},
				{
					throwOnError: true,
				}
			);
			await onManuallyRefetchOrder();
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	return (
		<ScForm
			onScFormSubmit={onSubmit}
			css={css`
				--sc-form-row-spacing: var(--sc-spacing-large);
			`}
		>
			<ScDrawer
				label={__('Update Contact Information', 'surecart')}
				open={open}
				css={css`
					max-width: 500px !important;
				`}
				onScAfterHide={onRequestClose}
			>
				<div
					css={css`
						display: grid;
						gap: var(--sc-spacing-medium);
						padding: var(--sc-spacing-x-large);
					`}
				>
					<p
						css={css`
							margin-top: 0;
							color: var(--sc-input-help-text-color);
						`}
					>
						{__(
							'Update the contact information for this order.',
							'surecart'
						)}
					</p>
					<Error error={error} setError={setError} />
					<ScInput
						autofo
						label={__('First Name', 'surecart')}
						value={info.first_name}
						onScInput={(e) =>
							setInfo({
								...info,
								first_name: e.target.value,
							})
						}
						tabIndex="0"
						autofocus
					/>

					<ScInput
						label={__('Last Name', 'surecart')}
						value={info.last_name}
						onScInput={(e) =>
							setInfo({
								...info,
								last_name: e.target.value,
							})
						}
						tabIndex="0"
					/>

					<ScPhoneInput
						label={__('Phone', 'surecart')}
						value={info.phone}
						onScInput={(e) =>
							setInfo({
								...info,
								phone: e.target.value,
							})
						}
						tabIndex="0"
					/>

					<ScInput
						label={__('Email', 'surecart')}
						type="email"
						value={info.email}
						onScInput={(e) =>
							setInfo({
								...info,
								email: e.target.value,
							})
						}
						tabIndex="0"
						required
					/>
				</div>

				<ScButton type="primary" busy={busy} submit slot="footer">
					{__('Update', 'surecart')}
				</ScButton>
				<ScButton type="text" onClick={onRequestClose} slot="footer">
					{__('Cancel', 'surecart')}
				</ScButton>
				{busy && <ScBlockUi spinner />}
			</ScDrawer>
		</ScForm>
	);
};
