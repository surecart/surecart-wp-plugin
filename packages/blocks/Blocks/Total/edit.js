import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

export default ({ attributes, setAttributes }) => {
	const {
		text,
		subscription_text,
		free_trial_text,
		first_payment_total_text,
	} = attributes;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={text}
							onChange={(text) => setAttributes({ text })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Free Trial Label', 'surecart')}
							value={free_trial_text}
							onChange={(free_trial_text) =>
								setAttributes({ free_trial_text })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('First Payment Total Label', 'surecart')}
							value={first_payment_total_text}
							onChange={(first_payment_total_text) =>
								setAttributes({ first_payment_total_text })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Amount Due Label', 'surecart')}
							value={subscription_text}
							onChange={(subscription_text) =>
								setAttributes({ subscription_text })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<sc-line-item-total total="total" size="large" show-currency>
				<span slot="title">{text}</span>
				<span slot="subscription-title">
					{subscription_text || text}
				</span>
				<span slot="first-payment-total-description">
					{first_payment_total_text}
				</span>
				<span slot="free-trial-description">{free_trial_text}</span>
			</sc-line-item-total>
		</Fragment>
	);
};
