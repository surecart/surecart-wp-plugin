import { __ } from '@wordpress/i18n';
import {
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
				<ScChoices
					required
					onScChange={(e) => setSelectedPaymentMethod(e.target.value)}
				>
					{(payment_methods || []).map((payment_method) => {
						return (
							<ScChoice
								value={payment_method}
								checked={
									payment_method?.id ===
									selectedPaymentMethod?.id
								}
							>
								<ScPaymentMethod
									paymentMethod={payment_method}
								/>
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

				{loading && <ScBlockUi spinner />}

				<ScButton type="primary" submit slot="footer">
					{__('Choose', 'surecart')}
				</ScButton>

				<ScButton type="text" onClick={onRequestClose} slot="footer">
					{__('Cancel', 'surecart')}
				</ScButton>
			</ScDialog>
		</ScForm>
	);
};
