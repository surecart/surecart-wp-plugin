/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { label } = attributes;

	const blockProps = useBlockProps();

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
			<sc-line-item {...blockProps}>
				<span slot="description">
					{label || __('Shipping Amount', 'surecart')}
				</span>
				<span slot="price">
					<sc-format-number
						type="currency"
						currency={scData?.currency}
						value={1234}
					></sc-format-number>
				</span>
			</sc-line-item>
		</Fragment>
	);
};
