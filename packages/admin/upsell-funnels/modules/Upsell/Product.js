import { __ } from '@wordpress/i18n';
import PriceSelector from '../../../components/PriceSelector';
import {
	ScButton,
	ScCard,
	ScFormatNumber,
	ScIcon,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import { useDispatch, select } from '@wordpress/data';
import ModelRow from '../../components/ModelRow';
import { getFeaturedProductMediaAttributes } from '@surecart/components';
import { intervalString } from '../../../util/translations';
import LineItemLabel from '../../../ui/LineItemLabel';

export default ({ priceId, onSelect, ...props }) => {
	const [loading, setLoading] = useState(false);
	const [price, setPrice] = useState({});
	const { createErrorNotice } = useDispatch(noticesStore);

	useEffect(() => {
		if (priceId) {
			fetchPrice();
		}
	}, [priceId]);

	// We can't use useSelect because of a caching issue with fetching products through the price selector.
	const fetchPrice = async () => {
		try {
			setLoading(true);
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'price'
			);
			const result = await apiFetch({
				path: addQueryArgs(`${baseURL}/${priceId}`, {
					expand: [
						'product',
						'product.featured_product_media',
						'product_media.media',
					],
				}),
			});
			setPrice(result);
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{ type: 'snackbar' }
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<PriceSelector
			required
			value={priceId}
			onSelect={({ price_id }) => onSelect(price_id)}
			includeVariants={false}
			showOutOfStock={true}
			requestQuery={{
				archived: false,
				ad_hoc: false,
			}}
			{...props}
		>
			{loading || !!price?.id ? (
				<ScCard slot="trigger" noPadding>
					<ModelRow
						icon={'image'}
						media={getFeaturedProductMediaAttributes(
							price?.product
						)}
						loading={loading}
						suffix={
							<div>
								<ScButton onClick={() => onSelect(null)}>
									{__('Change', 'surecart')}
								</ScButton>
							</div>
						}
					>
						<div>
							<strong>{price?.product?.name}</strong>
						</div>
						<LineItemLabel lineItem={{ price }}>
							<ScFormatNumber
								type="currency"
								currency={price?.currency || 'usd'}
								value={price?.amount}
							/>
							{intervalString(price)}
						</LineItemLabel>
					</ModelRow>
				</ScCard>
			) : (
				<ScButton slot="trigger">
					<ScIcon name="plus" slot="prefix" />
					{__('Choose Product', 'surecart')}
				</ScButton>
			)}
		</PriceSelector>
	);
};
