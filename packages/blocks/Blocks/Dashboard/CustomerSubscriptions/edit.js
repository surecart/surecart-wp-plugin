import { __, _n } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import {
	CeSubscriptionDetails,
	CeDashboardModule,
} from '@checkout-engine/components-react';
import { Fragment } from 'react';

export default ({ attributes, setAttributes }) => {
	const { title } = attributes;

	const blockProps = useBlockProps();

	var oneYearFromNow = new Date();
	oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody>
					<PanelRow>
						<TextControl
							label={__('Title', 'checkout_engine')}
							value={title}
							onChange={(title) => setAttributes({ title })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<CeDashboardModule {...blockProps}>
				<RichText
					aria-label={__('Title')}
					placeholder={__('Add A Title…')}
					value={title}
					onChange={(title) => setAttributes({ title })}
					withoutInteractiveFormatting
					slot="heading"
					allowedFormats={['core/bold', 'core/italic']}
				/>

				<ce-button type="link" slot="end">
					{__('View all', 'checkout_engine')}
					<ce-icon name="chevron-right" slot="suffix"></ce-icon>
				</ce-button>

				<ce-card no-padding style={{ '--overflow': 'hidden' }}>
					<ce-stacked-list>
						<ce-stacked-list-row mobile-size={0}>
							<CeSubscriptionDetails
								subscription={{
									id: 'a',
									status: 'active',
									current_period_end_at:
										oneYearFromNow.getTime() / 1000,
									latest_invoice: {
										total_amount: 2000,
										currency: 'usd',
									},
									price: {
										recurring_interval_count: 1,
										recurring_interval: 'month',
										product: {
											name: 'Monthly Subscription',
										},
									},
								}}
							></CeSubscriptionDetails>
							<ce-icon
								name="chevron-right"
								slot="suffix"
							></ce-icon>
						</ce-stacked-list-row>
						<ce-stacked-list-row mobile-size={0}>
							<CeSubscriptionDetails
								subscription={{
									id: 'b',
									status: 'trialing',
									trial_end_at:
										oneYearFromNow.getTime() / 1000,
									latest_invoice: {
										total_amount: 2000,
										currency: 'usd',
									},
									price: {
										recurring_interval_count: 1,
										recurring_interval: 'year',
										product: {
											name: 'Yearly Subscription',
										},
									},
								}}
							></CeSubscriptionDetails>
							<ce-icon
								name="chevron-right"
								slot="suffix"
							></ce-icon>
						</ce-stacked-list-row>
					</ce-stacked-list>
				</ce-card>
			</CeDashboardModule>
		</Fragment>
	);
};
