/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;
const { BaseControl } = wp.components;

import Box from '../../ui/Box';
import SelectControl from '../../components/SelectControl';
import TextControl from '../../components/TextControl';

export default ( { coupon, updateCoupon, loading } ) => {
	return (
		<Box
			title={ __( 'Discount Duration', 'checkout_engine' ) }
			loading={ loading }
		>
			<BaseControl>
				<SelectControl
					className="ce-duration"
					value={ coupon?.duration || 'once' }
					attribute="duration"
					options={ [
						{
							value: 'forever',
							label: __( 'Forever', 'checkout_engine' ),
						},
						{
							value: 'once',
							label: __( 'Once', 'checkout_engine' ),
						},
						{
							value: 'repeating',
							label: __( 'Multiple months', 'checkout_engine' ),
						},
					] }
					help={ __(
						'For subscriptions, this determines how long this coupon will apply once redeemed.',
						'checkout_engine'
					) }
					onChange={ ( duration ) => {
						let duration_in_months = coupon?.duration_in_months;
						if (
							! duration_in_months &&
							duration === 'repeating'
						) {
							duration_in_months = 1;
						}
						updateCoupon( { duration, duration_in_months } );
					} }
					required
				/>
			</BaseControl>
			{ coupon?.duration === 'repeating' && (
				<BaseControl>
					<TextControl
						label={ __( 'Number of months', 'checkout_engine' ) }
						className="ce-duration-in-months"
						value={ coupon?.duration_in_months || null }
						attribute="duration_in_months"
						onChange={ ( duration_in_months ) =>
							updateCoupon( { duration_in_months } )
						}
						min="1"
						type="number"
						required={ coupon?.duration === 'repeating' }
					/>
				</BaseControl>
			) }
		</Box>
	);
};
