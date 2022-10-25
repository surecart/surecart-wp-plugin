import {
	ScAlert,
	ScCard,
	ScIcon,
	ScPaymentMethodChoice,
	ScSecureNotice,
	ScStripeElement,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from 'react';

export default ({ attributes: { secure_notice, disabled_methods }, mode }) => {
	const [processor, setProcessor] = useState();

	useEffect(() => {
		setProcessor(
			(scBlockData?.processors || []).find(
				(processor) =>
					processor?.live_mode === false &&
					processor?.processor_type === 'stripe'
			)
		);
	}, [mode]);

	if (!processor) {
		return null;
	}

	if ((disabled_methods || []).includes('stripe')) {
		return null;
	}

	return (
		<ScPaymentMethodChoice processor-id="stripe">
			<span slot="summary" class="sc-payment-toggle-summary">
				<ScIcon name="credit-card" style={{ fontSize: '24px' }} />
				<span>{__('Credit Card', 'surecart')}</span>
			</span>
			<div class="sc-payment__stripe-card-element">
				{!!scBlockData?.beta?.stripe_payment_element ? (
					<ScCard>
						<ScAlert open type="info">
							{__(
								'Please preview the form on the front-end to load the Stripe payment element fields.',
								'surecart'
							)}
						</ScAlert>
					</ScCard>
				) : (
					!!processor?.processor_data?.publishable_key &&
					processor?.processor_data?.account_id && (
						<div class="sc-payment__stripe-card-element">
							<ScStripeElement
								mode={'test'}
								publishableKey={
									processor?.processor_data?.publishable_key
								}
								accountId={
									processor?.processor_data?.account_id
								}
								secureText={secure_notice}
							/>
							<ScSecureNotice>{secure_notice}</ScSecureNotice>
						</div>
					)
				)}
			</div>
		</ScPaymentMethodChoice>
	);
};
