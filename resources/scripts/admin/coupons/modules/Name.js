import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import { CeInput } from '@checkout-engine/react';

export default ( { coupon, updateCoupon, loading } ) => {
	return (
		<Box
			title={ __( 'Coupon Name', 'checkout_engine' ) }
			loading={ loading }
		>
			<CeInput
				className="ce-coupon-name"
				help={ __(
					'This is an internal name for your coupon. This is not visible to customers.',
					'checkout_engine'
				) }
				attribute="name"
				value={ coupon?.name }
				onCeChange={ ( e ) => updateCoupon( { name: e.target.value } ) }
			/>
		</Box>
	);
};
