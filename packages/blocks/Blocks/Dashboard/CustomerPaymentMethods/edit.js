import { __, _n, sprintf } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { title } = attributes;
	return (
		<div>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'checkout_engine')}>
					<PanelRow>
						<TextControl
							label={__('Title', 'checkout_engine')}
							value={title}
							onChange={(title) => setAttributes({ title })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			payment methods
		</div>
	);
};
