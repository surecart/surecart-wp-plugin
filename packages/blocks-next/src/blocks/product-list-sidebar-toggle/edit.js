import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Icon from '../../components/Icon';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';

export default ({ attributes: { label }, setAttributes }) => {
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<Icon name="filter" />
				{label || __('Filter', 'surecart')}
			</div>
		</>
	);
};
