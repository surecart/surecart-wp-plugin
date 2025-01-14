import { ScFormControl, ScSkeleton } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import PriceSelector from '@admin/components/PriceSelector';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useSelect, useDispatch } from '@wordpress/data';
import SwapPriceDisplay from './SwapPriceDisplay';

export default ({ price }) => {
	const { deleteEntityRecord } = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

	const { swap, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'swap',
				price?.current_swap,
				{ expand: ['swap_price', 'swap_price.product'] },
			];
			return {
				swap: select(coreStore).getEntityRecord(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[price]
	);

	const onDelete = async () => {
		try {
			await deleteEntityRecord('surecart', 'swap', price?.current_swap, {
				throwOnError: true,
			});
			createSuccessNotice(__('Deleted.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart')
			);
		}
	};

	if (price?.current_swap) {
		if (loading) {
			return <ScSkeleton />;
		}

		return (
			<ScFormControl
				label={__('Swap Price', 'surecart')}
				help={__('The associated price to swap to.', 'surecart')}
			>
				<SwapPriceDisplay
					price={swap?.swap_price}
					product={swap?.swap_price?.product}
					onRemove={onDelete}
				/>
			</ScFormControl>
		);
	}

	// return (
	// 	<ScFormControl
	// 		label={__('Renewal Price', 'surecart')}
	// 		help={__(
	// 			'This will be the price used when a subscription renews for the first time.',
	// 			'surecart'
	// 		)}
	// 	>
	// 		<PriceSelector
	// 			value={price?.renewal_price}
	// 			onSelect={({ price_id }) => {
	// 				updatePrice({
	// 					renewal_price: price_id,
	// 				});
	// 			}}
	// 			showOutOfStock={true}
	// 			requestQuery={{
	// 				archived: false,
	// 			}}
	// 			variable={false}
	// 			placement="top-start"
	// 			position="top-left"
	// 		/>
	// 	</ScFormControl>
	// );
};
