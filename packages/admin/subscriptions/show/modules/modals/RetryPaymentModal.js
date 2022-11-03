import { ScBlockUi, ScButton, ScDialog } from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

export default ({ open, period, onRequestClose }) => {
	const [loading, setLoading] = useState(false);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const { invalidateResolutionForStore } = useDispatch(coreStore);

	const retryPayment = async () => {
		try {
			setLoading(true);
			const newPeriod = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(
					`surecart/v1/periods/${period?.id}/retry_payment/`,
					{
						expand: ['checkout', 'checkout.order'],
					}
				),
			});

			if (newPeriod?.status === 'payment_failed') {
				throw {
					message: __(
						'Could not complete the payment. Please check the order for additional details.',
						'surecart'
					),
				};
			}

			// invalidate page.
			await invalidateResolutionForStore();

			createSuccessNotice(__('Payment retry successful!', 'surecart'), {
				type: 'snackbar',
			});

			onRequestClose();
		} catch (e) {
			const actions =
				period?.checkout?.order?.id || period?.checkout?.order
					? [
							{
								label: __('View Order', 'surecart'),
								url: addQueryArgs('admin.php', {
									page: 'sc-orders',
									action: 'edit',
									id:
										period?.checkout?.order?.id ||
										period?.checkout?.order,
								}),
							},
					  ]
					: null;
			createErrorNotice(e?.message, {
				type: 'snackbar',
				actions,
			});
			onRequestClose();
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScDialog
			label={__('Confirm', 'surecart')}
			open={open}
			onScRequestClose={onRequestClose}
		>
			{__(
				'Are you sure you want to retry the payment? This will attempt to charge the customer.',
				'surecart'
			)}
			<div slot="footer">
				<ScButton
					type="text"
					onClick={onRequestClose}
					disabled={loading}
				>
					{__('Cancel', 'surecart')}
				</ScButton>{' '}
				<ScButton
					type="primary"
					onClick={() => retryPayment()}
					disabled={loading}
				>
					{__('Retry Payment', 'surecart')}
				</ScButton>
			</div>
			{loading && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}
		</ScDialog>
	);
};
