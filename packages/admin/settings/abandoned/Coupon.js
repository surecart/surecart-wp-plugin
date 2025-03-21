import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import {
	ScInput,
	ScPriceInput,
	ScRadioGroup,
	ScRadio,
} from '@surecart/components-react';
import CouponDiscountDuration from '../../components/coupon/CouponDiscountDuration';

export default ({ coupon: { id } }) => {
	const { editEntityRecord } = useDispatch(coreStore);
	const { coupon, loading } = useSelect(
		(select) => {
			if (!id) return {};
			const entityData = ['surecart', 'coupon', id];
			return {
				coupon: select(coreStore)?.getEditedEntityRecord?.(
					...entityData
				),
				loading: select(coreStore)?.isResolving?.(
					'getEditedEntityRecord',
					[...entityData]
				),
			};
		},
		[id]
	);

	const updateCoupon = (data) =>
		editEntityRecord('surecart', 'coupon', id, data);

	const [type, setType] = useState('percentage');

	useEffect(() => {
		if (coupon?.amount_off) {
			setType('fixed');
		}
	}, [coupon?.amount_off]);

	return (
		<>
			<ScRadioGroup
				label={__('Choose a type', 'surecart')}
				onScChange={(e) => setType(e.target.value)}
			>
				<ScRadio value="percentage" checked={type === 'percentage'}>
					{__('Percentage Discount', 'surecart')}
				</ScRadio>
				<ScRadio value="fixed" checked={type === 'fixed'}>
					{__('Fixed Discount', 'surecart')}
				</ScRadio>
			</ScRadioGroup>

			{type === 'percentage' ? (
				<ScInput
					className="sc-percent-off"
					type="number"
					min="0"
					disabled={type !== 'percentage'}
					max="100"
					attribute="percent_off"
					label={__('Percent Off', 'surecart')}
					value={coupon?.percent_off || null}
					onScInput={(e) =>
						updateCoupon({
							amount_off: null,
							percent_off: e.target.value,
						})
					}
					required={type === 'percentage'}
				>
					<span slot="suffix">%</span>
				</ScInput>
			) : (
				<ScPriceInput
					className="sc-amount-off"
					currencyCode={coupon?.currency}
					disabled={type === 'percentage'}
					attribute="amount_off"
					label={__('Amount Off', 'surecart')}
					value={coupon?.amount_off || null}
					required={type === 'fixed'}
					onScInput={(e) => {
						updateCoupon({
							percent_off: null,
							amount_off: e.target.value,
						});
					}}
				/>
			)}

			<CouponDiscountDuration
				coupon={coupon}
				updateCoupon={updateCoupon}
			/>
		</>
	);
};
