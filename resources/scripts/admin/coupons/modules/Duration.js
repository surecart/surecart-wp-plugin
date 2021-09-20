import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import {
	CeChoices,
	CeChoice,
	CeFormRow,
	CeInput,
} from '@checkout-engine/react';

export default ( { coupon, updateCoupon, loading } ) => {
	return (
		<Box
			title={ __( 'Discount Duration', 'checkout_engine' ) }
			loading={ loading }
		>
			<CeFormRow>
				<CeChoices
					style={ { '--columns': 3 } }
					onCeChange={ ( e ) => {
						let duration_in_months = coupon?.duration_in_months;
						const duration = e.target.value;
						if (
							! duration_in_months &&
							duration === 'repeating'
						) {
							duration_in_months = 1;
						}
						updateCoupon( { duration, duration_in_months } );
					} }
				>
					<CeChoice
						value="forever"
						checked={
							coupon?.duration == 'forever' || ! coupon?.duration
						}
					>
						{ __( 'Forever', 'checkout_engine' ) }
						<span slot="description">
							{ __(
								'Discount will be applied forever.',
								'checkout_engine'
							) }
						</span>
					</CeChoice>
					<CeChoice
						value="once"
						checked={ coupon?.duration == 'once' }
					>
						{ __( 'Once', 'checkout_engine' ) }
						<span slot="description">
							{ __(
								'Discount will be applied once.',
								'checkout_engine'
							) }
						</span>
					</CeChoice>
					<CeChoice
						value="repeating"
						checked={ coupon?.duration == 'repeating' }
					>
						{ __( 'Repeating', 'checkout_engine' ) }
						<span slot="description">
							{ __(
								'Discount will repeat a specific number of times.',
								'checkout_engine'
							) }
						</span>
					</CeChoice>
				</CeChoices>
			</CeFormRow>
			{ /* <BaseControl>
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
			</BaseControl> */ }
			{ coupon?.duration === 'repeating' && (
				<CeFormRow>
					<CeInput
						label={ __( 'Number of months', 'checkout_engine' ) }
						className="ce-duration-in-months"
						value={ coupon?.duration_in_months || null }
						onCeChange={ ( e ) =>
							updateCoupon( {
								duration_in_months: e.target.value,
							} )
						}
						min="1"
						type="number"
						required={ coupon?.duration === 'repeating' }
					/>
				</CeFormRow>
			) }
		</Box>
	);
};
