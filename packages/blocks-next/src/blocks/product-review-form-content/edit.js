/**
 * WordPress dependencies.
 */
import {
	useBlockProps,
	InspectorControls,
	RichText,
	BlockControls,
	AlignmentControl,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Labels from './labels';

export default function Edit({ attributes, setAttributes }) {
	const { label, placeholder, rows, text_align } = attributes;

	const blockProps = useBlockProps({
		style: {
			textAlign: text_align,
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
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<RangeControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Rows', 'surecart')}
						value={rows}
						onChange={(value) => setAttributes({ rows: value })}
						min={2}
						max={10}
						help={__(
							'Number of visible text lines for the textarea.',
							'surecart'
						)}
					/>
				</PanelBody>
				<Labels attributes={attributes} setAttributes={setAttributes} />
			</InspectorControls>

			<div {...blockProps}>
				{label && (
					<RichText
						tagName="label"
						className="sc-form-label"
						aria-label={__('Label', 'surecart')}
						placeholder={__('Your review', 'surecart')}
						value={label}
						onChange={(label) => setAttributes({ label })}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
					/>
				)}

				<textarea
					name="content"
					className="sc-form-control"
					placeholder={placeholder}
					required={false}
					rows={rows}
				/>
			</div>
		</>
	);
}
