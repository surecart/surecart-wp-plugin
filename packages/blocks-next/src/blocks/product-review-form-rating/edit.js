/**
 * WordPress dependencies.
 */
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	AlignmentControl,
	RichText,
} from '@wordpress/block-editor';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import ColorInspectorControl from '../../components/ColorInspectorControl';
import ScIcon from '../../components/ScIcon';
import UnitSpacingControl from '../../components/UnitSpacingControl';

export default function Edit({ attributes, setAttributes, clientId }) {
	const { label, fill_color, size, text_align } = attributes;
	const blockProps = useBlockProps({
		style: {
			textAlign: text_align || 'left',
		},
	});

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={text_align}
					onChange={(nextAlign) => {
						setAttributes({ text_align: nextAlign });
					}}
				/>
			</BlockControls>
			<InspectorControls group="dimensions">
				<ToolsPanelItem
					hasValue={() => size !== undefined}
					label={__('Star Size', 'surecart')}
					onDeselect={() => setAttributes({ size: undefined })}
					resetAllFilter={() => setAttributes({ size: undefined })}
					isShownByDefault
					panelId={clientId}
				>
					<UnitSpacingControl
						label={__('Star Size', 'surecart')}
						value={size}
						onChange={(value) => setAttributes({ size: value })}
						min={10}
						max={60}
					/>
				</ToolsPanelItem>
			</InspectorControls>
			<ColorInspectorControl
				settings={[
					{
						colorValue: fill_color,
						label: __('Star Color', 'surecart'),
						onColorChange: (color) =>
							setAttributes({ fill_color: color }),
						resetAllFilter: () =>
							setAttributes({ fill_color: undefined }),
					},
				]}
				panelId={clientId}
			/>

			<div {...blockProps}>
				{label && (
					<RichText
						tagName="label"
						className="sc-form-label"
						aria-label={__('Label', 'surecart')}
						placeholder={__('Review Content', 'surecart')}
						value={label ?? __('Your rating', 'surecart')}
						onChange={(label) => setAttributes({ label })}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
					/>
				)}

				<div>
					{[1, 2, 3, 4].map((star) => (
						<ScIcon
							key={star}
							name="star"
							width={size}
							height={size}
							fill={fill_color || 'var(--sc-color-primary-500)'}
							stroke={fill_color || 'var(--sc-color-primary-500)'}
							strokeWidth={2}
						/>
					))}
					<ScIcon
						name="star"
						width={size}
						height={size}
						stroke={fill_color || 'var(--sc-color-primary-500)'}
						strokeWidth={2}
					/>
				</div>
			</div>
		</>
	);
}
