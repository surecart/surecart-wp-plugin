import { ScDivider, ScMenuItem, ScSelect } from '@surecart/components-react';
import { useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import throttle from 'lodash/throttle';

import { styles } from '../../admin/styles/admin';
import { formatNumber } from '../../admin/util';
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
	ad_hoc,
	loading,
	includeVariants = true,
}) => {
	const selectRef = useRef();
	const findProduct = throttle(
		(value) => {
			onQuery(value);
		},
		750,
		{ leading: false }
	);
	
	const choices = (products || [])
		.filter((product) => !!product?.prices?.data?.length)
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
					.map((price) => {
						const variants = product?.variants?.data || [];
						
						if ( ! includeVariants || ! variants.length) {
							return {
								value: price.id,
								label: price?.ad_hoc
									? __('Name Your Price', 'surecart')
									: formatNumber(price.amount, price.currency),
								suffix:intervalString(price, {
									showOnce: true,
								}),
							};
						}

						return variants
							.sort((a, b) => a?.position - b?.position)
							.map((variant) => {
								const variantLabel = [variant?.option_1, variant?.option_2, variant?.option_3].filter(Boolean).join(' / ');
								return {
									value: price.id,
									label: price?.ad_hoc
										? __('Name Your Price', 'surecart')
										: formatNumber(price.amount, price.currency),
									suffix: `(${variantLabel}) ${intervalString(price, { showOnce: true })}`,
									variant_id: variant?.id,
									
								};
						});
					}).flat(),
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
			showParentLabel
			loading={loading}
			placeholder={__('Select a product', 'surecart')}
			searchPlaceholder={__('Search for a product...', 'surecart')}
			search
			onScOpen={onFetch}
			onScSearch={(e) => findProduct(e.detail)}
			onScChange={(e) => {
				onSelect({
					price_id: e?.target?.value,
					variant_id: e?.detail?.variant_id
				});
			}}
			choices={choices}
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
		</ScSelect>
	);
};
