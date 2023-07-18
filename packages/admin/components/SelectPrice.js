import { __ } from '@wordpress/i18n';
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
	ad_hoc = true,
	loading,
	onScrollEnd = () => {},
	...props
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
				.map((price) => {
					const variants = product?.variants?.data || [];
					return variants
						.sort((a, b) => a?.position - b?.position)
						.map((variant) => {
							return {
								value: price.id,
								label: `${formatNumber(price.amount, price.currency)}${
									price?.archived ? ' (Archived)' : ''
								}`,
								suffix: intervalString(price, { showOnce: true }),
								tag: variant?.labels, // Add the variant label to the choice
								detail: {
									variant_id: variant?.id,
								},
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
			loading={loading}
			placeholder={__('Select a price', 'surecart')}
			searchPlaceholder={__('Search for a price...', 'surecart')}
			search
			onScOpen={onFetch}
			onScSearch={(e) => findProduct(e.detail)}
			onScChange={(e) => {
				onSelect({
					price_id: e.target.value,
					...e?.detail
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
		</ScSelect>
	);
};
