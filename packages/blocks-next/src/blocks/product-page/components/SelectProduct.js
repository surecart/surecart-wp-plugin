/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import throttle from 'lodash/throttle';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import { ScSelect } from '@surecart/components-react';
import { formatNumber } from '../../../../../admin/util';
import { translateInterval } from '../../../../../admin/util/translations';

export default ({ product, onSelect, children }) => {
	const [products, setProducts] = useState([]);
	const [query, setQuery] = useState('');
	const [busy, setBusy] = useState(false);

	const findProduct = throttle(
		(value) => {
			setQuery(value);
		},
		750,
		{ leading: false }
	);

	useEffect(() => {
		if (!query) return;
		fetchProducts();
	}, [query]);

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		setBusy(true);
		try {
			const response = await apiFetch({
				path: addQueryArgs(`surecart/v1/products`, {
					query,
					archived: false,
					expand: ['prices'],
				}),
			});
			setProducts(response);
		} catch (error) {
			console.error(error);
		} finally {
			setBusy(false);
		}
	};

	const displayPriceAmount = (price) => {
		if (price?.ad_hoc) {
			return __('Custom', 'surecart');
		}
		return `${formatNumber(
			price.amount,
			price.currency
		)}${translateInterval(
			price?.recurring_interval_count,
			price?.recurring_interval,
			'/',
			''
		)}`;
	};

	const choices = products.map((product) => {
		return {
			...product,
			label: product?.name,
			value: product.id,
			id: product.id,
			disabled: false,
			suffix: product?.prices?.data?.length
				? displayPriceAmount(product.prices.data[0]) // Show only the first price
				: __('No price', 'surecart'),
			description: '',
		};
	});

	return (
		<ScSelect
			loading={busy}
			placeholder={__('Select a product', 'surecart')}
			searchPlaceholder={__('Search for a product...', 'surecart')}
			search
			onScOpen={() => findProduct()}
			onScSearch={(e) => findProduct(e.detail)}
			onScChange={(e) =>
				onSelect(products.find((p) => p.id === e.detail.id))
			}
			value={product?.id || ''}
			choices={choices}
		>
			{children}
		</ScSelect>
	);
};
