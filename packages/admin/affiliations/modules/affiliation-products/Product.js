/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';
import { useEffect, useState } from '@wordpress/element';
import { useDispatch, select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScCard,
	ScFormatNumber,
	ScIcon,
} from '@surecart/components-react';
import { intervalString } from '../../../util/translations';
import ModelSelector from '../../../components/ModelSelector';
import ModelRow from '../../../upsell-funnels/components/ModelRow';

export default ({ productId, onSelect, ...props }) => {
	const [loading, setLoading] = useState(false);
	const [product, setProduct] = useState({});
	const { createErrorNotice } = useDispatch(noticesStore);

	const activePrices = product?.prices?.data?.filter(
		(price) => !price?.archived
	);

	const firstPrice = activePrices?.[0];
	const totalPrices = activePrices?.length;

	useEffect(() => {
		if (productId) {
			fetchProduct();
		}
	}, [productId]);

	// We can't use useSelect because of a caching issue with fetching products through the price selector.
	const fetchProduct = async () => {
		try {
			setLoading(true);
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'product'
			);

			const result = await apiFetch({
				path: addQueryArgs(`${baseURL}/${productId}`, {
					expand: [
						'featured_product_media',
						'product.product_medias',
						'product_media.media',
						'prices',
					],
				}),
			});
			setProduct(result);
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
		<ModelSelector
			name="product"
			required
			value={productId}
			onSelect={(p) => onSelect(p)}
			includeVariants={false}
			showOutOfStock={true}
			ad_hoc={false}
			requestQuery={{
				archived: false,
			}}
			{...props}
		>
			{loading || !!product?.id ? (
				<ScCard slot="trigger" noPadding>
					<ModelRow
						icon={'image'}
						image={product?.line_item_image}
						loading={loading}
						suffix={
							<div
								css={css`
									align-self: center;
								`}
							>
								<ScButton onClick={() => onSelect(null)}>
									{__('Change', 'surecart')}
								</ScButton>
							</div>
						}
					>
						<div>
							<strong>{product?.name}</strong>
						</div>

						{totalPrices > 1 ? (
							sprintf(__('%d prices', 'surecart'), totalPrices)
						) : (
							<>
								<ScFormatNumber
									value={firstPrice?.amount}
									type="currency"
									currency={firstPrice?.currency}
								/>
								{intervalString(firstPrice)}
							</>
						)}
					</ModelRow>
				</ScCard>
			) : (
				<ScButton slot="trigger">
					<ScIcon name="plus" slot="prefix" />
					{__('Choose Product', 'surecart')}
				</ScButton>
			)}
		</ModelSelector>
	);
};
