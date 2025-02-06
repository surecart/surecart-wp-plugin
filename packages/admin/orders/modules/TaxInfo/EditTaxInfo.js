/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScBlockUi,
	ScButton,
	ScDrawer,
	ScForm,
	ScTaxIdInput,
} from '@surecart/components-react';
import Error from '../../../components/Error';

export default ({
	open,
	checkout,
	busy,
	error,
	setError,
	onRequestClose,
	onSubmit,
}) => {
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

	const label = !!checkout?.tax_identifier
		? __('Update Tax Information', 'surecart')
		: __('Add Tax Information', 'surecart');

	return (
		<ScForm
			onScFormSubmit={() => onSubmit(info)}
			css={css`
				--sc-form-row-spacing: var(--sc-spacing-large);
			`}
		>
			<ScDrawer
				label={label}
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
						{!!checkout?.tax_identifier
							? __(
									'Update the tax information for this order.',
									'surecart'
							  )
							: __(
									'Add tax information for this order.',
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
					{!!checkout?.tax_identifier
						? __('Update', 'surecart')
						: __('Save', 'surecart')}
				</ScButton>
				<ScButton type="text" onClick={onRequestClose} slot="footer">
					{__('Cancel', 'surecart')}
				</ScButton>
				{busy && <ScBlockUi spinner />}
			</ScDrawer>
		</ScForm>
	);
};
