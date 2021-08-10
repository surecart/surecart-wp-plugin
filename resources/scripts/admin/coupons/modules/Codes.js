const { __ } = wp.i18n;
const { BaseControl, TextControl } = wp.components;

import Box from '../../ui/Box';

export default ( { promotion, updatePromotion, loading } ) => {
	return (
		<Box
			title={ __( 'Discount Code', 'checkout_engine' ) }
			loading={ loading }
		>
			<BaseControl>
				<TextControl
					value={ promotion?.code }
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
