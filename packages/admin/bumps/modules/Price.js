import {
	ScFormControl,
	ScCard,
	ScStackedList,
	ScFormatNumber,
	ScStackedListRow,
	ScButton,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import PriceSelector from '../../components/PriceSelector';
import useEntity from '../../hooks/useEntity';
import Box from '../../ui/Box';
import { intervalString } from '../../util/translations';
import ModelRow from '../components/ModelRow';

export default ({ loading, bump, updateBump }) => {
	const { price, hasLoadedPrice } = useEntity(
		'price',
		bump?.price,
		{
			expand: ['product'],
		},
		[bump?.price]
	);

	return (
		<Box title={__('Price', 'surecart')} loading={loading}>
			<ScFormControl
				label={__('Order Bump Price', 'surecart')}
				help={__('This is the price for the bump.', 'surecart')}
			>
				{bump?.price ? (
					<ScCard noPadding>
						<ScStackedList>
							<ModelRow
								icon={'image'}
								imageUrl={price?.product?.image_url}
								loading={!hasLoadedPrice}
								suffix={
									<div>
										<ScButton
											onClick={() =>
												updateBump({ price: null })
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
								<ScFormatNumber
									type="currency"
									currency={price?.currency || 'usd'}
									value={price?.amount}
								/>
								{intervalString(price)}
							</ModelRow>
						</ScStackedList>
					</ScCard>
				) : (
					<PriceSelector
						required
						open
						value={bump?.price?.id || bump?.price}
						ad_hoc={false}
						onSelect={(price) => updateBump({ price })}
						requestQuery={{
							archived: false,
						}}
					/>
				)}
			</ScFormControl>
		</Box>
	);
};
