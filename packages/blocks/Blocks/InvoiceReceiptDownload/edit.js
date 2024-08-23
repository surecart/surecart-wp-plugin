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

			<sc-line-item-invoice-receipt-download
				receipt-download-link={'https://example.com/'}
			>
				<span slot="title">
					{text || __('Invoice Receipt', 'surecart')}
				</span>
			</sc-line-item-invoice-receipt-download>
		</Fragment>
	);
};
