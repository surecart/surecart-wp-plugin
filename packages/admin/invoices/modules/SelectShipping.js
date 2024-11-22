/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScFormatNumber,
	ScAlert,
	ScChoices,
	ScChoice,
} from '@surecart/components-react';
import Box from '../../ui/Box';
import { useInvoice } from '../hooks/useInvoice';

export default () => {
	const { checkout, loading, isDraftInvoice, updateCheckout } = useInvoice();

	// shipping choice is not required.
	if (!checkout?.selected_shipping_choice_required) {
		return null;
	}

	// shipping choice is required, but no shipping choices are available
	if (!checkout?.shipping_choices?.data?.length) {
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

	// shipping address is required.
	if (!checkout?.shipping_address?.country) {
		return (
			<Box title={__('Shipping', 'surecart')} loading={loading}>
				<ScAlert type="warning" open>
					{__(
						'A shipping address is required. Please enter a shipping address.',
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
