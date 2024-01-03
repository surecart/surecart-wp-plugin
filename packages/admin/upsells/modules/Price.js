import {
	ScFormControl,
	ScCard,
	ScStackedList,
	ScFormatNumber,
	ScButton,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import PriceSelector from '../../components/PriceSelector';
import useEntity from '../../hooks/useEntity';
import Box from '../../ui/Box';
import { intervalString } from '../../util/translations';

import ModelRow from '../components/ModelRow';
import { getFeaturedProductMediaAttributes } from '@surecart/components';
import LineItemLabel from '../../ui/LineItemLabel';

export default ({ loading, upsell, updateUpsell }) => {
	const { price, hasLoadedPrice } = useEntity(
		'price',
		upsell?.price,
		{
			expand: [
				'product',
				'product.featured_product_media',
				'product_media.media',
			],
		},
		[upsell?.price]
	);

	return (
		<Box title={__('Price', 'surecart')} loading={loading}>
			<ScFormControl
				label={__('Upsell Price', 'surecart')}
				help={__('This is the price for the upsell.', 'surecart')}
			>
				{upsell?.price ? (
					<ScCard noPadding>
						<ScStackedList>
							<ModelRow
								icon={'image'}
								media={getFeaturedProductMediaAttributes(
									price?.product
								)}
								loading={!hasLoadedPrice}
								suffix={
									<div>
										<ScButton
											onClick={() =>
												updateUpsell({ price: null })
											}
										>
											{__('Change', 'surecart')}
										</ScButton>
									</div>
								}
							>
								<div>
									<strong>{price?.product?.name}</strong>
								</div>
								<LineItemLabel lineItem={{ price: price }}>
									<ScFormatNumber
										type="currency"
										currency={price?.currency || 'usd'}
										value={price?.amount}
									/>
									{intervalString(price)}
								</LineItemLabel>
							</ModelRow>
						</ScStackedList>
					</ScCard>
				) : (
					<PriceSelector
						required
						open
						value={upsell?.price?.id || upsell?.price}
						ad_hoc={false}
						variable={false}
						onSelect={({ price_id }) =>
							updateUpsell({ price: price_id })
						}
						requestQuery={{
							archived: false,
						}}
					/>
				)}
			</ScFormControl>
		</Box>
	);
};
