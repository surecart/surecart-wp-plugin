import { __ } from '@wordpress/i18n';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScRadio,
	ScRadioGroup,
	ScStripePaymentElement,
	ScTag,
} from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import PaymentMethod from './PaymentMethod';
import { useState } from 'react';

export default ({
	open,
	setOpen,
	customerId,
	paymentMethodId,
	updatePaymentMethod,
}) => {
	const [paymentMethod, setPaymentMethod] = useState(paymentMethodId);

	const { payment_methods, loading } = useSelect(
		(select) => {
			if (!open) return {};
			const queryArgs = [
				'surecart',
				'payment_method',
				{
					context: 'edit',
					customer_ids: [customerId],
					expand: ['card'],
					per_page: 100,
				},
			];
			return {
				payment_methods: select(coreStore).getEntityRecords(
					...queryArgs
				),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[customerId, open]
	);

	return (
		<ScDialog
			label={__('Update Payment Method', 'surecart')}
			open={open}
			onScRequestClose={() => setOpen(false)}
		>
			<ScRadioGroup onScChange={(e) => setPaymentMethod(e.target.value)}>
				{(payment_methods || []).map((payment_method) => {
					return (
						<ScRadio
							style={{ display: 'block' }}
							value={payment_method?.id}
							checked={payment_method?.id === paymentMethod}
						>
							<PaymentMethod paymentMethod={payment_method}>
								{payment_method?.id === paymentMethodId && (
									<ScTag type="info">
										{__('Current', 'surecart')}
									</ScTag>
								)}
							</PaymentMethod>
						</ScRadio>
					);
				})}
				{/* <ScRadio
					value={null}
					checked={paymentMethod === null}
					style={{ display: 'block' }}
				>
					{__('Add New Payment Method', 'surecart')}
				</ScRadio> */}
			</ScRadioGroup>
			{loading && <ScBlockUi spinner />}
			<ScButton
				type="primary"
				onClick={() => updatePaymentMethod(paymentMethod)}
				slot="footer"
			>
				{__('Update', 'surecart')}
			</ScButton>
			<ScButton type="text" onClick={() => setOpen(false)} slot="footer">
				{__('Cancel', 'surecart')}
			</ScButton>
		</ScDialog>
	);
};
