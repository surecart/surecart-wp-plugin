import { __, _n } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import Fulfilled from './Fulfilled';
import Unfulfilled from './Unfulfilled';
import Box from '../../../ui/Box';

export default ({
	orderId,
	checkout,
	loading: loadingOrder,
	onCreateSuccess,
	onDeleteSuccess,
}) => {
	// fetch fulfillment data from order id.
	const { fulfillments, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'fulfillment',
				{
					order_ids: [orderId],
					expand: [
						'trackings',
						'fulfillment_items',
						'fulfillment_item.line_item',
						'line_item.price',
						'line_item.variant',
						'price.product',
						'product.featured_product_media',
						'product_media.media',
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
		return <Box loading={true} />;
	}

	return (
		<>
			{!!unfulfilled?.length && (
				<Unfulfilled
					items={unfulfilled}
					checkout={checkout}
					orderId={orderId}
					onCreateSuccess={onCreateSuccess}
				/>
			)}

			{(fulfillments || []).map((fulfillment) => (
				<Fulfilled
					fulfillment={fulfillment}
					onDeleteSuccess={onDeleteSuccess}
				/>
			))}
		</>
	);
};
