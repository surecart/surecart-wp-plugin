import {
	ScCard,
	ScIcon,
	ScPaymentMethodChoice,
	ScPaymentSelected,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from 'react';
import { hasProcessor } from '../util';

export default ({ attributes: { disabled_methods = [] }, mode }) => {
	const [processor, setProcessor] = useState();

	useEffect(() => {
		setProcessor(
			(scBlockData?.processors || []).find(
				(processor) =>
					processor?.live_mode === (mode === 'live') &&
					processor?.processor_type === 'paypal'
			)
		);
	}, [mode]);

	const hasStripe = () => {
		if (!hasProcessor('stripe')) {
			return false;
		}
		return (disabled_methods || []).includes('stripe');
	};

	if (!processor) {
		return null;
	}

	if ((disabled_methods || []).includes('paypal')) {
		return null;
	}

	return (
		<>
			{hasStripe() && (
				<ScPaymentMethodChoice processor-id="paypal-card">
					<span slot="summary" class="sc-payment-toggle-summary">
						<ScIcon
							name="credit-card"
							style={{ fontSize: '24px' }}
						/>
						<span>{__('Credit Card', 'surecart')}</span>
					</span>
					<ScCard>
						<ScPaymentSelected
							label={__(
								'Credit Card selected for check out.',
								'surecart'
							)}
						>
							<ScIcon
								slot="icon"
								name="credit-card"
								style={{ width: '24px' }}
							/>

							{__(
								'Another step will appear after submitting your order to complete your purchase details.',
								'surecart'
							)}
						</ScPaymentSelected>
					</ScCard>
				</ScPaymentMethodChoice>
			)}

			<ScPaymentMethodChoice processor-id="paypal">
				<span slot="summary" class="sc-payment-toggle-summary">
					<ScIcon
						name="paypal"
						style={{
							width: '80px',
							fontSize: '24px',
						}}
					/>
				</span>
				<ScCard>
					<ScPaymentSelected
						label={__('PayPal selected for check out.', 'surecart')}
					>
						<ScIcon
							slot="icon"
							name="paypal"
							style={{ width: '80px' }}
						/>

						{__(
							'Another step will appear after submitting your order to complete your purchase details.',
							'surecart'
						)}
					</ScPaymentSelected>
				</ScCard>
			</ScPaymentMethodChoice>
		</>
	);
};
