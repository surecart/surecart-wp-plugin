import useEntity from '../../../mixins/useEntity';
import apiFetch from '@wordpress/api-fetch';
import { useState } from '@wordpress/element';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

export default ({ subscription, children }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { receiveEntity } = useEntity('subscription', subscription?.id);

	const unCancel = async (e) => {
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
							'current_period',
							'purchase',
						],
					}
				),
				data: { cancel_at_period_end: false },
				method: 'PATCH',
			});
			if (result.id) {
				receiveEntity(result);
			} else {
				throw __('Could not un-cancel subscription.', 'surecart');
			}
		} catch (e) {
			console.error(e);
			if (e?.additional_errors?.[0]?.message) {
				setError(e?.additional_errors?.[0]?.message);
			} else {
				setError(
					e?.message ||
						__('Failed to un-cancel subscription.', 'surecart')
				);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Fragment>
			{children ? (
				<span onClick={unCancel}>{children}</span>
			) : (
				<sc-button size="small" onClick={unCancel} loading={loading}>
					{__("Don't Cancel", 'surecart')}
				</sc-button>
			)}
		</Fragment>
	);
};
