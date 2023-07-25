import { __ } from '@wordpress/i18n';
import {
	ScAlert,
	ScBlockUi,
	ScButton,
	ScChoice,
	ScChoices,
	ScDialog,
	ScForm,
	ScPaymentMethod,
	ScTag,
} from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useEffect, useState } from '@wordpress/element';

export default ({
	open,
	onRequestClose,
	customerId,
	paymentMethod,
	setPaymentMethod,
}) => {
	const [selectedPaymentMethod, setSelectedPaymentMethod] =
		useState(paymentMethod);

	useEffect(() => {
		setSelectedPaymentMethod(paymentMethod);
	}, [paymentMethod]);

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

	const reusablePaymentMethods = (payment_methods || [])?.filter(
		(payment_method) => payment_method?.reusable
	);

	/** Render the payment methods content. */
	const renderContent = () => {
		if (loading) {
			return <ScBlockUi spinner />;
		}

		if (!reusablePaymentMethods?.length) {
			if (payment_methods) {
				return (
					<ScAlert type="warning" open>
						{__(
							'This customer does not have any payment methods that are reusable. This means we cannot charge this customer without them entering their payment details again. Please ask the customer to add a payment method to their account, or use a manual payment method.',
							'surecart'
						)}
					</ScAlert>
				);
			}

			return (
				<ScAlert type="warning" open>
					{__('No payment methods found.', 'surecart')}
				</ScAlert>
			);
		}

		return (
			<ScChoices
				required
				onScChange={(e) => setSelectedPaymentMethod(e.target.value)}
			>
				{(reusablePaymentMethods || []).map((payment_method) => {
					return (
						<ScChoice
							value={payment_method}
							checked={
								payment_method?.id === selectedPaymentMethod?.id
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
							{payment_method?.id === paymentMethod?.id && (
								<ScTag type="info" slot="price">
									{__('Current', 'surecart')}
								</ScTag>
							)}
						</ScChoice>
					);
				})}
			</ScChoices>
		);
	};

	return (
		<ScForm
			onScFormSubmit={(e) => {
				e.preventDefault();
				e.stopImmediatePropagation();
				setPaymentMethod(selectedPaymentMethod);
				onRequestClose();
			}}
		>
			<ScDialog
				label={__('Add Payment Method', 'surecart')}
				open={open}
				onScRequestClose={onRequestClose}
			>
				{renderContent()}

				<ScButton
					type="primary"
					submit
					slot="footer"
					disabled={!selectedPaymentMethod}
				>
					{__('Choose', 'surecart')}
				</ScButton>

				<ScButton type="text" onClick={onRequestClose} slot="footer">
					{__('Cancel', 'surecart')}
				</ScButton>
			</ScDialog>
		</ScForm>
	);
};
