/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScTag } from '@surecart/components-react';
import RevokeToggleButton from './RevokeToggleButton';
import ProductLineItem from '../../../ui/ProductLineItem';

export default (purchase) => {
	const { id, quantity, revoked, variant, price, product } = purchase;

	return {
		item: (
			<ProductLineItem
				key={id}
				lineItem={{
					price: {
						...price,
						product,
					},
					variant,
					variant_options: [
						variant?.option_1,
						variant?.option_2,
						variant?.option_3,
					],
				}}
			>
				<span>{__('Qty:', 'surecart')}{' '}{quantity}</span>
				{revoked && (
					<div>
						<ScTag size="small" type="danger">
							{__('Revoked', 'surecart')}
						</ScTag>
					</div>
				)}
			</ProductLineItem>
		),
		actions: <RevokeToggleButton purchase={purchase} />,
	};
};
