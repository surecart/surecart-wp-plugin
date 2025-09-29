/**
 * External dependencies.
 */
import { __, _n } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import ProductLineItem from '../../ui/ProductLineItem';
import Definition from '../../ui/Definition';
import { ScDivider, ScIcon } from '@surecart/components-react';

export default ({ review }) => {
	if (!review?.product?.id) {
		return null;
	}
	const { product, purchase_id } = review || {};

	const purchase = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'purchase',
				purchase_id,
				{
					expand: ['initial_order', 'variant', 'price'],
				},
			];

			return select(coreStore).getEntityRecord(...queryArgs);
		},
		[purchase_id]
	);

	const { id, quantity, variant, price } = purchase || {};

	return (
		<>
			<ProductLineItem
				key={id}
				lineItem={{
					product,
					price: {
						...price,
						product,
					},
					image: product?.line_item_image || {},
					...(!!variant && { variant }),
				}}
			>
				{!!quantity && (
					<span>
						{__('Qty:', 'surecart')} {quantity}
					</span>
				)}
			</ProductLineItem>

			<ScDivider spacing={12} />

			<Definition title={__('Order', 'surecart')}>
				{purchase?.initial_order?.number ? (
					<Button
						variant="link"
						href={addQueryArgs('admin.php', {
							page: 'sc-orders',
							action: 'edit',
							id: purchase?.initial_order?.id,
						})}
						target="_blank"
						icon={<ScIcon name="external-link" />}
						iconPosition="right"
						style={{ textDecoration: 'none', padding: 0 }}
					>
						#{purchase?.initial_order?.number}
					</Button>
				) : (
					'-'
				)}
			</Definition>
		</>
	);
};
