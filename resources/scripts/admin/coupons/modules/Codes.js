const { __ } = wp.i18n;
const { BaseControl, TextControl } = wp.components;

import Box from '../../ui/Box';
import useCouponData from '../hooks/useCouponData';

export default ( { promotion, updatePromotion, loading } ) => {
	const { getValidationErrors } = useCouponData();

	return (
		<Box
			title={ __( 'Discount Code', 'checkout_engine' ) }
			loading={ loading }
		>
			<BaseControl>
				<TextControl
					value={ promotion?.code }
					help={
						<div>
							{ getValidationErrors( 'code' ) }
							{ __(
								'Customers will enter this discount code at checkout. Leave this blank and we will generate one for you.',
								'checkout_engine'
							) }
						</div>
					}
					onChange={ ( code ) => updatePromotion( { code } ) }
				/>
			</BaseControl>
		</Box>
	);
};
