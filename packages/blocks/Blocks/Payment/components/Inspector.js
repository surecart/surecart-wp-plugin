/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	BaseControl,
	CheckboxControl,
	PanelBody,
	PanelRow,
	RadioControl,
	TextControl,
} from '@wordpress/components';
import { hasProcessor } from '../util';
import PaymentMethodCheckbox from './PaymentMethodCheckbox';

export default ({ attributes, setAttributes }) => {
	const { label, secure_notice, default_processor, disabled_methods } =
		attributes;

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

				<PanelRow>
					<BaseControl.VisualLabel>
						{__('Enabled Processors', 'surecart')}
					</BaseControl.VisualLabel>
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
