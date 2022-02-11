import { useState } from 'react';
import Cancel from '../../../components/subscriptions/Cancel';
import useCurrentPage from '../../../mixins/useCurrentPage';

export default ({ children, onCanceled }) => {
	const [open, setOpen] = useState();
	const { id, saveSubscription } = useCurrentPage('subscription');

	const onCancel = async ({ cancel_behavior }) => {
		// close modal
		setOpen(false);
		await saveSubscription({
			path: `subscriptions/${id}/cancel`,
			query: {
				cancel_behavior,
				expand: [
					'price',
					'price.product',
					'latest_invoice',
					'purchase',
				],
			},
		});
	};

	return (
		<Cancel onCancel={onCancel} open={open}>
			{children}
		</Cancel>
	);
};
