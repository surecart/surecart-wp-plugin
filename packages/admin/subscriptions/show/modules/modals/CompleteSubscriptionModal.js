import {
	ScAlert,
	ScBlockUi,
	ScButton,
	ScDialog,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import apiFetch from '@wordpress/api-fetch';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';

const expand = [
	'current_period',
	'period.checkout',
	'checkout.line_items',
	'line_item.price',
	'price',
	'price.product',
	'customer',
	'customer.balances',
	'purchase',
	'order',
	'payment_method',
	'payment_method.card',
	'payment_method.payment_instrument',
	'payment_method.paypal_account',
	'payment_method.bank_account',
];

export default ({ open, onRequestClose }) => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { receiveEntityRecords } = useDispatch(coreStore);

	const completeSubscription = async () => {
		try {
			setLoading(true);
			setError(null);
			const subscription = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`surecart/v1/subscriptions/${id}/complete`, {
					expand,
				}),
			});
			receiveEntityRecords('surecart', 'subscription', subscription, {
				expand,
			});
			createSuccessNotice(__('Subscription completed.', 'surecart'), {
				type: 'snackbar',
			});
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e?.message);
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
			<ScAlert open={error} type="error">
				{error}
			</ScAlert>
			{__(
				'Are you sure you want to complete this payment plan? This will eliminate any additional payments and mark the plan as complete. You cannot undo this.',
				'surecart'
			)}
			<div slot="footer">
				<ScButton
					type="text"
					onClick={onRequestClose}
					disabled={loading}
				>
					{__('Nevermind', 'surecart')}
				</ScButton>{' '}
				<ScButton
					type="primary"
					onClick={() => completeSubscription()}
					disabled={loading}
				>
					{__('Complete Subscription', 'surecart')}
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
