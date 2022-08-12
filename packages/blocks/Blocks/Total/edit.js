import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

export default ({ attributes, setAttributes }) => {
	const { text, subscription_text } = attributes;

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
							label={__('Label with Free Trial', 'surecart')}
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
			</sc-line-item-total>
		</Fragment>
	);
};
