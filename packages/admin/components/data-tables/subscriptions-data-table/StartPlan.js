import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { Fragment } from '@wordpress/element';
import useEntity from '../../../mixins/useEntity';

export default ({ subscription, children }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { receiveEntity } = useEntity('subscription', subscription?.id);

	const confirmStart = () => {
		const r = confirm(
			__(
				'Are you sure you want to start the subscription? This will immediately charge the customer.',
				'surecart'
			)
		);
		if (!r) return;
		start();
	};

	const start = async () => {
		setError(false);
		setLoading(true);
		try {
			const result = await apiFetch({
				path: addQueryArgs(
					`surecart/v1/subscriptions/${subscription.id}`,
					{
						expand: [
							'price',
							'price.product',
							'latest_invoice',
							'purchase',
						],
					}
				),
				data: { trial_end_at: 'now' },
				method: 'PATCH',
			});
			if (result.id) {
				receiveEntity(result);
			} else {
				throw __('Could not start subscription.', 'surecart');
			}
		} catch (e) {
			console.error(e);
			if (e?.additional_errors?.[0]?.message) {
				setError(e?.additional_errors?.[0]?.message);
			} else {
				setError(
					e?.message ||
						__('Failed to start subscription.', 'surecart')
				);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Fragment>
			{children ? (
				<span onClick={confirmStart}>{children}</span>
			) : (
				<ce-button
					size="small"
					onClick={confirmStart}
					loading={loading}
				>
					{__('Activate', 'surecart')}
				</ce-button>
			)}
		</Fragment>
	);
};
