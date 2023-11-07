import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import { ScInput } from '@surecart/components-react';

export default ({ coupon, updateCoupon, loading }) => {
	return (
		<Box title={__('Coupon Name', 'surecart')} loading={loading}>
			<ScInput
				className="sc-coupon-name"
				help={__(
					'This is an internal name for your coupon. This is not visible to customers.',
					'surecart'
				)}
				attribute="name"
				required
				value={coupon?.name}
				onScInput={(e) => updateCoupon({ name: e.target.value })}
			/>
		</Box>
	);
};
