/** @jsx jsx */
/**
 * External dependencies.
 */
import { css, jsx } from '@emotion/react';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScAddress,
	ScBlockUi,
	ScButton,
	ScDrawer,
	ScForm,
} from '@surecart/components-react';
import Error from '../Error';

export default ({
	buttonText,
	address,
	setAddress,
	error,
	setError,
	onEditAddress,
	open,
	onRequestClose,
	busy,
	title,
}) => {
	return (
		<ScForm
			onScSubmit={onEditAddress}
			onScFormSubmit={(e) => {
				e.stopImmediatePropagation();
			}}
		>
			<ScDrawer
				label={title}
				open={open}
				onAfterHide={onRequestClose}
				css={css`
					width: 500px !important;
					.components-modal__content {
						overflow: visible !important;
					}

					@media (max-width: 782px) {
						width: 100% !important;

						.components-modal__content {
							overflow: visible !important;
						}
					}
				`}
			>
				<div
					css={css`
						display: grid;
						gap: var(--sc-spacing-medium);
						padding: var(--sc-spacing-x-large);
					`}
				>
					<Error error={error} setError={setError} />

					<ScAddress
						label={__('Address', 'surecart')}
						address={address}
						onScChangeAddress={(e) => setAddress(e.detail)}
						required
					/>
				</div>
				<ScButton type="primary" disabled={busy} submit slot="footer">
					{buttonText || __('Save Address', 'surecart')}
				</ScButton>
				<ScButton
					type="text"
					onClick={onRequestClose}
					disabled={busy}
					slot="footer"
				>
					{__('Cancel', 'surecart')}
				</ScButton>
				{busy && (
					<ScBlockUi
						style={{ '--sc-block-ui-opacity': '0.75' }}
						zIndex="9"
						spinner
					/>
				)}
			</ScDrawer>
		</ScForm>
	);
};
