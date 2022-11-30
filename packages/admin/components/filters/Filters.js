import {
	ScCard,
	ScFormControl,
	ScStackedList,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import CustomerFilter from './customer/CustomerFilter';
import PriceFilter from './price/PriceFilter';
import ProductFilter from './product/ProductFilter';

export default ({ item, updateItem, type, label }) => {
	if (!item?.[type]?.length) {
		return null;
	}

	const onRemove = (id) => {
		updateItem({
			[type]: (item?.[type] || []).filter((item) => item !== id),
		});
	};

	return (
		<ScFormControl label={label}>
			<ScCard noPadding>
				<ScStackedList>
					{(item?.[type] || []).map((id) => {
						if ('filter_product_ids' === type) {
							return (
								<ProductFilter
									id={id}
									key={id}
									onRemove={() => onRemove(id)}
								/>
							);
						}

						if ('filter_price_ids' === type) {
							return (
								<PriceFilter
									id={id}
									key={id}
									onRemove={() => onRemove(id)}
								/>
							);
						}

						if ('filter_customer_ids' === type) {
							return (
								<CustomerFilter
									id={id}
									key={id}
									onRemove={() => onRemove(id)}
								/>
							);
						}
						return null;
					})}
				</ScStackedList>
			</ScCard>
		</ScFormControl>
	);
};
