import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

export default ({ attributes, setAttributes }) => {
	const {
		text,
		total_payments_text,
		first_payment_subtotal_text,
		free_trial_text,
	} = attributes;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Subtotal Label', 'surecart')}
							value={text}
							onChange={(text) => setAttributes({ text })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Total Payments Label', 'surecart')}
							value={total_payments_text}
							onChange={(total_payments_text) =>
								setAttributes({ total_payments_text })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__(
								'First Payment Subtotal Label',
								'surecart'
							)}
							value={first_payment_subtotal_text}
							onChange={(first_payment_subtotal_text) =>
								setAttributes({ first_payment_subtotal_text })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<sc-line-item-total total="subtotal">
				<span slot="description">{text}</span>
				<span slot="total-payments-description">
					{total_payments_text}
				</span>
				<span slot="first-payment-subtotal-description">
					{first_payment_subtotal_text}
				</span>
			</sc-line-item-total>
		</Fragment>
	);
};
