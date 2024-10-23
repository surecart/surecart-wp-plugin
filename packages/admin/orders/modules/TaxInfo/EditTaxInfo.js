/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScDrawer,
	ScForm,
	ScTaxIdInput,
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
		number: checkout?.tax_identifier?.number || '',
		number_type: checkout?.tax_identifier?.number_type || 'other',
	});

	useEffect(() => {
		setInfo({
			number: checkout?.tax_identifier?.number || '',
			number_type: checkout?.tax_identifier?.number_type || 'other',
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
					tax_identifier: info,
				},
				{
					throwOnError: true,
				}
			);
			await onManuallyRefetchOrder();
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e.message);
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
				label={__('Update Tax Information', 'surecart')}
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
							'Update the tax information for this order.',
							'surecart'
						)}
					</p>
					<Error error={error} setError={setError} />
					<ScTaxIdInput
						number={info?.number}
						type={info?.number_type}
						onScChange={(e) => setInfo(e.detail)}
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
