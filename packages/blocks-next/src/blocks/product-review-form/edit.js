/**
 * WordPress dependencies
 */
import { 
	useBlockProps, 
	InnerBlocks,
	InspectorControls 
} from '@wordpress/block-editor';
import { 
	PanelBody, 
	SelectControl, 
	TextControl 
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes }) {
	const { alignment, width, height } = attributes;

	const blockProps = useBlockProps({
		className: 'sc-lightbox-overlay',
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Modal Settings', 'surecart')}>
					<SelectControl
						label={__('Alignment', 'surecart')}
						value={alignment}
						options={[
							{ label: __('Top Left', 'surecart'), value: 'top left' },
							{ label: __('Top Center', 'surecart'), value: 'top center' },
							{ label: __('Top Right', 'surecart'), value: 'top right' },
							{ label: __('Center Left', 'surecart'), value: 'center left' },
							{ label: __('Center Center', 'surecart'), value: 'center center' },
							{ label: __('Center Right', 'surecart'), value: 'center right' },
							{ label: __('Bottom Left', 'surecart'), value: 'bottom left' },
							{ label: __('Bottom Center', 'surecart'), value: 'bottom center' },
							{ label: __('Bottom Right', 'surecart'), value: 'bottom right' },
						]}
						onChange={(value) => setAttributes({ alignment: value })}
					/>
					
					<TextControl
						label={__('Width', 'surecart')}
						value={width}
						onChange={(value) => setAttributes({ width: value })}
						help={__('CSS width value (e.g., 500px, 80%, auto)', 'surecart')}
					/>

					<TextControl
						label={__('Height', 'surecart')}
						value={height}
						onChange={(value) => setAttributes({ height: value })}
						help={__('CSS height value (e.g., 400px, 60vh, auto)', 'surecart')}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="sc-lightbox-content">
					<InnerBlocks />
				</div>
			</div>
		</>
	);
}