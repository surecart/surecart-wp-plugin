import Cancel from '../../../components/subscriptions/Cancel';
import useCurrentPage from '../../../mixins/useCurrentPage';
import { store as uiStore } from '@surecart/ui-data';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';

export default ({ children }) => {
	const [open, setOpen] = useState();
	const { addSnackbarNotice } = useDispatch(uiStore);
	const { id, subscription, saveSubscription, setSaving } =
		useCurrentPage('subscription');

	const onCancel = async ({ cancel_behavior }) => {
		// close modal
		setOpen(false);
		try {
			setSaving(true);
			await saveSubscription({
				path: `subscriptions/${id}/cancel`,
				query: {
					cancel_behavior,
					expand: [
						'price',
						'price.product',
						'latest_period',
						'purchase',
					],
				},
			});
			addSnackbarNotice({
				content: __('Canceled.'),
			});
		} catch (e) {
			console.error(e);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Cancel onCancel={onCancel} open={open} subscription={subscription}>
			{children}
		</Cancel>
	);
};
