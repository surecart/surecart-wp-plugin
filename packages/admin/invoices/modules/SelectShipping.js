/**
 * External dependencies.
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScFormatNumber,
	ScAlert,
	ScChoices,
	ScChoice,
	ScButton,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import EditAddress from './EditAddress';
import { useInvoice } from '../hooks/useInvoice';

export default () => {
	const { invoice, checkout, loading, isDraftInvoice, updateCheckout } =
		useInvoice();
	const [open, setOpen] = useState(false);

	if (!checkout?.selected_shipping_choice_required) {
		return null;
	}

	if (!checkout?.shipping_choices?.data?.length) {
		if (!checkout?.shipping_address?.country) {
			return (
				<Box title={__('Shipping', 'surecart')} loading={loading}>
					<ScAlert type="warning" open>
						{__(
							'Shipping is required. Please enter a shipping address.',
							'surecart'
						)}
						<br />
						<ScButton onClick={() => setOpen(true)}>
							{__('Add A Shipping Address', 'surecart')}
						</ScButton>
					</ScAlert>
					<EditAddress
						invoice={invoice}
						checkout={checkout}
						open={open}
						onRequestClose={() => setOpen(false)}
					/>
				</Box>
			);
		}
		return (
			<Box title={__('Shipping', 'surecart')} loading={loading}>
				<ScAlert type="warning" open>
					{__(
						'The products in this invoice cannot be shipped to the provided address.',
						'surecart'
					)}
				</ScAlert>
			</Box>
		);
	}

	if (!isDraftInvoice) {
		return null;
	}

	return (
		<Box title={__('Shipping', 'surecart')} loading={loading}>
			<ScChoices
				onScChange={(e) => {
					updateCheckout({
						selected_shipping_choice: e?.target?.value,
						customer_id: checkout?.customer_id,
					});
				}}
			>
				{(checkout?.shipping_choices?.data || []).map(
					({ id, amount, currency, shipping_method }) => {
						return (
							<ScChoice
								key={id}
								value={id}
								checked={
									checkout?.selected_shipping_choice === id
								}
							>
								{shipping_method?.name ||
									__('Shipping', 'surecart')}

								{!!shipping_method?.description && (
									<div slot="description">
										{shipping_method?.description}
									</div>
								)}

								<div slot="price">
									{!!amount ? (
										<ScFormatNumber
											type="currency"
											currency={currency}
											value={amount}
										/>
									) : (
										__('Free', 'surecart')
									)}
								</div>
							</ScChoice>
						);
					}
				)}
			</ScChoices>
		</Box>
	);
};
