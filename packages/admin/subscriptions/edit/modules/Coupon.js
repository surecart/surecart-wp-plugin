import Box from '../../../ui/Box';
import { ScButton, ScFormControl } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import ModelSelector from '../../../components/ModelSelector';
import { useState } from 'react';
import CouponDisplay from '../../show/modules/CouponDisplay';

export default ({
	subscription,
	updateSubscription,
	loading,
	hideEdit = false,
}) => {
	const [showAddCoupon, setShowAddCoupon] = useState(false);

	const onSelectCoupon = (coupon) => {
		setShowAddCoupon(false);
		updateSubscription({
			discount: {
				coupon,
			},
		});
	};

	const onRemoveCoupon = () => {
		updateSubscription({
			discount: {},
		});
	};

	if (subscription.discount) {
		return (
			<CouponDisplay
				onRemoveCoupon={hideEdit ? null : onRemoveCoupon}
				id={subscription.discount?.coupon || subscription.discount}
			/>
		);
	}

	return (
		<Box title={__('Coupon', 'surecart')} loading={loading}>
			<div>
				{showAddCoupon && !hideEdit && (
					<ScFormControl label={__('Add Coupon', 'surecart')}>
						<ModelSelector
							name="coupon"
							requestQuery={{
								archived: false,
							}}
							onSelect={onSelectCoupon}
						/>
					</ScFormControl>
				)}
				{!showAddCoupon && (
					<ScButton onClick={() => setShowAddCoupon(true)}>
						<sc-icon name="plus" slot="prefix"></sc-icon>
						{__('Add Coupon', 'surecart')}
					</ScButton>
				)}
			</div>
		</Box>
	);
};
