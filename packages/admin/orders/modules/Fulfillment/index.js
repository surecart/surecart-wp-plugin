import { __, _n } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import Fulfilled from './Fulfilled';
import Unfulfilled from './Unfulfilled';

export default ({ orderId, checkout, loading: loadingOrder }) => {
	// fetch fulfillment data from order id.
	const { fulfillments, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'fulfillment',
				{
					order_ids: [orderId],
					expand: [
						'fulfillment_items',
						'fulfillment_item.line_item',
						'line_item.price',
						'price.product',
					],
				},
			];
			return {
				fulfillments: select(coreStore).getEntityRecords(...queryArgs),
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
		return item?.quantity !== item?.fulfilled_quantity;
	});

	if (loading || loadingOrder) {
		return null;
	}

	return (
		<>
			{!!unfulfilled?.length && (
				<Unfulfilled
					items={unfulfilled}
					checkout={checkout}
					orderId={orderId}
				/>
			)}

			{(fulfillments || []).map((fulfillment) => (
				<Fulfilled fulfillment={fulfillment} />
			))}
		</>
	);
};
