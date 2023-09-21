import { __ } from '@wordpress/i18n';
import { ScSelect } from '@surecart/components-react';
import { useState, useEffect } from '@wordpress/element';
import throttle from 'lodash/throttle';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { translateInterval } from '../../admin/util/translations';
import { formatNumber } from '../../admin/util';

export default ({ onSelect, onlyShowProducts, onlyShowAdHocProducts }) => {
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
					ad_hoc: onlyShowAdHocProducts,
					expand: ['prices'],
				}),
			});
			setProducts(response);
		} catch (error) {
			console.log(error);
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
		if (onlyShowProducts) {
				return {
					label: product?.name,
					value: product.id,
				}
			}

		return {
			label: product?.name,
			id: product.id,
			disabled: false,
			choices: (product?.prices?.data || []).map((price) => {
				return {
					value: price.id,
					label: price.name,
					suffix: displayPriceAmount(price),
				};
			}),
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
			onScChange={(e) => {
				onSelect(e.target.value);
			}}
			choices={choices}
		/>
	);
};
