import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

export default ({ attributes, setAttributes }) => {
	const {
		text,
		subscription_text,
		due_amount_text,
		free_trial_text,
		first_payment_total_text,
	} = attributes;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Total Label', 'surecart')}
							value={text}
							onChange={(text) => setAttributes({ text })}
							placeholder={__('Total', 'surecart')}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Free Trial Label', 'surecart')}
							value={free_trial_text}
							onChange={(free_trial_text) =>
								setAttributes({ free_trial_text })
							}
							placeholder={__('Free Trial', 'surecart')}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('First Payment Total Label', 'surecart')}
							value={first_payment_total_text}
							onChange={(first_payment_total_text) =>
								setAttributes({ first_payment_total_text })
							}
							placeholder={__('First Payment Total', 'surecart')}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Amount Due Label', 'surecart')}
							value={due_amount_text}
							onChange={(due_amount_text) =>
								setAttributes({ due_amount_text })
							}
							placeholder={__('Total Due', 'surecart')}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Total Due Today Label', 'surecart')}
							value={subscription_text}
							onChange={(subscription_text) =>
								setAttributes({ subscription_text })
							}
							placeholder={__('Total Due Today', 'surecart')}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<sc-line-item-total total="total" size="large" show-currency>
				<span slot="title">{text || __('Total', 'surecart')}</span>
				<span slot="subscription-title">
					{subscription_text || text || __('Total', 'surecart')}
				</span>
				<span slot="first-payment-total-description">
					{first_payment_total_text ||
						__('First Payment Total', 'surecart')}
				</span>
				<span slot="free-trial-description">
					{free_trial_text || __('Free Trial', 'surecart')}
				</span>
				<span slot="due-amount-description">
					{due_amount_text || __('Total Due', 'surecart')}
				</span>
			</sc-line-item-total>
		</Fragment>
	);
};
