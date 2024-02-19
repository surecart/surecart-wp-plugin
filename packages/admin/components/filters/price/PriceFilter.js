import { ScFormatNumber } from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { intervalString } from '../../../../admin/util/translations';
import FilterItem from '../FilterItem';
import LineItemLabel from '../../../ui/LineItemLabel';
import { getFeaturedProductMediaAttributes } from '@surecart/components';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useEffect, useState } from '@wordpress/element';
import { select, useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

export default ({ id, onRemove }) => {
	const [price, setPrice] = useState({});
	const [loading, setLoading] = useState(false);
	const { createErrorNotice } = useDispatch(noticesStore);

	useEffect(() => {
		if (id) {
			fetchPrice();
		}
	}, [id]);

	const fetchPrice = async () => {
		try {
			setLoading(true);
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'price'
			);
			const result = await apiFetch({
				path: addQueryArgs(`${baseURL}/${id}`, {
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
		<FilterItem
			loading={loading}
			media={getFeaturedProductMediaAttributes(price?.product)}
			icon={'image'}
			onRemove={onRemove}
		>
			<div>
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
			</div>
		</FilterItem>
	);
};
