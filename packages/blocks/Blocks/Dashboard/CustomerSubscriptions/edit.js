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
import { Fragment, useRef, useEffect } from '@wordpress/element';
import { __, _n } from '@wordpress/i18n';

export default ({ attributes, setAttributes }) => {
	const { title } = attributes;
	const subscription1Ref = useRef();
	const subscription2Ref = useRef();

	const blockProps = useBlockProps();

	var oneYearFromNow = new Date();
	oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

	const subscription1Data = {
		id: 'a',
		status: 'active',
		manual_payment: true,
		payment_method: null,
		current_period_end_at: oneYearFromNow.getTime() / 1000,
		current_period_end_at_date: oneYearFromNow.toLocaleDateString(),
		current_period: {
			total_amount: 2000,
			currency: scBlockData?.currency,
		},
		price: {
			recurring_interval_count: 1,
			recurring_interval: 'month',
			amount: 2000,
			product: {
				name: 'Monthly Subscription',
			},
		},
	};

	const subscription2Data = {
		id: 'b',
		status: 'trialing',
		manual_payment: false,
		trial_end_at: oneYearFromNow.getTime() / 1000,
		trial_end_at_date: oneYearFromNow.toLocaleDateString(),
		current_period: {
			total_amount: 2000,
			currency: scBlockData?.currency,
		},
		price: {
			recurring_interval_count: 1,
			recurring_interval: 'year',
			amount: 2000,
			product: {
				name: 'Yearly Subscription',
			},
		},
	};

	// Set subscription props directly for iframe compatibility
	useEffect(() => {
		if (subscription1Ref.current) {
			subscription1Ref.current.subscription = subscription1Data;
		}
		if (subscription2Ref.current) {
			subscription2Ref.current.subscription = subscription2Data;
		}
	}, []);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
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
					aria-label={__('Title', 'surecart')}
					placeholder={__('Add A Title…', 'surecart')}
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
								ref={subscription1Ref}
								subscription={subscription1Data}
							></ScSubscriptionDetails>
							<sc-icon
								name="chevron-right"
								slot="suffix"
							></sc-icon>
						</sc-stacked-list-row>
						<sc-stacked-list-row mobile-size={0}>
							<ScSubscriptionDetails
								ref={subscription2Ref}
								subscription={subscription2Data}
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
