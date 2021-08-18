const { __ } = wp.i18n;
const { BaseControl, TextControl } = wp.components;
const { useSelect } = wp.data;
import { STORE_KEY as UI_STORE_KEY } from '../../store/ui';

import Box from '../../ui/Box';
import ValidationErrors from '../../components/ValidationErrors';
import useValidationErrors from '../../hooks/useValidationErrors';

export default ( { coupon, updateCoupon, loading } ) => {
	const { errors, hasErrors } = useValidationErrors( 'name' );

	return (
		<Box
			title={ __( 'Coupon Name', 'checkout_engine' ) }
			loading={ loading }
		>
			<BaseControl>
				<TextControl
					value={ coupon?.name }
					className={ hasErrors ? 'is-error' : '' }
					help={
						<div>
							<ValidationErrors errors={ errors } />
							{ __(
								'This is an internal name for your coupon. This is not visible to customers.',
								'checkout_engine'
							) }
						</div>
					}
					onChange={ ( name ) => updateCoupon( { name } ) }
				/>
			</BaseControl>
		</Box>
	);
};
