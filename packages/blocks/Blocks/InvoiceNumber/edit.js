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
							label={__('Invoice Number Label', 'surecart')}
							value={text}
							onChange={(text) => setAttributes({ text })}
							placeholder={__('Invoice Number', 'surecart')}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<sc-line-item-invoice-number number="0001">
				<span slot="description">
					{text || __('Invoice Number', 'surecart')}
				</span>
			</sc-line-item-invoice-number>
		</Fragment>
	);
};
