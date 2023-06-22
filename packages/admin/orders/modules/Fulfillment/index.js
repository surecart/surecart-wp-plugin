import { __, _n } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import Fulfilled from './Fulfilled';
import Unfulfilled from './Unfulfilled';
import Box from '../../../ui/Box';

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
						'trackings',
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

	// fetch fulfillment data from order id.
	const { lineItems, loadingLineItems } = useSelect(
		(select) => {
			if (!checkout?.id) {
				return {};
			}

			const queryArgs = [
				'surecart',
				'line_item',
				{
					checkout_ids: [checkout?.id],
					expand: ['price', 'price.product'],
				},
			];
			return {
				lineItems: select(coreStore).getEntityRecords(...queryArgs),
				loadingLineItems: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[checkout?.id]
	);

	// filter unfulfilled items
	const unfulfilled = (lineItems || []).filter((item) => {
		return item?.quantity !== item?.fulfilled_quantity;
	});

	if (loading || loadingOrder || loadingLineItems) {
		return <Box loading={true} />;
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
