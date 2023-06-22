import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';
import Price from './Price';
import NewPrice from './NewPrice';
import { store as uiStore } from '../../store/ui';
import { useDispatch, useSelect } from '@wordpress/data';

export default ({}) => {
	
	const prices = useSelect((select) => select(uiStore).getPricesForCreateOrder());

	return (
		<Box
			title={__('Add Prices', 'surecart')}
			footer={<NewPrice/>}
		>
			{!!prices?.pricesForCreateOrder?.length ? (
				prices?.pricesForCreateOrder?.map((price) => (
					<Price key={price?.id} price={price}/>
				))
			) : (
				<sc-empty icon="shopping-bag">
					{__(
						'Add some prices to this order.',
						'surecart'
					)}
				</sc-empty>
			)}
		</Box>
	);
};
