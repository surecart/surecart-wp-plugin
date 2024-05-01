import Box from '../../../../ui/Box';
import EditPaymentMethod from './EditPaymentMethod';
import {
	ScFlex,
	ScCard,
	ScPaymentMethodDetails,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from 'react';
import { useSelect } from '@wordpress/data';
import ManualPaymentMethod from './ManualPaymentMethod';

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
				hasLoadedPaymentmethod: select(coreStore).hasFinishedResolution(
					'getEntityRecord',
					entityData
				),
			};
		},
		[id]
	);

	return (
		<Box
			title={__('Payment Method', 'surecart')}
			loading={loading || !hasLoadedPaymentmethod}
		>
			<>
				{subscription?.payment_method &&
					!subscription?.manual_payment && (
						<ScPaymentMethodDetails
							paymentMethod={payment_method}
							editHandler={() => setEdit(true)}
						/>
					)}
				{subscription?.manual_payment && (
					<ManualPaymentMethod
						subscription={subscription}
						updateSubscription={updateSubscription}
						loading={loading}
						setEdit={setEdit}
					/>
				)}
				<EditPaymentMethod
					open={edit}
					setOpen={setEdit}
					customerId={
						subscription?.customer?.id || subscription?.customer
					}
					isManualPaymentSelected={subscription?.manual_payment}
					manualPaymentMethodId={subscription?.manual_payment_method}
					paymentMethodId={
						subscription?.payment_method?.id ||
						subscription?.payment_method
					}
					updatePaymentMethod={(data) => {
						updateSubscription(data);
						setEdit(false);
					}}
				/>
			</>
		</Box>
	);
};
