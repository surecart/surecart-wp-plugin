import { __, _n, sprintf } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl } from '@wordpress/components';
import { CeCustomerSubscription } from '@checkout-engine/react';

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
			<CeCustomerSubscription
				upgradeGroups={ [
					[
						'4bcdd50a-7617-45d1-bf17-a4cdec20f579',
						'4bcdd50a-7617-45d1-bf17-a4cdec20f579',
					],
				] }
				subscription={ {
					id: '626c5e42-87fa-4712-ad92-1e0f07f103e5',
					object: 'subscription',
					currency: 'usd',
					status: 'trialing',
					subtotal_amount: 22400,
					discount_amount: 0,
					tax_amount: 0,
					total_amount: 22400,
					external_subscription_id: 'sub_1K9vXx2fa8CfSSGBbV1xDkkJ',
					live_mode: true,
					cancel_at_period_end: false,
					current_period_end: Math.floor( Date.now() / 1000 ),
					current_period_start: 1640282265,
					ended_at: null,
					trial_end_at: Math.floor( Date.now() / 1000 ),
					processor_type: 'stripe',
					checkout_session: 'fb9dae7b-046c-4389-82ea-1524e79941f5',
					customer: '6111d191-0a87-473d-8a0b-e4ee7f9498b2',
					discount: null,
					payment_method: 'c7902c01-d6c3-4185-bbbe-0c74e16e1756',
					subscription_items: {
						object: 'list',
						pagination: {
							count: 1,
							limit: 20,
							page: 1,
							url:
								'/api/v1/subscription_items?subscription_ids%5B%5D=626c5e42-87fa-4712-ad92-1e0f07f103e5',
						},
						data: [
							{
								id: '1f73250b-3949-4d18-a448-653cf4656441',
								object: 'subscription_item',
								quantity: 1,
								subtotal_amount: 2500,
								price: {
									id: '4bcdd50a-7617-45d1-bf17-a4cdec20f579',
									object: 'price',
									name: 'Sneakers Subscription',
									description: null,
									metadata: { wp_created_by: '1' },
									amount: 2500,
									currency: 'usd',
									recurring: true,
									recurring_interval: 'year',
									recurring_interval_count: 1,
									trial_duration_days: null,
									ad_hoc: false,
									ad_hoc_max_amount: null,
									ad_hoc_min_amount: 0,
									tax_behavior: 'exclusive',
									current_version: true,
									archived: false,
									archived_at: null,
									product: {
										id:
											'87fda5b2-5bec-4e67-8aad-5d8c76ede399',
										object: 'product',
										name: 'Fancy Sneakers',
										description:
											'A pair of fancy sneakers.',
										tax_enabled: true,
										tax_category: null,
										metadata: [],
										archived: false,
										archived_at: null,
										image_url: null,
										metrics: {
											max_price_amount: 2900,
											min_price_amount: 2500,
											prices_count: 2,
											currency: 'usd',
										},
										created_at: 1624719352,
										updated_at: 1640282189,
									},
									created_at: 1640282189,
									updated_at: 1640282189,
								},
								subscription:
									'626c5e42-87fa-4712-ad92-1e0f07f103e5',
								created_at: 1640282264,
								updated_at: 1640282264,
							},
						],
					},
					created_at: 1640282264,
					updated_at: 1640298447,
				} }
			/>
		</div>
	);
};
