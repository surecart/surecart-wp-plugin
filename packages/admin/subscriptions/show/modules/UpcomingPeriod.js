import LineItems from './LineItems';
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

export default ({ subscriptionId }) => {
	const [upcoming, setUpcoming] = useState();
	const [error, setError] = useState();
	const [loadingUpcoming, setLoadingUpcoming] = useState(false);

	useEffect(() => {
		if (subscriptionId) {
			fetchUpcomingPeriod();
		}
	}, [subscriptionId]);

	const fetchUpcomingPeriod = async () => {
		setLoadingUpcoming(true);

		try {
			const response = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(
					`surecart/v1/subscriptions/${subscriptionId}/upcoming_period`,
					{
						skip_product_group_validation: true,
						expand: [
							'period.checkout',
							'checkout.line_items',
							'line_item.price',
							'price.product',
							'period.subscription',
						],
					}
				),
				data: {
					purge_pending_update: false,
					// trial_end_at: null,
				},
			});
			setUpcoming(response);
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setLoadingUpcoming(false);
		}
	};

	if (error) return null;

	return <LineItems period={upcoming} loading={loadingUpcoming} />;
};
