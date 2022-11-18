import {
	ScCard,
	ScFormControl,
	ScStackedList,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Filter from './Filter';
import PriceFilter from './price/PriceFilter';

export default ({ coupon, updateCoupon, type, label, name }) => {
	const filtername = `filter_${type}`;

	if (!coupon?.[filtername]?.length) {
		return null;
	}

	const names = {
		price_ids: 'price',
		product_ids: 'product',
		product_group_ids: 'product-group',
	};

	const icons = {
		price_ids: 'image',
		product_ids: 'image',
		product_group_ids: 'layers',
	};

	const onRemove = (id) => {
		updateCoupon({
			[filtername]: coupon[filtername].filter((item) => item !== id),
		});
	};

	return (
		<ScFormControl label={label}>
			<ScCard noPadding>
				<ScStackedList>
					{(coupon?.[filtername] || []).map((id) => {
						if ('filter_price_ids' === filtername) {
							return (
								<PriceFilter
									id={id}
									key={id}
									onRemove={() => onRemove(id)}
								/>
							);
						}
						return (
							<Filter
								id={id}
								key={id}
								name={names?.[type]}
								icon={icons?.[type]}
								onRemove={() => onRemove(id)}
							/>
						);
					})}
				</ScStackedList>
			</ScCard>
		</ScFormControl>
	);
};
