import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

export default ({ attributes, setAttributes }) => {
	const { text, total_payments_text, first_payment_subtotal_text } =
		attributes;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Subtotal Label', 'surecart')}
							value={text}
							onChange={(text) => setAttributes({ text })}
							placeholder={__('Subtotal', 'surecart')}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Total Installment Payments Label', 'surecart')}
							value={total_payments_text}
							onChange={(total_payments_text) =>
								setAttributes({ total_payments_text })
							}
							placeholder={__('Total Installment Payments', 'surecart')}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__(
								'Initial Payment Label',
								'surecart'
							)}
							value={first_payment_subtotal_text}
							onChange={(first_payment_subtotal_text) =>
								setAttributes({ first_payment_subtotal_text })
							}
							placeholder={__(
								'Initial Payment',
								'surecart'
							)}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<sc-line-item-total total="subtotal">
				<span slot="description">
					{text || __('Subtotal', 'surecart')}
				</span>
				<span slot="total-payments-description">
					{total_payments_text || __('Total Installment Payments', 'surecart')}
				</span>
				<span slot="first-payment-subtotal-description">
					{first_payment_subtotal_text ||
						__('Initial Payment', 'surecart')}
				</span>
			</sc-line-item-total>
		</Fragment>
	);
};
