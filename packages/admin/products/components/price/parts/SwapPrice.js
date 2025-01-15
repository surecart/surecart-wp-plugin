import { ScFormControl, ScSkeleton, ScInput } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import PriceSelector from '@admin/components/PriceSelector';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useSelect, useDispatch } from '@wordpress/data';
import SwapPriceDisplay from './SwapPriceDisplay';

export default ({ price, updateSwap, currentSwap }) => {
	const { deleteEntityRecord } = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	console.log('currentSwap', currentSwap);

	const { swapPrice, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'price',
				currentSwap?.swap_price,
				{ expand: ['product'] },
			];
			return {
				swapPrice: select(coreStore).getEntityRecord(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[currentSwap]
	);
	console.log('swapPrice', swapPrice);
	console.log('price', price);

	const onDelete = async () => {
		try {
			await deleteEntityRecord('surecart', 'swap', price?.current_swap, {
				throwOnError: true,
			});
			createSuccessNotice(__('Swap Deleted.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart')
			);
		}
	};

	if (loading) {
		return <ScSkeleton />;
	}

	return (
		<>
			{(!currentSwap?.swap_price || !swapPrice) && (
				<ScFormControl
					label={__('Swap Price', 'surecart')}
					help={__('The associated price to swap to.', 'surecart')}
				>
					<PriceSelector
						value={currentSwap?.swap_price}
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
						variable={false}
						placement="top-start"
						position="top-left"
						exclude={[price?.id]}
					/>
				</ScFormControl>
			)}
			{currentSwap?.swap_price && swapPrice && (
				<>
					<ScFormControl
						label={__('Swap Price', 'surecart')}
						help={__(
							'The associated price to swap to.',
							'surecart'
						)}
					>
						<SwapPriceDisplay
							price={swapPrice}
							product={swapPrice?.product}
							onRemove={onDelete}
						/>
					</ScFormControl>
					<ScFormControl
						label={__('Swap Description', 'surecart')}
						help={__(
							'This is shown to the customer on line items along with the swap price.',
							'surecart'
						)}
					>
						<ScInput
							placeholder={__('Swap and Save', 'surecart')}
							value={currentSwap?.description}
							onScInput={(e) =>
								updateSwap({ description: e.target.value })
							}
							required
						/>
					</ScFormControl>
				</>
			)}
		</>
	);
};
