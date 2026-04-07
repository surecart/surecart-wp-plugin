import { __, sprintf } from '@wordpress/i18n';
import { useRef, useEffect, useCallback } from '@wordpress/element';
import { ScSelect, ScDivider, ScMenuItem } from '@surecart/components-react';
import throttle from 'lodash/throttle';
import { formatNumber } from '../../admin/util';
import { styles } from '../../admin/styles/admin';
import { intervalString } from '../../admin/util/translations';

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
	ad_hoc,
	variable = true,
	loading,
	onScrollEnd = () => {},
	includeVariants = true,
	allowOutOfStockSelection = false,
	style: externalStyle,
	...props
}) => {
	const selectRef = useRef();

	const findProduct = useCallback(
		throttle(
			(value) => {
				onQuery(value);
			},
			750,
			{ leading: false }
		),
		[]
	);

	const choices = (products || [])
		.filter((product) => !!product?.prices?.data?.length)
		.filter((product) => {
			if (!variable && product?.variants?.data?.length) {
				return false;
			}
			return true;
		})
		.filter((product) => {
			if (ad_hoc === true) {
				if (
					!product?.prices?.data.some(
						(price) => price.ad_hoc === true
					)
				) {
					return false;
				}
			}

			if (ad_hoc === false) {
				if (
					!product?.prices?.data.some(
						(price) => price.ad_hoc === false
					)
				) {
					return false;
				}
			}

			if (!product?.prices?.data?.length) {
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
						if (ad_hoc === false) {
							if (price.ad_hoc) {
								return false;
							}
						}

						if (ad_hoc === true) {
							if (!price.ad_hoc) {
								return false;
							}
						}

						return true;
					})
					.filter((price) => !price?.archived)
					.map((price) => {
						const variants = product?.variants?.data || [];

						if (!includeVariants || !variants.length) {
							const priceUnavailable =
								product?.stock_enabled &&
								!product?.allow_out_of_stock_purchases &&
								0 >= product?.available_stock;
							return {
								value: price.id,
								label: price?.ad_hoc
									? __('Name Your Price', 'surecart')
									: formatNumber(
											price.amount,
											price.currency
									  ),
								disabled:
									priceUnavailable &&
									!allowOutOfStockSelection,
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
									label: price?.ad_hoc
										? __('Name Your Price', 'surecart')
										: formatNumber(
												variant?.amount || price.amount,
												price.currency
										  ),
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
										variantUnavailable &&
										!allowOutOfStockSelection,
									variant_id: variant?.id,
								};
							});
					})
					.flat(),
			};
		});

	// Set choices directly on the element for iframe compatibility.
	useEffect(() => {
		if (selectRef.current) {
			selectRef.current.choices = choices;
		}
	}, [products]);

	// Register event listeners directly for iframe compatibility.
	useEffect(() => {
		const element = selectRef.current;
		if (!element) return;

		const handleOpen = () => onFetch();
		const handleSearch = (e) => findProduct(e.detail);
		const handleChange = (e) => {
			if (!e?.target?.value) return;
			if (e?.detail?.suffixUnavailable) {
				alert(__('Variant Out of Stock.', 'surecart'));
				return;
			}
			onSelect({
				price_id: e?.target?.value,
				variant_id: e?.detail?.variant_id,
			});
		};
		const handleScrollEnd = () => onScrollEnd();

		element.addEventListener('scOpen', handleOpen);
		element.addEventListener('scSearch', handleSearch);
		element.addEventListener('scChange', handleChange);
		element.addEventListener('scScrollEnd', handleScrollEnd);

		return () => {
			element.removeEventListener('scOpen', handleOpen);
			element.removeEventListener('scSearch', handleSearch);
			element.removeEventListener('scChange', handleChange);
			element.removeEventListener('scScrollEnd', handleScrollEnd);
		};
	}, [onFetch, onScrollEnd, onSelect, findProduct]);

	return (
		<ScSelect
			{...props}
			style={{
				...styles,
				width: '100%',
				minWidth: '24rem',
				borderStyle: 'none',
				...externalStyle,
			}}
			required={required}
			ref={selectRef}
			value={value}
			className={className}
			showParentLabel
			loading={loading}
			placeholder={__('Select a product', 'surecart')}
			searchPlaceholder={__('Search for a product...', 'surecart')}
			search
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
			{children}
		</ScSelect>
	);
};
