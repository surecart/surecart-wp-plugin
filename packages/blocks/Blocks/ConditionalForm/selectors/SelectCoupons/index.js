/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from '@wordpress/element';
import ModelSelector from '../../../../../admin/components/ModelSelector';
import {
	ScButton,
	ScCard,
	ScFormControl,
	ScIcon,
	ScStackedList,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import CouponItem from './CouponItem';
import { getFormattedPrice } from '../../../../../admin/util';

export default (props) => {
	const { label, value, placeholder, onChange } = props;
	const [addNew, setAddNew] = useState(false);

	const formattedDiscount = (item) => {
		if (item?.percent_off) {
			return sprintf(__('%s%% off', 'surecart'), item?.percent_off);
		}
		if (item?.amount_off) {
			return sprintf(
				__('%s off', 'surecart'),
				getFormattedPrice({
					amount: item?.amount_off,
					currency: item?.currency,
				})
			);
		}
		return null;
	};

	return (
		<>
			{!!(value || [])?.length && (
				<ScCard noPadding>
					<ScStackedList>
						{(value || []).map((id) => (
							<CouponItem
								id={id}
								key={id}
								onRemove={() =>
									onChange(
										(value || []).filter(
											(existing) => existing !== id
										)
									)
								}
							/>
						))}
					</ScStackedList>
				</ScCard>
			)}
			{!(value || [])?.length || addNew ? (
				<ScFormControl
					label={label}
					showLabel={false}
					css={css`
						display: grid;
						gap: var(--sc-spacing-medium);
					`}
				>
					<ModelSelector
						placeholder={placeholder}
						name="coupon"
						requestQuery={{
							archived: false,
						}}
						display={(item) =>
							`${item?.name} - ${formattedDiscount(item)}`
						}
						exclude={value}
						onSelect={(id) => {
							if (id) {
								onChange([
									...new Set([...(value || []), ...[id]]),
								]);
							}
						}}
						onClose={() => setAddNew(false)}
						open={addNew}
					/>
				</ScFormControl>
			) : (
				<div>
					<ScButton type="link" onClick={() => setAddNew(true)}>
						<ScIcon name="plus" slot="prefix" />
						{__('Add Another Coupon', 'surecart')}
					</ScButton>
				</div>
			)}
		</>
	);
};
