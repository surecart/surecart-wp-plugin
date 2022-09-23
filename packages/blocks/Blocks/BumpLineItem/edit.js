import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { ScLineItem, ScFormatNumber } from '@surecart/components-react';
import { Fragment } from '@wordpress/element';

export default ({ attributes, setAttributes }) => {
	const { label } = attributes;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<ScLineItem>
				<span slot="description">
					{label || __('Bundle Discount', 'surecart')}
				</span>
				<span slot="price">
					<ScFormatNumber
						type="currency"
						currency={scBlockData?.currency || 'usd'}
						value={-123}
					></ScFormatNumber>
				</span>
			</ScLineItem>
		</Fragment>
	);
};
