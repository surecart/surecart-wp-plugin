import { __, _n, sprintf } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl } from '@wordpress/components';

export default ( { attributes, setAttributes } ) => {
	const { per_page } = attributes;
	return (
		<div>
			<InspectorControls>
				<PanelBody title={ __( 'Attributes', 'checkout_engine' ) }>
					<PanelRow>
						<RangeControl
							label={ __( 'Per Page', 'checkout_engine' ) }
							value={ per_page }
							onChange={ ( per_page ) =>
								setAttributes( { per_page } )
							}
							min={ 1 }
							max={ 30 }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<ce-customer-subscription
				subscription={ {
					cancel_at_period_end: false,
					checkout_session: '5a5bf8cb-6666-4867-93d4-d33e7f26ad33',
					created_at: 1640205172,
					currency: 'usd',
					current_period_end: 1641069172,
					current_period_start: 1640205174,
					customer: '6111d191-0a87-473d-8a0b-e4ee7f9498b2',
					discount: null,
					discount_amount: 0,
					ended_at: null,
					external_subscription_id: 'sub_1K9bUY2fa8CfSSGBfHFQ7Q32',
					id: '486aa040-1d80-40e9-87c3-9c2cf3b9c302',
					live_mode: false,
					object: 'subscription',
					payment_method: 'fa144c93-dfd0-4302-9e06-f684b7baec5f',
					processor_type: 'stripe',
					status: 'trialing',
					subtotal_amount: 19900,
					tax_amount: 0,
					total_amount: 19900,
					trial_end_at: 1641069172,
					updated_at: 1640207858,
				} }
			></ce-customer-subscription>
		</div>
	);
};
