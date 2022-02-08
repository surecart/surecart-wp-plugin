import { __, _n, sprintf } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl } from '@wordpress/components';
import { CeSubscription } from '@checkout-engine/components-react';

export default ({ attributes, setAttributes }) => {
	return (
		<div>
			<CeSubscription
				upgradeGroups={[
					[
						'4bcdd50a-7617-45d1-bf17-a4cdec20f579',
						'4bcdd50a-7617-45d1-bf17-a4cdec20f579',
					],
				]}
				subscription={{
					id: 'a6c01584-a99b-4326-8438-3ced81551dd3',
					object: 'subscription',
					cancel_at_period_end: false,
					currency: 'usd',
					current_period_end_at: 1645155815,
					current_period_start_at: 1642477415,
					ended_at: null,
					live_mode: false,
					metadata: {},
					pending_update: {},
					status: 'active',
					trial_end_at: null,
					trial_start_at: null,
					quantity: 1,
					order: '82fde621-c19c-486e-917c-63bd38eae72b',
					customer: '3c6de82b-4c19-4613-b429-217c9f3c60b1',
					discount: null,
					latest_invoice: {
						id: '1ffb9650-5902-49a6-966c-f5dd6698a02d',
						object: 'invoice',
						amount_due: 0,
						applied_balance_amount: 0,
						currency: 'usd',
						discount_amount: 0,
						live_mode: true,
						metadata: {},
						number: '93B86131',
						period_end_at: 1645155815,
						period_start_at: 1642477415,
						processor_data: {
							stripe: {
								account_id: 'acct_1JDwrw2fa8CfSSGB',
								publishable_key:
									'pk_test_51FrVhTKIxBDlEhovnzFUjE1K3e8s9QInYW4a2S1BrYYgePmNIFZUCSvUY90MmD10PNh0ZxYFoxkW6P1xsfPofCYG00JTdSKWFO',
							},
						},
						proration_amount: 0,
						status: 'paid',
						subtotal_amount: 2900,
						tax_amount: 0,
						tax_status: 'calculated',
						tax_label: null,
						total_amount: 2900,
						billing_address: null,
						charge: '806d1fdd-d5e8-4cd8-9739-b1a043679abf',
						customer: '3c6de82b-4c19-4613-b429-217c9f3c60b1',
						discount: null,
						payment_intent: 'ac886271-fed5-41f5-afa8-4d977ba80bf2',
						payment_method: 'b6503162-6d1e-44d4-81de-853e1bc3b214',
						shipping_address: null,
						subscription: 'a6c01584-a99b-4326-8438-3ced81551dd3',
						tax_identifier: null,
						created_at: 1642477415,
						updated_at: 1642477415,
					},
					payment_method: 'b6503162-6d1e-44d4-81de-853e1bc3b214',
					price: {
						id: '912fb087-9e86-4db0-9ea6-dd8ed4f47126',
						object: 'price',
						ad_hoc: false,
						ad_hoc_max_amount: null,
						ad_hoc_min_amount: 0,
						amount: 2900,
						archived: false,
						archived_at: null,
						currency: 'usd',
						current_version: true,
						description: null,
						metadata: { wp_created_by: '1' },
						name: 'Monthly',
						recurring: true,
						recurring_interval: 'month',
						recurring_interval_count: 1,
						tax_behavior: 'exclusive',
						trial_duration_days: null,
						product: {
							id: 'ce0b2a6c-64c7-40c6-aa50-0a5ee250a004',
							object: 'product',
							archived: false,
							archived_at: null,
							description: 'A membership for this site.',
							image_url:
								'https://presto-pay-staging.herokuapp.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWt3T0RReE0yWTRaaTAxTldVd0xUUXlZVEF0WW1Oak1TMWpabUl3WW1NMVpERXhOR0VHT2daRlZBPT0iLCJleHAiOm51bGwsInB1ciI6ImJsb2JfaWQifX0=--6dbb9d21ddad6b1a716a3c25f38014367e7a2ea8/elves.webp',
							metadata: {},
							metrics: {
								currency: 'usd',
								max_price_amount: 29900,
								min_price_amount: 2900,
								prices_count: 3,
							},
							name: 'Membership',
							tax_enabled: true,
							tax_category: null,
							created_at: 1624910581,
							updated_at: 1641744453,
						},
						created_at: 1640106989,
						updated_at: 1641744453,
					},
					created_at: 1642477415,
					updated_at: 1642477415,
				}}
			/>
		</div>
	);
};
