import { __, _n } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import Fulfilled from './Fulfilled';
import Unfulfilled from './Unfulfilled';

export default ({ orderId, checkout, loading: loadingOrder }) => {
	// fetch fulfillment data from order id.
	const { fulfilled, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'fulfillment',
				{ order_id: orderId },
			];
			return {
				fulfilled: select(coreStore).getEntityRecords(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[orderId]
	);

	// filter unfulfilled items
	const unfulfilled = (checkout?.line_items?.data || []).filter((item) => {
		return !fulfilled?.find((fulfillment) => {
			return fulfillment.line_item_id === item.id;
		});
	});

	if (loading || loadingOrder) {
		return null;
	}

	return (
		<>
			<Unfulfilled items={unfulfilled} checkout={checkout} />
			<Fulfilled items={fulfilled} />
		</>
	);
};
