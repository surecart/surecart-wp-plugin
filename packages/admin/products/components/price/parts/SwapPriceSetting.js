import {
	ScFormControl,
	ScSkeleton,
	ScInput,
	ScIcon,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';
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
				label={__('Swap to', 'surecart')}
				help={__(
					'The associated price the customer can swap to on the checkout.',
					'surecart'
				)}
			>
				<Tooltip
					text={__(
						'Only available for products without variants',
						'surecart'
					)}
				>
					<ScIcon
						name="info"
						slot="label-end"
						style={{ opacity: 0.5 }}
					/>
				</Tooltip>
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
					variable={false}
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
				label={__('Swap to', 'surecart')}
				help={__(
					'The associated price the customer can swap to on the checkout.',
					'surecart'
				)}
			>
				<Tooltip
					text={__(
						'Only available for products without variants',
						'surecart'
					)}
				>
					<ScIcon
						name="info"
						slot="label-end"
						style={{ opacity: 0.5 }}
					/>
				</Tooltip>
				<SwapPriceDisplay
					price={swapPrice}
					product={swapPrice?.product}
					onRemove={onDelete}
				/>
			</ScFormControl>
			<ScFormControl
				label={__('Description', 'surecart')}
				help={__(
					'This is shown to the customer on line items to help them understand the price boost.',
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
