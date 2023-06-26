import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';
import Price from './Price';
import NewPrice from './NewPrice';
import { store as uiStore } from '../../store/ui';
import { useSelect } from '@wordpress/data';
import {
	ScCard,
	ScFlex,
	ScStackedList,
	ScStackedListRow
} from '@surecart/components-react';

export default ({}) => {
	
	const prices = useSelect((select) => select(uiStore).getPricesForCreateOrder());

	return (
		<Box
			title={__('Add Prices', 'surecart')}
			footer={<NewPrice/>}
		>
			{ prices?.pricesForCreateOrder?.length ? (
				<ScCard noPadding>
					<ScStackedList>
						<ScStackedListRow
							style={{
								'--columns': '3',
							}}
						>
							<ScFlex alignItems="center" justifyContent="flex-start">
								<div>
									{__('Product', 'surecart')}
								</div>
							</ScFlex>
							<div
								style={{
									'justifyContent': 'space-between',
									'alignItems': 'center'
								}}
							>
								{__('Quantity', 'surecart')}
							</div>

						</ScStackedListRow>
						{prices?.pricesForCreateOrder?.map((price) => (
							<Price key={price?.id} price={price}/>
						))}
					</ScStackedList>
				</ScCard>
			) : (
				<sc-empty icon="shopping-bag">
					{__(
						'Add some prices to this order.',
						'surecart'
					)}
				</sc-empty>
			) }
		</Box>
	);
};
