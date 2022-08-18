import useEntity from '../../../../hooks/useEntity';
import Box from '../../../../ui/Box';
import EditPaymentMethod from './EditPaymentMethod';
import PaymentMethod from './PaymentMethod';
import {
	ScButton,
	ScCcLogo,
	ScDialog,
	ScFlex,
	ScFormControl,
	ScIcon,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';

export default ({ subscription, updateSubscription, loading }) => {
	const id = subscription?.payment_method?.id || subscription?.payment_method;
	const [edit, setEdit] = useState();
	const { payment_method, hasLoadedPaymentmethod } = useEntity(
		'payment_method',
		id,
		{
			expand: [
				'card',
				'bank_account',
				'paypal_acount',
				'payment_instrument',
			],
		}
	);

	return (
		<Box
			title={__('Payment Method', 'surecart')}
			loading={loading || !hasLoadedPaymentmethod}
		>
			<ScFormControl label={__('Payment Method', 'surecart')}>
				<ScFlex
					alignItems="center"
					justifyContent="flex-start"
					style={{ gap: '0.5em' }}
				>
					<PaymentMethod paymentMethod={payment_method} />
					<ScButton type="text" circle onClick={() => setEdit(true)}>
						<ScIcon name="edit-2" />
					</ScButton>
				</ScFlex>
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
			</ScFormControl>
		</Box>
	);
};
