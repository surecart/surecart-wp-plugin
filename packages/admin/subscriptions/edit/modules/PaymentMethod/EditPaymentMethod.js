import { __ } from '@wordpress/i18n';
import {
	ScBlockUi,
	ScButton,
	ScChoice,
	ScChoices,
	ScDialog,
	ScPaymentMethod,
	ScManualPaymentMethod,
	ScTag,
} from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from 'react';

export default ({
	open,
	setOpen,
	customerId,
	paymentMethod,
	manualPaymentMethod,
	updatePaymentMethod,
	manualPayment,
}) => {
	const [paymentMethodId, setPaymentMethod] = useState(
		manualPayment
			? manualPaymentMethod?.id || manualPaymentMethod
			: paymentMethod?.id || paymentMethod
	);

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

	const { manual_payment_methods, manualLoading } = useSelect(
		(select) => {
			if (!open) return {};
			const queryArgs = [
				'surecart',
				'manual_payment_method',
				{
					context: 'edit',
					customer_ids: [customerId],
					reusable: true,
					archived: false,
					per_page: 100,
				},
			];
			return {
				manual_payment_methods: select(coreStore).getEntityRecords(
					...queryArgs
				),
				manualLoading: select(coreStore).isResolving(
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
							checked={
								!manualPayment &&
								payment_method?.id === paymentMethodId
							}
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
							{payment_method?.id === paymentMethodId &&
								!manualPayment && (
									<ScTag type="info" slot="price">
										{__('Current', 'surecart')}
									</ScTag>
								)}
						</ScChoice>
					);
				})}
				{(manual_payment_methods || []).map((payment_method) => {
					return (
						<ScChoice
							value={payment_method?.id}
							checked={
								manualPayment &&
								payment_method?.id === manualPaymentMethod
							}
						>
							<ScManualPaymentMethod
								paymentMethod={payment_method}
								showDescription
							/>
							{payment_method?.id === manualPaymentMethod &&
								manualPayment && (
									<ScTag type="info" slot="price">
										{__('Current', 'surecart')}
									</ScTag>
								)}
						</ScChoice>
					);
				})}
			</ScChoices>
			{loading || (manualLoading && <ScBlockUi spinner />)}
			<ScButton
				type="primary"
				onClick={() => {
					const isManualPaymentMethod = manual_payment_methods.find(
						({ id }) => id === paymentMethodId
					);
					updatePaymentMethod({
						manual_payment: !!isManualPaymentMethod,
						payment_method: !isManualPaymentMethod
							? paymentMethodId
							: null,
						manual_payment_method: isManualPaymentMethod
							? paymentMethodId
							: null,
					});
				}}
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
