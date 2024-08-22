import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

export default ({ attributes, setAttributes }) => {
	const { text } = attributes;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Invoice Receipt Label', 'surecart')}
							value={text}
							onChange={(text) => setAttributes({ text })}
							placeholder={__('Invoice Receipt', 'surecart')}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<sc-line-item-invoice-receipt-download>
				<span slot="title">
					{text || __('Invoice Receipt', 'surecart')}
				</span>
				<span slot="price">
					<sc-icon name="download" />
				</span>
			</sc-line-item-invoice-receipt-download>
		</Fragment>
	);
};
