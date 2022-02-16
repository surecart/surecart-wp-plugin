import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import {
	CeSelect,
	CeDivider,
	CeMenuItem,
} from '@checkout-engine/components-react';
import throttle from 'lodash/throttle';
import { translateInterval } from '../../admin/util/translations';
import { formatNumber } from '../../admin/util';

export default ({
	open,
	required,
	products,
	prices,
	onSelect,
	value,
	className,
	onQuery,
	onFetch,
	onNew,
	ad_hoc = true,
	loading,
}) => {
	const selectRef = useRef();
	const findProduct = throttle(
		(value) => {
			onQuery(value);
		},
		750,
		{ leading: false }
	);

	const choices = (products || []).map((product) => {
		const productPrices = (prices || []).filter(
			(price) => price.product === product?.id
		);
		return {
			label: product?.name,
			id: product.id,
			disabled: false,
			choices: (productPrices || [])
				.filter((price) => {
					if (!ad_hoc && price.ad_hoc) {
						return false;
					}
					return true;
				})
				.map((price) => {
					return {
						value: price.id,
						label: formatNumber(price.amount, price.currency),
						suffix: translateInterval(
							price?.recurring_interval_count,
							price?.recurring_interval,
							'every',
							'once'
						),
					};
				}),
		};
	});

	return (
		<CeSelect
			required={required}
			ref={selectRef}
			value={value}
			className={className}
			open={open}
			loading={loading}
			placeholder={__('Select a product', 'checkout_engine')}
			searchPlaceholder={__('Search for a product...', 'checkout_engine')}
			search
			onCeOpen={onFetch}
			onCeSearch={(e) => findProduct(e.detail)}
			onCeChange={(e) => {
				onSelect(e.target.value);
			}}
			choices={choices}
		>
			{onNew && (
				<span slot="prefix">
					<CeMenuItem onClick={onNew}>
						<span slot="prefix">+</span>
						{__('Add New Product', 'checkout_engine')}
					</CeMenuItem>
					<CeDivider
						style={{ '--spacing': 'var(--ce-spacing-x-small)' }}
					></CeDivider>
				</span>
			)}
		</CeSelect>
	);
};
