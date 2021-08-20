const { __ } = wp.i18n;
const { BaseControl } = wp.components;

import Box from '../../ui/Box';
import TextControl from '../../components/TextControl';

export default ( { coupon, updateCoupon, loading } ) => {
	return (
		<Box
			title={ __( 'Coupon Name', 'checkout_engine' ) }
			loading={ loading }
		>
			<BaseControl>
				<TextControl
					className="ce-coupon-name"
					help={
						<div>
							{ __(
								'This is an internal name for your coupon. This is not visible to customers.',
								'checkout_engine'
							) }
						</div>
					}
					attribute="name"
					value={ coupon?.name }
					onChange={ ( name ) => updateCoupon( { name } ) }
					required
				/>
			</BaseControl>
		</Box>
	);
};
