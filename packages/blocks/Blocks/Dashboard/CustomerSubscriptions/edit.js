/** @jsx jsx */
import OverlayLabel from '../../../components/OverlayLabel';
import { css, jsx } from '@emotion/core';
import {
	ScSubscriptionDetails,
	ScDashboardModule,
} from '@surecart/components-react';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __, _n } from '@wordpress/i18n';

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
							label={__('Title', 'surecart')}
							value={title}
							onChange={(title) => setAttributes({ title })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<ScDashboardModule {...blockProps}>
				<OverlayLabel>{__('Sample Data', 'surecart')}</OverlayLabel>
				<RichText
					aria-label={__('Title')}
					placeholder={__('Add A Title…')}
					value={title}
					onChange={(title) => setAttributes({ title })}
					withoutInteractiveFormatting
					slot="heading"
					allowedFormats={['core/bold', 'core/italic']}
				/>

				<sc-button type="link" slot="end">
					{__('View all', 'surecart')}
					<sc-icon name="chevron-right" slot="suffix"></sc-icon>
				</sc-button>

				<sc-card no-padding style={{ '--overflow': 'hidden' }}>
					<sc-stacked-list>
						<sc-stacked-list-row mobile-size={0}>
							<ScSubscriptionDetails
								subscription={{
									id: 'a',
									status: 'active',
									current_period_end_at:
										oneYearFromNow.getTime() / 1000,
									latest_period: {
										total_amount: 2000,
										currency: scBlockData?.currency,
									},
									price: {
										recurring_interval_count: 1,
										recurring_interval: 'month',
										product: {
											name: 'Monthly Subscription',
										},
									},
								}}
							></ScSubscriptionDetails>
							<sc-icon
								name="chevron-right"
								slot="suffix"
							></sc-icon>
						</sc-stacked-list-row>
						<sc-stacked-list-row mobile-size={0}>
							<ScSubscriptionDetails
								subscription={{
									id: 'b',
									status: 'trialing',
									trial_end_at:
										oneYearFromNow.getTime() / 1000,
									latest_period: {
										total_amount: 2000,
										currency: scBlockData?.currency,
									},
									price: {
										recurring_interval_count: 1,
										recurring_interval: 'year',
										product: {
											name: 'Yearly Subscription',
										},
									},
								}}
							></ScSubscriptionDetails>
							<sc-icon
								name="chevron-right"
								slot="suffix"
							></sc-icon>
						</sc-stacked-list-row>
					</sc-stacked-list>
				</sc-card>
			</ScDashboardModule>
		</Fragment>
	);
};
