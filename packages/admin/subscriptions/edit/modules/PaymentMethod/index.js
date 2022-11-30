import Box from '../../../../ui/Box';
import EditPaymentMethod from './EditPaymentMethod';
import {
	ScButton,
	ScFlex,
	ScIcon,
	ScCard,
	ScPaymentMethod,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from 'react';
import { useSelect } from '@wordpress/data';

export default ({ subscription, updateSubscription, loading }) => {
	const id = subscription?.payment_method?.id || subscription?.payment_method;
	const [edit, setEdit] = useState();

	const { payment_method, hasLoadedPaymentmethod } = useSelect(
		(select) => {
			const entityData = [
				'surecart',
				'payment_method',
				id,
				{
					expand: [
						'card',
						'payment_instrument',
						'paypal_account',
						'bank_account',
					],
					t: id, // force refetch to fix bug.
				},
			];

			return {
				payment_method: select(coreStore).getEntityRecord(
					...entityData
				),
				hasLoadedPaymentmethod: select(
					coreStore
				)?.hasFinishedResolution?.('getEntityRecord', [
					...entityData,
				]),
			};
		},
		[id]
	);

	return (
		<Box
			title={__('Payment Method', 'surecart')}
			loading={loading || !hasLoadedPaymentmethod}
		>
			<ScCard>
				<ScFlex
					alignItems="center"
					justifyContent="flex-start"
					style={{ gap: '0.5em' }}
				>
					<ScPaymentMethod paymentMethod={payment_method} />
					<div>
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
					<ScButton type="text" circle onClick={() => setEdit(true)}>
						<ScIcon name="edit-2" />
					</ScButton>
				</ScFlex>
			</ScCard>
			<EditPaymentMethod
				open={edit}
				setOpen={setEdit}
				customerId={
					subscription?.customer?.id || subscription?.customer
				}
				paymentMethodId={
					subscription?.payment_method?.id ||
					subscription?.payment_method
				}
				updatePaymentMethod={(payment_method) => {
					updateSubscription({
						payment_method,
					});
					setEdit(false);
				}}
			/>
		</Box>
	);
};
