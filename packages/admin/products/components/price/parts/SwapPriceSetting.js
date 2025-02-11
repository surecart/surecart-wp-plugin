import { ScFormControl, ScSkeleton, ScInput } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import PriceSelector from '@admin/components/PriceSelector';
import SwapPriceDisplay from './SwapPriceDisplay';

export default ({
	price,
	swapPrice,
	swapPriceDescription,
	updateSwap,
	onDelete,
	loading,
}) => {
	if (loading) {
		return <ScSkeleton />;
	}

	if (!swapPrice) {
		return (
			<ScFormControl
				label={__('Upsells to', 'surecart')}
				help={__('The associated price to swap to.', 'surecart')}
			>
				<PriceSelector
					value={swapPrice?.id}
					onSelect={({ price_id }) =>
						updateSwap({
							price: price?.id,
							swap_price: price_id,
						})
					}
					showOutOfStock={true}
					requestQuery={{
						archived: false,
					}}
					includeVariants={false}
					placement="top-start"
					position="top-left"
					exclude={[price?.id]}
				/>
			</ScFormControl>
		);
	}

	return (
		<>
			<ScFormControl
				label={__('Price Bump', 'surecart')}
				help={__('The associated price to swap to.', 'surecart')}
			>
				<SwapPriceDisplay
					price={swapPrice}
					product={swapPrice?.product}
					onRemove={onDelete}
				/>
			</ScFormControl>
			<ScFormControl
				label={__('Price Bump Description', 'surecart')}
				help={__(
					'This is shown to the customer on line items along with the swap price.',
					'surecart'
				)}
			>
				<ScInput
					placeholder={__('i.e. Pay yearly and save 20%', 'surecart')}
					value={swapPriceDescription}
					onScInput={(e) =>
						updateSwap({ description: e.target.value })
					}
					required
				/>
			</ScFormControl>
		</>
	);
};
