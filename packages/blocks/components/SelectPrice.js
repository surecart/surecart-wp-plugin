import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { ScSelect, ScDivider, ScMenuItem } from '@surecart/components-react';
import throttle from 'lodash/throttle';
import { translateInterval } from '../../admin/util/translations';
import { formatNumber } from '../../admin/util';
import { styles } from '../../admin/styles/admin';
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
						return {
							value: price.id,
							label: price?.ad_hoc
								? __('Name Your Price', 'surecart')
								: formatNumber(price.amount, price.currency),
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
				onSelect(e.target.value);
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
