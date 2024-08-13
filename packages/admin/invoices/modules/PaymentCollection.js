/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import PaymentMethods from './PaymentMethods';
import Box from '../../ui/Box';
import { ScButton, ScSwitch } from '@surecart/components-react';

export default ({
	invoice,
	updateInvoice,
	checkout,
	loading,
	setBusy,
	paymentMethod,
	setPaymentMethod,
}) => {
	const [modal, setModal] = useState(false);
	const isDraftInvoice = invoice?.status === 'draft';

	return (
		<Box
			loading={loading}
			css={css`
				margin-top: 1rem;
			`}
			title={__('Payment Collection', 'surecart')}
		>
			<ScSwitch
				checked={invoice?.automatic_collection}
				onScChange={() =>
					updateInvoice({
						automatic_collection: !invoice?.automatic_collection,
					})
				}
				disabled={!isDraftInvoice}
			>
				{__('Autocharge customer', 'surecart')}
				<span slot="description">
					{__(
						'Automatically charge a payment method on file for this customer.',
						'surecart'
					)}
				</span>
			</ScSwitch>

			{!invoice?.automatic_collection && (
				<>
					<PaymentMethods
						open={modal === 'payment'}
						onRequestClose={() => setModal(null)}
						customerId={checkout?.customer_id}
						paymentMethod={paymentMethod}
						setPaymentMethod={setPaymentMethod}
					/>

					{isDraftInvoice && (
						<div>
							<ScButton
								type="primary"
								onClick={() => setModal('payment')}
							>
								{__('Add Payment Method', 'surecart')}
							</ScButton>
						</div>
					)}
				</>
			)}
		</Box>
	);
};
