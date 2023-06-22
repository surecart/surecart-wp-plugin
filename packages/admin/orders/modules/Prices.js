import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';
import Price from './Price';
import NewPrice from './NewPrice';

export default ({ prices, setPrices }) => {

	return (
		<Box
			title={__('Add Prices', 'surecart')}
			footer={<NewPrice prices={prices} setPrices={setPrices} />}
		>
			{!!prices?.length ? (
				prices.map((price) => (
					<Price key={price?.id} price={price} prices={prices} setPrices={setPrices} />
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
