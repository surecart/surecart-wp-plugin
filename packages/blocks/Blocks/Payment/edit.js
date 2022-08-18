/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScAlert,
	ScCard,
	ScFormControl,
	ScIcon,
	ScPaymentSelected,
	ScSecureNotice,
	ScStripeElement,
	ScTag,
	ScToggle,
	ScToggles,
} from '@surecart/components-react';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RadioControl,
	TextControl,
} from '@wordpress/components';
import { Fragment, useEffect, useState } from '@wordpress/element';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

export default ({ className, attributes, setAttributes, context }) => {
	const [activeProcessors, setActiveProcessors] = useState([]);
	const { label, secure_notice, default_processor } = attributes;
	const [processor, setProcessor] = useState(default_processor);
	const { 'surecart/form/mode': mode } = context; // get mode context from parent.

	useEffect(() => {
		setProcessor(default_processor);
	}, [default_processor]);

	const processorOptions = () => {
		return (
			(scBlockData?.processors || [])
				.map((processor) => {
					if (processor.processor_type === 'stripe') {
						return {
							label: __('Stripe', 'surecart'),
							value: 'stripe',
						};
					}
					if (processor.processor_type === 'paypal') {
						return {
							label: __('PayPal', 'surecart'),
							value: 'paypal',
						};
					}
					return {
						label: processor?.processor_type.toUpperCase(),
						value: processor?.processor_type,
					};
				})
				// remove duplicates.
				.filter(
					(v, i, a) => a.findIndex((v2) => v2.value === v.value) === i
				)
		);
	};

	const hasProcessor = (type) => {
		return scBlockData?.processors.some((p) => p.processor_type === type);
	};

	useEffect(() => {
		setActiveProcessors(
			(scBlockData?.processors || [])
				// find only processors for this mode.
				.filter(
					(processor) => processor?.live_mode === (mode === 'live')
				)
		);
	}, [mode]);

	const options = processorOptions();

	const stripeProcessor = (scBlockData?.processors || []).find(
		(processor) =>
			processor?.live_mode === false &&
			processor?.processor_type === 'stripe'
	);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Secure Credit Card Notice', 'surecart')}
							value={secure_notice}
							onChange={(secure_notice) =>
								setAttributes({ secure_notice })
							}
						/>
					</PanelRow>
					<PanelRow>
						<RadioControl
							selected={default_processor || 'stripe'}
							label={__('Default Processor', 'surecart')}
							options={[
								...(hasProcessor('stripe')
									? [
											{
												label: __('Stripe', 'surecart'),
												value: 'stripe',
											},
									  ]
									: []),
								...(hasProcessor('paypal')
									? [
											{
												label: __('PayPal', 'surecart'),
												value: 'paypal',
											},
									  ]
									: []),
								...(hasProcessor('paypal') &&
								!hasProcessor('stripe')
									? [
											{
												label: __(
													'PayPal Card',
													'surecart'
												),
												value: 'paypal-card',
											},
									  ]
									: []),
							]}
							onChange={(default_processor) =>
								setAttributes({ default_processor })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			{!activeProcessors?.length ? (
				<sc-form-control label={label}>
					<sc-alert type="warning" open>
						<span slot="title">{__('Admin Notice')}</span>
						{sprintf(
							__(
								'There is no payment method for %1s payments. You will need to connect and verify your account with at least one processor in order to process %2s payments.',
								'surecart'
							),
							mode,
							mode
						)}
					</sc-alert>
				</sc-form-control>
			) : (
				<ScFormControl>
					<div class="sc-payment-label" slot="label">
						<div>{label}</div>
						{mode === 'test' && (
							<ScTag type="warning" size="small">
								{__('Test Mode', 'surecart')}
							</ScTag>
						)}
					</div>
					<ScToggles collapsible={false} theme="container">
						{hasProcessor('stripe') && (
							<ScToggle
								class="sc-stripe-toggle"
								show-control
								shady
								borderless
								open={processor === 'stripe'}
								onScShow={() => setProcessor('stripe')}
							>
								<span
									slot="summary"
									css={css`
										line-height: 1;
										display: flex;
										align-items: center;
										gap: 0.5em;
									`}
								>
									<ScIcon
										name="credit-card"
										style={{ fontSize: '24px' }}
									></ScIcon>
									<span>{__('Credit Card', 'surecart')}</span>
								</span>

								{!!scBlockData?.beta?.stripe_payment_element ? (
									<ScCard>
										<ScAlert open type="info">
											{__(
												'Please preview the form on the front-end to load the Stripe payment element fields.',
												'surecart'
											)}
										</ScAlert>
									</ScCard>
								) : (
									!!stripeProcessor?.processor_data
										?.publishable_key &&
									stripeProcessor?.processor_data
										?.account_id && (
										<div class="sc-payment__stripe-card-element">
											<ScStripeElement
												mode={'test'}
												publishableKey={
													stripeProcessor
														?.processor_data
														?.publishable_key
												}
												accountId={
													stripeProcessor
														?.processor_data
														?.account_id
												}
												secureText={secure_notice}
											/>
											<ScSecureNotice>
												{secure_notice}
											</ScSecureNotice>
										</div>
									)
								)}
							</ScToggle>
						)}

						{hasProcessor('paypal') && !hasProcessor('stripe') && (
							<ScToggle
								class="sc-paypal-card"
								show-control
								shady
								borderless
								open={processor === 'paypal-card'}
								onScShow={() => setProcessor('paypal-card')}
							>
								<span
									slot="summary"
									css={css`
										line-height: 1;
										display: flex;
										align-items: center;
										gap: 0.5em;
									`}
								>
									<ScIcon
										name="credit-card"
										style={{ fontSize: '24px' }}
									></ScIcon>
									<span>{__('Credit Card', 'surecart')}</span>
								</span>

								<ScCard>
									<ScPaymentSelected
										label={__(
											'Credit Card selected for check out.',
											'surecart'
										)}
									>
										<ScIcon
											slot="icon"
											name="credit-card"
										/>
										{__(
											'Another step will appear after submitting your order to complete your purchase details.',
											'surecart'
										)}
									</ScPaymentSelected>
								</ScCard>
							</ScToggle>
						)}

						<ScToggle
							class="sc-paypal-toggle"
							show-control
							shady
							borderless
							open={processor === 'paypal'}
							onScShow={() => setProcessor('paypal')}
						>
							<span
								slot="summary"
								css={css`
									line-height: 1;
									display: flex;
									align-items: center;
									gap: 0.5em;
								`}
							>
								<ScIcon
									name="paypal"
									style={{ width: '80px', fontSize: '24px' }}
								></ScIcon>
							</span>

							<ScCard>
								<ScPaymentSelected
									label={__(
										'PayPal selected for check out.',
										'surecart'
									)}
								>
									<ScIcon
										slot="icon"
										name="paypal"
										style={{ width: '80px' }}
									/>

									{__(
										'Another step will appear after submitting your order to complete your purchase details.',
										'surecart'
									)}
								</ScPaymentSelected>
							</ScCard>
						</ScToggle>
					</ScToggles>
				</ScFormControl>
			)}
		</Fragment>
	);
};
