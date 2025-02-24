import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import SwapPriceSetting from './SwapPriceSetting';

export default ({
	price,
	updateSwap,
	currentSwap,
	isSaving,
	currentProduct,
}) => {
	const [isDeleting, setIsDeleting] = useState(false);
	const { deleteEntityRecord } = useDispatch(coreStore);
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);

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

	const onDelete = async () => {
		try {
			setIsDeleting(true);
			updateSwap({
				price: price?.id,
				swap_price: '',
			});
			await deleteEntityRecord('surecart', 'swap', currentSwap?.id, {
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
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<SwapPriceSetting
			price={price}
			currentProduct={currentProduct}
			swapPrice={swapPrice}
			swapPriceDescription={currentSwap?.description}
			updateSwap={updateSwap}
			onDelete={onDelete}
			loading={loading || isDeleting || isSaving}
		/>
	);
};
