import { __ } from '@wordpress/i18n';
import {
	ScBlockUi,
	ScButton,
	ScChoice,
	ScChoices,
	ScDialog,
	ScPaymentMethod,
	ScTag,
} from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
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
					expand: [
						'card',
						'payment_instrument',
						'paypal_account',
						'bank_account',
					],
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
			<ScChoices onScChange={(e) => setPaymentMethod(e.target.value)}>
				{(payment_methods || []).map((payment_method) => {
					return (
						<ScChoice
							value={payment_method?.id}
							checked={payment_method?.id === paymentMethod}
						>
							<ScPaymentMethod paymentMethod={payment_method} />
							<div slot="description">
								{!!payment_method?.card?.exp_month && (
									<span>
										{__('Exp.', 'surecart')}
										{payment_method?.card?.exp_month}/
										{payment_method?.card?.exp_year}
									</span>
								)}
								{!!payment_method?.paypal_account?.email &&
									payment_method?.paypal_account?.email}
							</div>
							{payment_method?.id === paymentMethodId && (
								<ScTag type="info" slot="price">
									{__('Current', 'surecart')}
								</ScTag>
							)}
						</ScChoice>
					);
				})}
			</ScChoices>
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
