/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScButton, ScTextarea } from '@surecart/components-react';

export default ({ onRequestClose, invoice, updateInvoice }) => {
	const isDraftInvoice = invoice?.status === 'draft';

	return (
		<Modal
			title={__('Edit Footer', 'surecart')}
			css={css`
				max-width: 500px !important;
			`}
			overlayClassName={'sc-modal-overflow'}
			onRequestClose={onRequestClose}
		>
			<ScTextarea
				onScChange={(e) => {
					updateInvoice({
						footer: e.target.value,
					});
				}}
				value={invoice?.footer}
				name="footer"
				placeholder={__(
					'Add a footer text to this invoice.',
					'surecart'
				)}
				css={css`
					margin-bottom: var(--sc-spacing-small);
				`}
				{...(!isDraftInvoice && { disabled: true })}
			/>

			<div
				css={css`
					display: flex;
					align-items: center;
					gap: 0.5em;
				`}
			>
				<ScButton type="primary" onClick={onRequestClose}>
					{__('Confirm', 'surecart')}
				</ScButton>
			</div>
		</Modal>
	);
};
