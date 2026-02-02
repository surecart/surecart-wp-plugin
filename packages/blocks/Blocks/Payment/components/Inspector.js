/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { Flex, PanelBody, PanelRow, TextControl } from '@wordpress/components';
import PaymentMethodCheckbox from './PaymentMethodCheckbox';

export default ({ attributes, setAttributes }) => {
	const { label, disabled_methods } = attributes;

	const hasProcessor = (name) =>
		scBlockData?.processors?.some((p) => p.processor_type === name);
	const isDisabled = (name) => (disabled_methods || []).includes(name);
	const isMollieEnabled = hasProcessor('mollie') && !isDisabled('mollie');

	return (
		<InspectorControls>
			<PanelBody title={__('Attributes', 'surecart')}>
				<PanelRow>
					<TextControl
						label={__('Label', 'surecart')}
						value={label}
						onChange={(label) => setAttributes({ label })}
					/>
				</PanelRow>
			</PanelBody>
			<PanelBody
				title={
					<Flex align={'center'} gap={8}>
						{__('Enabled Processors', 'surecart')}{' '}
					</Flex>
				}
				initialOpen={true}
			>
				<PanelRow>
					<p>
						{__(
							'Disable or enable specific processors for this form.',
							'surecart'
						)}
					</p>
				</PanelRow>

				{hasProcessor('mollie') && (
					<PanelRow>
						<PaymentMethodCheckbox
							name={__('Mollie', 'surecart')}
							help={__('Enable Mollie processor', 'surecart')}
							id={'mollie'}
							attributes={attributes}
							setAttributes={setAttributes}
						/>
					</PanelRow>
				)}

				{hasProcessor('stripe') && (
					<PanelRow>
						<PaymentMethodCheckbox
							name={__('Stripe', 'surecart')}
							help={__('Enable Stripe payment', 'surecart')}
							id={'stripe'}
							attributes={attributes}
							setAttributes={setAttributes}
							disabled={isMollieEnabled}
						/>
					</PanelRow>
				)}

				{hasProcessor('paypal') && (
					<PanelRow>
						<PaymentMethodCheckbox
							name={__('PayPal', 'surecart')}
							help={__('Enable PayPal payment', 'surecart')}
							id={'paypal'}
							attributes={attributes}
							setAttributes={setAttributes}
							disabled={isMollieEnabled}
						/>
					</PanelRow>
				)}

				{hasProcessor('paystack') && (
					<PanelRow>
						<PaymentMethodCheckbox
							name={__('Paystack', 'surecart')}
							help={__('Enable Paystack payment', 'surecart')}
							id={'paystack'}
							attributes={attributes}
							setAttributes={setAttributes}
							disabled={isMollieEnabled}
						/>
					</PanelRow>
				)}

				{hasProcessor('mock') && (
					<PanelRow>
						<PaymentMethodCheckbox
							name={__('Test Processor', 'surecart')}
							help={__(
								'Enable a test processor (in test mode only)',
								'surecart'
							)}
							id={'mock'}
							attributes={attributes}
							setAttributes={setAttributes}
						/>
					</PanelRow>
				)}

				{scBlockData?.manualPaymentMethods.map((method) => (
					<PanelRow key={method?.id}>
						<PaymentMethodCheckbox
							name={method?.name}
							help={method?.description}
							id={method?.id}
							attributes={attributes}
							setAttributes={setAttributes}
						/>
					</PanelRow>
				))}
			</PanelBody>
		</InspectorControls>
	);
};
