/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { ScCartSubmit } from '@surecart/components-react';

export default ({ className, attributes, setAttributes, context }) => {
	const { type, text, full, size, show_icon, border } = attributes;
	const slot = context?.['surecart/slot'] || 'footer';

	const getPaddingCSS = () => {
		if (border) {
			return '';
		}
		return slot === 'footer' ? 'padding-top: 0;' : 'padding-bottom: 0;';
	};

	const getBorderCSS = () => {
		if (!border) {
			return;
		}
		return slot === 'footer'
			? 'border-top: var(--sc-drawer-border);'
			: 'border-bottom: var(--sc-drawer-border);';
	};

	const blockProps = useBlockProps({
		css: css`
			padding: var(--sc-drawer-${slot}-spacing);
			${getPaddingCSS()}
			${getBorderCSS()}
		`,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<ToggleControl
							label={__('Border', 'surecart')}
							checked={border}
							onChange={(border) => setAttributes({ border })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Button Text', 'surecart')}
							value={text}
							onChange={(text) => setAttributes({ text })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Full', 'surecart')}
							checked={full}
							onChange={(full) => setAttributes({ full })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show a secure lock icon.', 'surecart')}
							checked={show_icon}
							onChange={(show_icon) =>
								setAttributes({ show_icon })
							}
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
							label={__('Size', 'surecart')}
							value={size}
							onChange={(size) => {
								setAttributes({ size });
							}}
							options={[
								{
									value: null,
									label: 'Select a Size',
									disabled: true,
								},
								{
									value: 'small',
									label: __('Small', 'surecart'),
								},
								{
									value: 'medium',
									label: __('Medium', 'surecart'),
								},
								{
									value: 'large',
									label: __('Large', 'surecart'),
								},
							]}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScCartSubmit
					className={className}
					type={type}
					full={full}
					size={size}
					icon={show_icon ? 'lock' : false}
				>
					<RichText
						aria-label={__('Button text')}
						placeholder={__('Add text…')}
						value={text}
						onChange={(value) => setAttributes({ text: value })}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
					/>
				</ScCartSubmit>
			</div>
		</>
	);
};
