import { __, sprintf } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import { ScSelect, ScDivider, ScMenuItem } from '@surecart/components-react';
import throttle from 'lodash/throttle';
import { formatNumber } from '../../admin/util';
import { styles } from '../../admin/styles/admin';
import { intervalString } from '../util/translations';

export default ({
	open,
	required,
	products,
	onSelect,
	value,
	className,
	onQuery,
	onFetch,
	onNew,
	children,
	ad_hoc = true,
	variable = true,
	exclude = [],
	excludeProducts = [],
	loading,
	onScrollEnd = () => {},
	includeVariants = true,
	showOutOfStock = false,
	prefix = false,
	...props
}) => {
	console.log('products', products);

	const selectRef = useRef();
	const findProduct = throttle(
		(value) => {
			onQuery(value);
		},
		750,
		{ leading: false }
	);

	const choices = (products || [])
		.filter((product) => {
			if (!variable && product?.variants?.data?.length) {
				return false;
			}
			if (!product?.prices?.data?.length) {
				return false;
			}
			if (excludeProducts && excludeProducts?.includes(product.id)) {
				return false;
			}
			return true;
		})
		.map((product) => {
			return {
				label: product?.name,
				id: product.id,
				disabled: false,
				choices: (product?.prices?.data || [])
					.filter((price) => {
						if (!ad_hoc && price?.ad_hoc) {
							return false;
						}
						return true;
					})
					.filter((price) => !price?.archived)
					.filter((price) => !exclude.includes(price.id))
					.map((price) => {
						const variants = product?.variants?.data || [];

						if (!includeVariants || !variants.length) {
							const priceUnavailable =
								product?.stock_enabled &&
								!product?.allow_out_of_stock_purchases &&
								0 >= product?.available_stock;
							return {
								value: price.id,
								label: `${formatNumber(
									price.amount,
									price.currency
								)}${price?.archived ? ' (Archived)' : ''}`,
								disabled: priceUnavailable && !showOutOfStock,
								suffixDescription: product?.stock_enabled
									? sprintf(
											__('%s available', 'surecart'),
											product?.available_stock
									  )
									: null,
								suffix: intervalString(price, {
									showOnce: true,
								}),
							};
						}

						return variants
							.sort((a, b) => a?.position - b?.position)
							.map((variant) => {
								const variantUnavailable =
									product?.stock_enabled &&
									!product?.allow_out_of_stock_purchases &&
									0 >= variant?.available_stock;
								const variantLabel = [
									variant?.option_1,
									variant?.option_2,
									variant?.option_3,
								]
									.filter(Boolean)
									.join(' / ');
								return {
									value: price.id,
									label: `${formatNumber(
										variant?.amount ?? price.amount,
										price.currency
									)}${price?.archived ? ' (Archived)' : ''}`,
									suffix: `(${variantLabel}) ${intervalString(
										price,
										{ showOnce: true }
									)}`,
									suffixDescription: product?.stock_enabled
										? sprintf(
												__('%s available', 'surecart'),
												variant?.available_stock
										  )
										: null,
									disabled:
										variantUnavailable && !showOutOfStock,
									variant_id: variant?.id,
								};
							});
					})
					.flat(),
			};
		});

	return (
		<ScSelect
			style={styles}
			required={required}
			ref={selectRef}
			value={value}
			className={className}
			open={open}
			loading={loading}
			placeholder={__('Select a price', 'surecart')}
			searchPlaceholder={__('Search for a price...', 'surecart')}
			search
			onScOpen={onFetch}
			onScSearch={(e) => findProduct(e.detail)}
			onScChange={(e) => {
				if (e?.detail?.suffixUnavailable) {
					alert(__('Variant Out of Stock.', 'surecart'));
					return;
				}
				onSelect({
					price_id: e?.target?.value,
					variant_id: e?.detail?.variant_id,
				});
			}}
			choices={choices}
			onScScrollEnd={onScrollEnd}
			{...props}
		>
			{onNew && (
				<span slot="prefix">
					<ScMenuItem onClick={onNew}>
						<span slot="prefix">+</span>
						{__('Add New Product', 'surecart')}
					</ScMenuItem>
					<ScDivider
						style={{ '--spacing': 'var(--sc-spacing-x-small)' }}
					></ScDivider>
				</span>
			)}

			{prefix && <span slot="prefix">{prefix}</span>}

			{children}
		</ScSelect>
	);
};
