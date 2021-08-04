const { __ } = wp.i18n;
const { BaseControl, TextControl } = wp.components;

import Box from '../../ui/Box';

export default ( { coupon, updateCoupon } ) => {
	return (
		<Box title={ __( 'Discount Code', 'checkout_engine' ) }>
			<BaseControl>
				<TextControl
					value={ coupon?.percent_off }
					help={ __(
						'Customers will enter this discount code at checkout.',
						'checkout_engine'
					) }
					onChange={ ( percent_off ) =>
						updateCoupon( { percent_off } )
					}
				/>
			</BaseControl>
		</Box>
	);
};
