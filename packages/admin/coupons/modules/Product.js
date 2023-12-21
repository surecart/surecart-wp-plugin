/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScFlex,
	ScFormatNumber,
	ScFormControl,
	ScIcon,
	ScSkeleton,
} from '@surecart/components-react';
import { select } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import ModelSelector from '../../components/ModelSelector';
import { intervalString } from '../../util/translations';
import { _n, sprintf, __ } from '@wordpress/i18n';
import { getFeaturedProductMediaAttributes } from '@surecart/components';
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import Error from '../../components/Error';

export default ({ id, onSelect }) => {
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (!id) return;
		if (product?.id === id) return;
		fetchProduct();
	}, [id]);

	const fetchProduct = async () => {
		try {
			setLoading(true);
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'product'
			);
			if (!baseURL) return;
			const data = await apiFetch({
				path: addQueryArgs(`${baseURL}/${id}`, {
					expand: [
						'prices',
						'featured_product_media',
						'product_media.media',
					],
				}),
			});
			setProduct(data);
		} catch (e) {
			console.error(e);
			setError(e);
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	if (!id) {
		return (
			<ScFormControl label={__('Select A Product', 'surecart')}>
				<ModelSelector
					name="product"
					requestQuery={{ archived: false }}
					onSelect={onSelect}
				/>
			</ScFormControl>
		);
	}

	if (loading) {
		return <ScSkeleton />;
	}

	if (error) {
		return <Error error={error} setError={setError} children={false} />;
	}

	const activePrices = product?.prices?.data?.filter(
		(price) => !price?.archived
	);
	const firstPrice = activePrices?.[0];
	const totalPrices = activePrices?.length;
	const media = getFeaturedProductMediaAttributes(product);

	return (
		<ScFlex alignItems="center" justifyContent="flex-start">
			{media.url ? (
				<img
					src={media.url}
					alt={media.alt}
					{...(media.title ? { title: media.title } : {})}
					css={css`
						width: 40px;
						height: 40px;
						object-fit: cover;
						background: #f3f3f3;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: var(--sc-border-radius-small);
					`}
				/>
			) : (
				<div
					css={css`
						width: 40px;
						height: 40px;
						object-fit: cover;
						background: var(--sc-color-gray-100);
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: var(--sc-border-radius-small);
					`}
				>
					<ScIcon
						style={{
							width: '18px',
							height: '18px',
						}}
						name={'image'}
					/>
				</div>
			)}
			<div>
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
			</div>
		</ScFlex>
	);
};
