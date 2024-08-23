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
							label={__('Invoice Due Date Label', 'surecart')}
							value={text}
							onChange={(text) => setAttributes({ text })}
							placeholder={__('Invoice Due Date', 'surecart')}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<sc-line-item-invoice-due-date due-date={new Date().getTime() / 1000}>
				<span slot="title">
					{text || __('Invoice Due Date', 'surecart')}
				</span>
			</sc-line-item-invoice-due-date>
		</Fragment>
	);
};
