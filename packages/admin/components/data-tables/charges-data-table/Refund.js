/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { Modal, Button } from '@wordpress/components';
import {
	CeCheckbox,
	CeForm,
	CeFormControl,
	CePriceInput,
	CeSelect,
	CeSwitch,
} from '@checkout-engine/components-react';
import { css, jsx } from '@emotion/core';

export default ({ purchases, charge, onRequestClose }) => {
	const onSubmit = () => {
		console.log('submit');
	};
	return (
		<Modal
			title={__('Refund Payment', 'checkout_engine')}
			css={css`
				max-width: 500px !important;
			`}
		>
			<CeForm
				onCeFormSubmit={onSubmit}
				css={css`
					display: grid;
					gap: 1em;
				`}
			>
				<ce-alert type="info" open>
					{__(
						"Refunds can take 5-10 days to appear on a customer's statement. Processor fees are typically not returned.",
						'checkout_engine'
					)}
				</ce-alert>
				<div>
					<CePriceInput
						required
						label={__('Refund', 'checkout_engine')}
						currencyCode={charge?.currency}
						value={charge?.amount}
						max={charge?.amount}
						showCode
					/>
				</div>
				<div>
					<CeFormControl label={__('Reason', 'checkout_engine')}>
						<CeSelect
							placeholder={__(
								'Select a reason',
								'checkout_engine'
							)}
							choices={[
								{
									label: __('Duplicate'),
									value: 'duplicate',
								},
								{
									label: __('Fraudulent'),
									value: 'fraudulent',
								},
								{
									label: __('Requested By Customer'),
									value: 'requested_by_customer',
								},
							]}
						/>
					</CeFormControl>
				</div>

				<CeFormControl
					label={__('Revoke Purchases', 'checkout_engine')}
					css={css`
						display: grid;
						gap: 1em;
					`}
				>
					{(purchases || []).map((purchase) => (
						<CeCheckbox>
							{purchase?.product?.name}{' '}
							<span slot="description">
								{purchase?.product?.price?.amount}
							</span>
						</CeCheckbox>
					))}
				</CeFormControl>

				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<Button isPrimary type="submit">
						{__('Refund', 'checkout_engine')}
					</Button>
					<Button onClick={onRequestClose}>
						{__('Cancel', 'checkout_engine')}
					</Button>
				</div>
			</CeForm>
		</Modal>
	);
};
