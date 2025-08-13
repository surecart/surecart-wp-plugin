/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Modal } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { ScButton, ScForm, ScTextarea } from '@surecart/components-react';

export default function LineItemNoteModal({
	add = true,
	setModal,
	onSaveNote,
	initialValue = '',
	error = '',
}) {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	const handleSave = (e) => {
		e.preventDefault();
		onSaveNote(value);
	};
	return (
		<Modal
			title={
				add ? __('Add note', 'surecart') : __('Edit note', 'surecart')
			}
			css={css`
				max-width: 500px !important;
			`}
			onRequestClose={() => setModal(false)}
			shouldCloseOnClickOutside={false}
		>
			<ScForm
				onScFormSubmit={handleSave}
				css={css`
					--sc-form-row-spacing: var(--sc-spacing-large);
				`}
			>
				{error && (
					<sc-alert type="danger" open={!!error}>
						{error}
					</sc-alert>
				)}

				<ScTextarea
					autofocus
					value={value}
					placeholder={__('Add a note...', 'surecart')}
					onScInput={(e) => setValue(e.target.value)}
					rows="4"
					css={css`
						font-size: 12px;
					`}
				/>

				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<ScButton type="primary" submit>
						{__('Save', 'surecart')}
					</ScButton>
					<ScButton type="text" onClick={() => setModal(false)}>
						{__('Cancel', 'surecart')}
					</ScButton>
				</div>
			</ScForm>
		</Modal>
	);
}
