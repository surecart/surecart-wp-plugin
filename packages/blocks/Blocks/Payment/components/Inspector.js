/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	BaseControl,
	Flex,
	PanelBody,
	PanelRow,
	TextControl,
} from '@wordpress/components';
import PaymentMethodCheckbox from './PaymentMethodCheckbox';
import { ScPremiumTag, ScUpgradeRequired } from '@surecart/components-react';

export default ({ attributes, setAttributes }) => {
	const { label, secure_notice } = attributes;

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
				<PanelRow>
					<TextControl
						label={__('Secure Credit Card Notice', 'surecart')}
						value={secure_notice}
						onChange={(secure_notice) =>
							setAttributes({ secure_notice })
						}
					/>
				</PanelRow>
			</PanelBody>
			<PanelBody
				title={
					<Flex align={'center'} gap={8}>
						{__('Enabled Processors', 'surecart')}{' '}
						{!scBlockData?.entitlements
							?.form_specific_payment_methods && (
							<ScUpgradeRequired>
								<ScPremiumTag />
							</ScUpgradeRequired>
						)}
					</Flex>
				}
				initialOpen={
					scBlockData?.entitlements?.form_specific_payment_methods
				}
			>
				<PanelRow>
					<p>
						{__(
							'Disable or enable specific processors for this form.',
							'surecart'
						)}
					</p>
				</PanelRow>

				<PanelRow>
					<PaymentMethodCheckbox
						name={__('Stripe', 'surecart')}
						help={__('Enable Stripe payment', 'surecart')}
						id={'stripe'}
						attributes={attributes}
						setAttributes={setAttributes}
					/>
				</PanelRow>

				<PanelRow>
					<PaymentMethodCheckbox
						name={__('PayPal', 'surecart')}
						help={__('Enable PayPal payment', 'surecart')}
						id={'paypal'}
						attributes={attributes}
						setAttributes={setAttributes}
					/>
				</PanelRow>

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
