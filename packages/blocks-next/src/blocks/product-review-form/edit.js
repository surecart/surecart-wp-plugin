/**
 * WordPress dependencies.
 */
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	BlockControls,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { edit, check } from '@wordpress/icons';
import { useEffect } from '@wordpress/element';

// Render toolbar controls for the review form
function ReviewFormToolbar({ editingView, onChangeEditingView }) {
	return (
		<BlockControls>
			<ToolbarGroup>
				<ToolbarButton
					// icon={edit}
					isPressed={editingView === 'form'}
					onClick={() => onChangeEditingView('form')}
				>
					{__('Edit Form', 'surecart')}
				</ToolbarButton>
				<ToolbarButton
					// icon={check}
					isPressed={editingView === 'confirmation'}
					onClick={() => onChangeEditingView('confirmation')}
				>
					{__('Edit Confirmation', 'surecart')}
				</ToolbarButton>
			</ToolbarGroup>
		</BlockControls>
	);
}

export default function Edit({ attributes, setAttributes }) {
	const { alignment, width, height, editingView = 'form' } = attributes;
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);

	// Always start with form view on load.
	useEffect(() => {
		if (editingView !== 'form') {
			setAttributes({ editingView: 'form' });
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const blockProps = useBlockProps({
		className: 'sc-lightbox-overlay',
		style: {
			maxWidth: width || '',
			height: height || '',
			...spacingProps.style,
			...colorProps.style,
		},
	});

	return (
		<>
			<ReviewFormToolbar
				editingView={editingView}
				onChangeEditingView={(view) =>
					setAttributes({ editingView: view })
				}
			/>

			<InspectorControls>
				<PanelBody title={__('Modal Settings', 'surecart')}>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Alignment', 'surecart')}
						value={alignment}
						options={[
							{
								label: __('Top Left', 'surecart'),
								value: 'top left',
							},
							{
								label: __('Top Center', 'surecart'),
								value: 'top center',
							},
							{
								label: __('Top Right', 'surecart'),
								value: 'top right',
							},
							{
								label: __('Center Left', 'surecart'),
								value: 'center left',
							},
							{
								label: __('Center Center', 'surecart'),
								value: 'center center',
							},
							{
								label: __('Center Right', 'surecart'),
								value: 'center right',
							},
							{
								label: __('Bottom Left', 'surecart'),
								value: 'bottom left',
							},
							{
								label: __('Bottom Center', 'surecart'),
								value: 'bottom center',
							},
							{
								label: __('Bottom Right', 'surecart'),
								value: 'bottom right',
							},
						]}
						onChange={(value) =>
							setAttributes({ alignment: value })
						}
					/>

					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Width', 'surecart')}
						value={width}
						onChange={(value) => setAttributes({ width: value })}
						help={__(
							'CSS width value (e.g., 500px, 80%, auto)',
							'surecart'
						)}
					/>

					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Height', 'surecart')}
						value={height}
						onChange={(value) => setAttributes({ height: value })}
						help={__(
							'CSS height value (e.g., 400px, 60vh, auto)',
							'surecart'
						)}
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

// Export the toolbar component for use in child blocks
export { ReviewFormToolbar };
