import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { separator } = attributes;
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Variant Options Settings', 'surecart')}>
					<TextControl
						label={__('Separator', 'surecart')}
						value={separator}
						onChange={(value) =>
							setAttributes({ separator: value })
						}
						help={__(
							'Character(s) to separate variant options',
							'surecart'
						)}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{__('Small', 'surecart')} {separator} {__('Red', 'surecart')}{' '}
				{separator} {__('Cotton', 'surecart')}
			</div>
		</>
	);
};
