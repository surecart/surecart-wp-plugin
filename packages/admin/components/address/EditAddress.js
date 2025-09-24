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
	ScCheckbox,
	ScDrawer,
	ScForm,
} from '@surecart/components-react';
import Error from '../Error';

export default ({
	buttonText,
	shippingAddress,
	setShippingAddress,
	billingAddress,
	setBillingAddress,
	billingMatchesShipping,
	setBillingMatchesShipping,
	billingAddressRequired,
	shippingAddressRequired,
	error,
	setError,
	onSubmit,
	open,
	onRequestClose,
	busy,
	title,
}) => {
	return (
		<ScForm
			onScSubmit={onSubmit}
			onScFormSubmit={(e) => {
				e.stopImmediatePropagation();
			}}
		>
			<ScDrawer
				label={title}
				open={open}
				onScAfterHide={onRequestClose}
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
						label={__('Shipping Address', 'surecart')}
						address={shippingAddress}
						onScChangeAddress={(e) => setShippingAddress(e.detail)}
						showLine2
						showName
						required={shippingAddressRequired}
						defaultCountryFields={scData.i18n.defaultCountryFields}
					/>

					<ScCheckbox
						css={css`
							padding-top: var(--sc-spacing-large);
							padding-bottom: var(--sc-spacing-small);
						`}
						checked={billingMatchesShipping}
						onScChange={(e) =>
							setBillingMatchesShipping(e.target.checked)
						}
					>
						{__(
							'Billing address is same as shipping address',
							'surecart'
						)}
					</ScCheckbox>

					{!billingMatchesShipping && (
						<ScAddress
							label={__('Billing Address', 'surecart')}
							address={billingAddress}
							onScChangeAddress={(e) =>
								setBillingAddress(e.detail)
							}
							showLine2
							showName
							required={billingAddressRequired}
							defaultCountryFields={
								scData.i18n.defaultCountryFields
							}
						/>
					)}
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
