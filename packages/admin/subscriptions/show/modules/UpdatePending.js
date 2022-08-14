import CancelPendingUpdate from '../../../components/subscriptions/CancelPendingUpdate';
import useCurrentPage from '../../../mixins/useCurrentPage';
import { useState } from 'react';

export default ({ children }) => {
	const [open, setOpen] = useState();
	const { id, subscription, saveSubscription } =
		useCurrentPage('subscription');

	const onCancel = async () => {
		// close modal
		setOpen(false);
		await saveSubscription({
			path: `subscriptions/${id}`,
			data: {
				purge_pending_update: true,
			},
			query: {
				expand: [
					'price',
					'price.product',
					'current_period',
					'purchase',
				],
			},
		});
	};

	return (
		<CancelPendingUpdate
			pending={subscription?.pending_update}
			current={{
				price: subscription?.price,
				quantity: subscription?.quantity,
			}}
			onCancel={onCancel}
			open={open}
		>
			{children}
		</CancelPendingUpdate>
	);
};
