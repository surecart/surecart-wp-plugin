import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Icon from '../../components/Icon';

export default ({ attributes: { label }, setAttributes }) => {
	const blockProps = useBlockProps();

	return (
		<>
			<div {...blockProps}>
				<Icon name="sliders" className="sc-sidebar-toggle__icon" />
				<RichText
					tagName="span"
					aria-label={__('Label text', 'surecart')}
					placeholder={__('Add label…', 'surecart')}
					value={label}
					onChange={(label) => setAttributes({ label })}
					withoutInteractiveFormatting
					allowedFormats={['core/bold', 'core/italic']}
				/>
			</div>
		</>
	);
};
